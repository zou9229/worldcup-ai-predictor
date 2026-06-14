import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  DatabaseZap,
  ExternalLink,
  type LucideIcon,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { apiGet, apiPost } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type MatchStatus = 'upcoming' | 'live_or_pending' | 'completed' | 'stale';

interface SyncStatus {
  ok: boolean;
  sourceUrl: string;
  matchCount: number;
  lastSyncedAt?: string;
  error?: string;
  sourceName?: string;
}

interface AdminMatch {
  id: string;
  round: string;
  group: string | null;
  date: string;
  time: string;
  kickoffAt: string | null;
  teamA: string;
  teamB: string;
  ground: string;
  score: string | null;
  status: MatchStatus;
  slug: string;
  watchSlug: string;
}

interface SyncDashboard {
  status: SyncStatus;
  summary: {
    total: number;
    completed: number;
    upcoming: number;
    liveOrPending: number;
    stale: number;
    usingFallbackSnapshot: boolean;
    nextMatch: AdminMatch | null;
  };
  matches: AdminMatch[];
  rawJson: string;
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function statusText(status: MatchStatus) {
  const labels = {
    upcoming: m['admin.worldcup_sync.status_upcoming'](),
    live_or_pending: m['admin.worldcup_sync.status_live_or_pending'](),
    completed: m['admin.worldcup_sync.status_completed'](),
    stale: m['admin.worldcup_sync.status_stale'](),
  };
  return labels[status];
}

function statusVariant(status: MatchStatus) {
  if (status === 'completed') return 'secondary' as const;
  if (status === 'upcoming') return 'default' as const;
  if (status === 'live_or_pending') return 'outline' as const;
  return 'destructive' as const;
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function WorldCupSyncPage() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin-worldcup-sync'],
    queryFn: () => apiGet<SyncDashboard>('/api/admin/worldcup-sync'),
  });

  const syncMutation = useMutation({
    mutationFn: () => apiPost<SyncDashboard>('/api/admin/worldcup-sync', {}),
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-worldcup-sync'], data);
      toast.success(m['admin.worldcup_sync.manual_success']());
    },
    onError: (error: Error) => {
      toast.error(error.message || m['admin.worldcup_sync.manual_failed']());
    },
  });

  const data = query.data;
  const nextMatch = data?.summary.nextMatch ?? null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <DatabaseZap className="size-5 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {m['admin.worldcup_sync.title']()}
            </h1>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            {m['admin.worldcup_sync.description']()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data?.status.sourceUrl ? (
            <a
              href={data.status.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              <ExternalLink className="size-4" />
              {m['admin.worldcup_sync.view_source']()}
            </a>
          ) : null}
          <Button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
          >
            {syncMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            {syncMutation.isPending
              ? m['admin.worldcup_sync.refreshing']()
              : m['admin.worldcup_sync.sync_now']()}
          </Button>
        </div>
      </div>

      {query.isLoading ? (
        <Card>
          <CardContent className="flex h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {m['admin.worldcup_sync.loading']()}
          </CardContent>
        </Card>
      ) : query.isError ? (
        <Card className="border-destructive/30">
          <CardContent className="flex items-center gap-2 p-5 text-sm text-destructive">
            <AlertTriangle className="size-4" />
            {(query.error as Error).message}
          </CardContent>
        </Card>
      ) : data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title={m['admin.worldcup_sync.match_count']()}
              value={data.summary.total}
              icon={DatabaseZap}
            />
            <StatCard
              title={m['admin.worldcup_sync.completed']()}
              value={data.summary.completed}
              icon={CheckCircle2}
            />
            <StatCard
              title={m['admin.worldcup_sync.upcoming']()}
              value={data.summary.upcoming}
              icon={CalendarClock}
            />
            <StatCard
              title={m['admin.worldcup_sync.last_synced']()}
              value={
                data.status.lastSyncedAt
                  ? formatDateTime(data.status.lastSyncedAt)
                  : m['admin.worldcup_sync.never_synced']()
              }
              icon={RefreshCw}
            />
          </div>

          {data.summary.usingFallbackSnapshot ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>{m['admin.worldcup_sync.fallback_note']()}</p>
            </div>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="size-5 text-primary" />
                {m['admin.worldcup_sync.next_match']()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextMatch ? (
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="text-xl font-semibold">
                      {nextMatch.teamA} vs {nextMatch.teamB}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDateTime(nextMatch.kickoffAt)} · {nextMatch.ground}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline">{nextMatch.round}</Badge>
                      {nextMatch.group ? <Badge variant="outline">{nextMatch.group}</Badge> : null}
                      <Badge variant={statusVariant(nextMatch.status)}>
                        {statusText(nextMatch.status)}
                      </Badge>
                    </div>
                  </div>
                  <Link
                    href={`/matches/${nextMatch.slug}`}
                    className={cn(buttonVariants({ variant: 'outline' }))}
                  >
                    {m['admin.worldcup_sync.open_match']()}
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {m['admin.worldcup_sync.no_next_match']()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <CardTitle>{m['admin.worldcup_sync.table_title']()}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {m['admin.worldcup_sync.table_description']()}
                  </p>
                </div>
                <Badge variant={data.status.ok ? 'secondary' : 'destructive'}>
                  {data.status.ok
                    ? m['admin.worldcup_sync.status_ok']()
                    : m['admin.worldcup_sync.status_failed']()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{m['admin.worldcup_sync.date_time']()}</TableHead>
                    <TableHead>{m['admin.worldcup_sync.match']()}</TableHead>
                    <TableHead>{m['admin.worldcup_sync.round']()}</TableHead>
                    <TableHead>{m['admin.worldcup_sync.venue']()}</TableHead>
                    <TableHead>{m['admin.worldcup_sync.status']()}</TableHead>
                    <TableHead>{m['admin.worldcup_sync.score']()}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(match.kickoffAt)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/matches/${match.slug}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {match.teamA} vs {match.teamB}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline">{match.round}</Badge>
                          {match.group ? <Badge variant="outline">{match.group}</Badge> : null}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[240px] truncate text-muted-foreground">
                        {match.ground}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(match.status)}>
                          {statusText(match.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{match.score ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{m['admin.worldcup_sync.raw_snapshot']()}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {m['admin.worldcup_sync.raw_json_description']()}
              </p>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[520px] overflow-auto rounded-lg border bg-muted p-4 text-xs leading-5">
                {data.rawJson}
              </pre>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

export const Route = createFileRoute('/admin/worldcup-sync')({
  component: WorldCupSyncPage,
});
