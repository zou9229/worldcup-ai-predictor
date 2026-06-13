import {
  AIConfigs,
  AIGenerateParams,
  AIMediaType,
  AIProvider,
  AITaskResult,
  AITaskStatus,
  UuidFunction,
} from './types';

interface VertexServiceAccount {
  project_id?: string;
  client_email: string;
  private_key: string;
  token_uri?: string;
}

interface AccessTokenCache {
  token: string;
  expiresAt: number;
}

export interface VertexGeminiTextParams {
  projectId?: string;
  location?: string;
  model?: string;
  serviceAccountJson?: string;
  prompt: string;
  generationConfig?: Record<string, unknown>;
}

export interface VertexGeminiTextResult {
  text: string;
  model: string;
  raw: unknown;
}

export interface VertexGeminiConfigs extends AIConfigs {
  projectId?: string;
  location?: string;
  model?: string;
  serviceAccountJson: string;
  uuid?: UuidFunction;
}

const VERTEX_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const TOKEN_REFRESH_SKEW_MS = 60 * 1000;
const accessTokenCache = new Map<string, AccessTokenCache>();
const defaultUuid: UuidFunction = () => crypto.randomUUID();

function parseServiceAccount(serviceAccountJson?: string): VertexServiceAccount | null {
  if (!serviceAccountJson) return null;

  try {
    const parsed = JSON.parse(serviceAccountJson) as VertexServiceAccount;
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    if (!parsed.client_email || !parsed.private_key) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function base64UrlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value), 'utf-8').toString('base64url');
}

function base64UrlBytes(value: ArrayBuffer) {
  return Buffer.from(value).toString('base64url');
}

function pemToPkcs8(privateKey: string) {
  const base64 = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');
  return Buffer.from(base64, 'base64');
}

async function createServiceAccountJwt(serviceAccount: VertexServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = serviceAccount.token_uri || 'https://oauth2.googleapis.com/token';
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };
  const payload = {
    iss: serviceAccount.client_email,
    scope: VERTEX_SCOPE,
    aud: tokenUri,
    exp: now + 3600,
    iat: now,
  };

  const unsignedJwt = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToPkcs8(serviceAccount.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsignedJwt)
  );

  return `${unsignedJwt}.${base64UrlBytes(signature)}`;
}

async function getAccessToken(serviceAccount: VertexServiceAccount) {
  const tokenUri = serviceAccount.token_uri || 'https://oauth2.googleapis.com/token';
  const cacheKey = `${serviceAccount.client_email}:${tokenUri}`;
  const cachedToken = accessTokenCache.get(cacheKey);

  if (cachedToken && cachedToken.expiresAt - TOKEN_REFRESH_SKEW_MS > Date.now()) {
    return cachedToken.token;
  }

  const assertion = await createServiceAccountJwt(serviceAccount);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  let resp: Response;
  try {
    resp = await fetch(tokenUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
  } catch (error) {
    throw new Error(
      `Vertex AI auth fetch failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Vertex AI auth failed with status: ${resp.status}, body: ${errorText}`);
  }

  const data = await resp.json();
  if (!data.access_token) {
    throw new Error('Vertex AI auth failed: no access token returned');
  }

  const token = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };
  accessTokenCache.set(cacheKey, token);

  return token.token;
}

function getVertexApiBaseUrl(location: string) {
  if (location === 'global') {
    return 'https://aiplatform.googleapis.com';
  }

  return `https://${location}-aiplatform.googleapis.com`;
}

function extractTextFromParts(parts: unknown) {
  if (!Array.isArray(parts)) {
    return '';
  }

  return parts
    .map((part: any) => part?.text)
    .filter((text: unknown): text is string => typeof text === 'string')
    .join('\n')
    .trim();
}

function shouldDisableThinking(model: string) {
  const normalized = model.toLowerCase();
  return normalized.includes('gemini-2.5-flash') || normalized.includes('gemini-2.5-flash-lite');
}

export function parseVertexFallbackModels(value?: string) {
  return (value || '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function generateTextWithVertexGemini({
  projectId,
  location = 'us-central1',
  model = 'gemini-2.5-flash',
  serviceAccountJson,
  prompt,
  generationConfig,
}: VertexGeminiTextParams): Promise<VertexGeminiTextResult> {
  const serviceAccount = parseServiceAccount(serviceAccountJson);
  if (!serviceAccount) {
    throw new Error('Vertex AI service account json is required');
  }

  const resolvedProjectId = projectId || serviceAccount.project_id;
  if (!resolvedProjectId) {
    throw new Error('Vertex AI project id is required');
  }

  const accessToken = await getAccessToken(serviceAccount);
  const apiUrl = `${getVertexApiBaseUrl(location)}/v1/projects/${resolvedProjectId}/locations/${location}/publishers/google/models/${model}:generateContent`;
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.9,
      maxOutputTokens: 4096,
      ...(shouldDisableThinking(model)
        ? {
            thinkingConfig: {
              thinkingBudget: 0,
            },
          }
        : {}),
      ...generationConfig,
    },
  };

  let resp: Response;
  try {
    resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(
      `Vertex AI Gemini fetch failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Vertex AI request failed with status: ${resp.status}, body: ${errorText}`);
  }

  const data = await resp.json();
  const candidate = data.candidates?.[0];
  const text = extractTextFromParts(candidate?.content?.parts);

  if (!text) {
    throw new Error(
      `Vertex AI returned no text. finishReason: ${candidate?.finishReason || 'unknown'}`
    );
  }

  return {
    text,
    model,
    raw: data,
  };
}

export async function generateTextWithVertexGeminiFallbacks(
  params: VertexGeminiTextParams & { fallbackModels?: string[] }
): Promise<VertexGeminiTextResult> {
  const models = [params.model, ...(params.fallbackModels || [])].filter(Boolean) as string[];
  const candidates = models.length > 0 ? models : ['gemini-2.5-flash'];
  const errors: string[] = [];

  for (const model of candidates) {
    try {
      return await generateTextWithVertexGemini({ ...params, model });
    } catch (error) {
      errors.push(`${model}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(`All Vertex AI Gemini models failed: ${errors.join(' | ')}`);
}

export class VertexGeminiProvider implements AIProvider {
  readonly name = 'vertex-gemini';
  configs: VertexGeminiConfigs;

  constructor(configs: VertexGeminiConfigs) {
    this.configs = configs;
  }

  private getUuid(): string {
    return (this.configs.uuid || defaultUuid)();
  }

  async generate({ params }: { params: AIGenerateParams }): Promise<AITaskResult> {
    const { mediaType, model, prompt, options } = params;

    if (mediaType !== AIMediaType.TEXT) {
      throw new Error(`mediaType not supported: ${mediaType}`);
    }

    if (!prompt) {
      throw new Error('prompt is required');
    }

    const result = await generateTextWithVertexGemini({
      projectId: this.configs.projectId,
      location: this.configs.location,
      model: model || this.configs.model,
      serviceAccountJson: this.configs.serviceAccountJson,
      prompt,
      generationConfig: options?.generationConfig || options,
    });

    return {
      taskStatus: AITaskStatus.SUCCESS,
      taskId: this.getUuid(),
      taskInfo: {
        status: 'success',
        text: result.text,
        createTime: new Date(),
      },
      taskResult: result.raw,
    };
  }
}
