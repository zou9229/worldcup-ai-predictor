import { createFileRoute } from '@tanstack/react-router';

import {
  getWorldCupSyncStatus,
  runWorldCupSync,
} from '@/modules/worldcup-sync/service';
import { respData, respErr } from '@/lib/resp';

async function GET() {
  return respData(await getWorldCupSyncStatus());
}

async function POST({ request }: { request: Request }) {
  const secret = process.env.WORLD_CUP_SYNC_SECRET;

  if (!secret || request.headers.get('x-worldcup-sync-secret') !== secret) {
    return respErr('Unauthorized');
  }

  return respData(await runWorldCupSync('api'));
}

export const Route = createFileRoute('/api/worldcup-sync')({
  server: {
    handlers: { GET, POST },
  },
});
