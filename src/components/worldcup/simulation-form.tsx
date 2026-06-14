import { useMutation } from '@tanstack/react-query';
import { Loader2, Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSession } from '@/core/auth/client';
import { useRouter } from '@/core/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarkdownContent } from '@/components/markdown-content';
import { Textarea } from '@/components/ui/textarea';
import { apiPost } from '@/lib/api-client';
import { m } from '@/paraglide/messages.js';

export function SimulationForm({
  matchSlug,
  example,
}: {
  matchSlug: string;
  example: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [scenario, setScenario] = useState(example);
  const [result, setResult] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      apiPost<{ text: string; taskId: string }>('/api/simulation', {
        matchSlug,
        scenario,
      }),
    onSuccess: (data) => {
      setResult(data.text);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function runSimulation() {
    if (!session?.user) {
      const redirect = encodeURIComponent(
        typeof window !== 'undefined' ? window.location.pathname : `/matches/${matchSlug}`
      );
      router.push(`/sign-in?redirect=${redirect}`);
      return;
    }
    if (!scenario.trim()) {
      toast.error(m['worldcup.simulator.empty']());
      return;
    }
    setResult('');
    mutation.mutate();
  }

  return (
    <Card id="simulator" className="rounded-lg border-primary/25 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="size-5 text-primary" />
          {m['worldcup.simulator.title']()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {m['worldcup.simulator.description']()}
        </p>
        <Textarea
          value={scenario}
          onChange={(event) => setScenario(event.target.value)}
          rows={4}
          placeholder={m['worldcup.simulator.placeholder']()}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button onClick={runSimulation} disabled={mutation.isPending} className="gap-2">
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : session?.user ? (
              <Sparkles className="size-4" />
            ) : (
              <Lock className="size-4" />
            )}
            {session?.user
              ? m['worldcup.simulator.run']()
              : m['worldcup.simulator.sign_in']()}
          </Button>
          <span className="text-xs text-muted-foreground">
            {m['worldcup.simulator.credit_note']()}
          </span>
        </div>
        {result && (
          <MarkdownContent
            content={result}
            className="rounded-md border bg-background p-4 text-sm leading-7 [&>*:first-child]:mt-0"
          />
        )}
      </CardContent>
    </Card>
  );
}
