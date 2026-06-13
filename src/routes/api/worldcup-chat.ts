import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getAuth } from '@/core/auth';
import {
  generateTextWithVertexGeminiFallbacks,
  parseVertexFallbackModels,
} from '@/core/ai/vertex-gemini';
import { createTask, updateTask, AITaskStatus } from '@/modules/ai-tasks/service';
import { getAllConfigs } from '@/modules/config/service';
import { getSyncedWorldCupMatches } from '@/modules/worldcup-sync/service';
import { respData, respErr } from '@/lib/resp';
import { buildWorldCupAssistantPrompt } from '@/lib/worldcup';

const chatSchema = z.object({
  message: z.string().min(2).max(1200),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(1200),
      })
    )
    .max(8)
    .optional(),
});

async function POST({ request }: { request: Request }) {
  let task: any | undefined;

  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const body = chatSchema.parse(await request.json());
    const configs = await getAllConfigs();
    if (!configs.gemini_vertex_service_account_json) {
      return respErr('Vertex AI is not configured. Add Gemini Vertex settings in /admin/settings first.');
    }

    const model = configs.gemini_vertex_model || 'gemini-2.5-flash';
    task = await createTask({
      userId: session.user.id,
      mediaType: 'text',
      provider: 'vertex-gemini',
      model,
      prompt: body.message,
      costCredits: 1,
      options: {
        surface: 'worldcup-floating-assistant',
      },
    });

    const matches = await getSyncedWorldCupMatches();
    const result = await generateTextWithVertexGeminiFallbacks({
      projectId: configs.gemini_vertex_project_id || undefined,
      location: configs.gemini_vertex_location || 'us-central1',
      model,
      fallbackModels: parseVertexFallbackModels(configs.gemini_vertex_fallback_models),
      serviceAccountJson: configs.gemini_vertex_service_account_json,
      prompt: buildWorldCupAssistantPrompt({
        message: body.message,
        history: body.history || [],
        matches,
      }),
      generationConfig: {
        temperature: 0.35,
        topP: 0.9,
        maxOutputTokens: 900,
      },
    });

    await updateTask({
      taskId: task.id,
      status: AITaskStatus.SUCCESS,
      taskResult: {
        text: result.text,
        model: result.model,
        surface: 'worldcup-floating-assistant',
      },
    });

    return respData({
      text: result.text,
      taskId: task.id,
      model: result.model,
    });
  } catch (error: any) {
    if (task?.id) {
      await updateTask({
        taskId: task.id,
        status: AITaskStatus.FAILED,
        taskResult: { error: error?.message || 'World Cup chat failed' },
      }).catch(() => {});
    }

    if (error instanceof z.ZodError) {
      return respErr(error.issues[0]?.message || 'Invalid request');
    }
    return respErr(error?.message || 'World Cup chat failed');
  }
}

export const Route = createFileRoute('/api/worldcup-chat')({
  server: {
    handlers: { POST },
  },
});
