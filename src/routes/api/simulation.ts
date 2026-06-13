import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getAuth } from '@/core/auth';
import {
  generateTextWithVertexGeminiFallbacks,
  parseVertexFallbackModels,
} from '@/core/ai/vertex-gemini';
import { getAllConfigs } from '@/modules/config/service';
import {
  createTask,
  updateTask,
  AITaskStatus,
} from '@/modules/ai-tasks/service';
import { respData, respErr } from '@/lib/resp';
import {
  buildSimulationPrompt,
  getMatchBySlug,
} from '@/lib/worldcup';

const simulationSchema = z.object({
  matchSlug: z.string().min(1),
  scenario: z.string().min(3).max(800),
});

async function POST({ request }: { request: Request }) {
  let task: any | undefined;

  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const body = simulationSchema.parse(await request.json());
    const match = getMatchBySlug(body.matchSlug);
    if (!match) return respErr('Match not found');

    const configs = await getAllConfigs();
    if (!configs.gemini_vertex_service_account_json) {
      return respErr('Vertex AI is not configured. Add Gemini Vertex settings in /admin/settings first.');
    }

    task = await createTask({
      userId: session.user.id,
      mediaType: 'text',
      provider: 'vertex-gemini',
      model: configs.gemini_vertex_model || 'gemini-2.5-flash',
      prompt: body.scenario,
      costCredits: 1,
      options: {
        matchSlug: match.slug,
      },
    });

    const result = await generateTextWithVertexGeminiFallbacks({
      projectId: configs.gemini_vertex_project_id || undefined,
      location: configs.gemini_vertex_location || 'us-central1',
      model: configs.gemini_vertex_model || 'gemini-2.5-flash',
      fallbackModels: parseVertexFallbackModels(configs.gemini_vertex_fallback_models),
      serviceAccountJson: configs.gemini_vertex_service_account_json,
      prompt: buildSimulationPrompt(match, body.scenario),
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
        matchSlug: match.slug,
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
        taskResult: { error: error?.message || 'Simulation failed' },
      }).catch(() => {});
    }

    if (error instanceof z.ZodError) {
      return respErr(error.issues[0]?.message || 'Invalid request');
    }
    return respErr(error?.message || 'Simulation failed');
  }
}

export const Route = createFileRoute('/api/simulation')({
  server: {
    handlers: { POST },
  },
});
