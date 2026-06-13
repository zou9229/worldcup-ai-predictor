import { useState } from 'react';
import { toast } from 'sonner';
import { Bot, Loader2, Send, Sparkles, Ticket, X } from 'lucide-react';
import { m } from '@/paraglide/messages.js';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/image-uploader';
import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { apiPost } from '@/lib/api-client';
import { cn } from '@/lib/utils';

type WidgetMode = 'ai' | 'support';
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function SupportWidget() {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<WidgetMode>('ai');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: m['worldcup.assistant.welcome'](),
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!title.trim() || !content.trim()) {
      toast.error(m['common.support.required']());
      return;
    }
    setSubmitting(true);
    try {
      await apiPost('/api/tickets', { title, content, attachments });
      toast.success(m['common.support.success']());
      setOpen(false);
      setTitle('');
      setContent('');
      setAttachments([]);
      setUploaderKey((k) => k + 1);
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function askAssistant() {
    const message = chatInput.trim();
    if (!message) {
      toast.error(m['worldcup.assistant.empty']());
      return;
    }
    if (!session?.user) {
      toast.error(m['worldcup.assistant.sign_in_notice']());
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...chatMessages,
      { role: 'user', content: message },
    ];
    setChatMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const result = await apiPost<{ text: string; model: string }>('/api/worldcup-chat', {
        message,
        history: chatMessages.slice(-8),
      });
      setChatMessages([
        ...nextMessages,
        { role: 'assistant', content: result.text },
      ]);
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
      setChatMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: m['worldcup.assistant.failed'](),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <>
      <button
        aria-label={m['worldcup.assistant.open_label']()}
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full',
          'border border-lime-100/80 bg-lime-300 text-zinc-950 shadow-[0_18px_48px_rgba(132,204,22,0.35)]',
          'transition-all hover:scale-105 hover:bg-lime-200'
        )}
      >
        {open ? <X className="size-5" /> : <Bot className="size-6" />}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-[520px]">
          <DialogHeader>
            <div className="border-b bg-zinc-950 px-5 py-4 text-white">
              <DialogTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-lime-300" />
                {m['worldcup.assistant.title']()}
              </DialogTitle>
              <DialogDescription className="text-white/62">
                {m['worldcup.assistant.description']()}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="px-5">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => setMode('ai')}
                className={cn(
                  'flex h-9 items-center justify-center gap-2 rounded-md text-sm font-medium transition',
                  mode === 'ai'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Bot className="size-4" />
                {m['worldcup.assistant.ai_tab']()}
              </button>
              <button
                type="button"
                onClick={() => setMode('support')}
                className={cn(
                  'flex h-9 items-center justify-center gap-2 rounded-md text-sm font-medium transition',
                  mode === 'support'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Ticket className="size-4" />
                {m['worldcup.assistant.support_tab']()}
              </button>
            </div>
          </div>

          {mode === 'ai' ? (
            <div className="space-y-4 px-5 pb-5">
              {!isPending && !session?.user ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {m['worldcup.assistant.sign_in_notice']()}
                  </p>
                  <Link href="/sign-in" className={cn(buttonVariants())}>
                    {m['common.support.sign_in']()}
                  </Link>
                </div>
              ) : (
                <>
                  <div className="h-[320px] space-y-3 overflow-y-auto rounded-lg border bg-muted/30 p-3">
                    {chatMessages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={cn(
                          'max-w-[88%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed',
                          message.role === 'user'
                            ? 'ml-auto bg-zinc-950 text-white'
                            : 'bg-background text-foreground shadow-sm'
                        )}
                      >
                        {message.content}
                      </div>
                    ))}
                    {chatLoading ? (
                      <div className="flex max-w-[88%] items-center gap-2 rounded-lg bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm">
                        <Loader2 className="size-4 animate-spin" />
                        {m['worldcup.assistant.thinking']()}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      value={chatInput}
                      maxLength={1200}
                      rows={2}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          askAssistant();
                        }
                      }}
                      placeholder={m['worldcup.assistant.placeholder']()}
                      className="min-h-12 resize-none"
                    />
                    <Button
                      type="button"
                      size="icon"
                      className="h-12 w-12 shrink-0"
                      disabled={chatLoading}
                      onClick={askAssistant}
                    >
                      {chatLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : !isPending && !session?.user ? (
            <div className="flex flex-col items-center gap-4 px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {m['common.support.sign_in_notice']()}
              </p>
              <Link href="/sign-in" className={cn(buttonVariants())}>
                {m['common.support.sign_in']()}
              </Link>
            </div>
          ) : (
            <div className="px-5 pb-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="support-title">{m['common.support.title_label']()}</Label>
                  <Input
                    id="support-title"
                    value={title}
                    maxLength={200}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={m['common.support.title_placeholder']()}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="support-content">{m['common.support.content_label']()}</Label>
                  <Textarea
                    id="support-content"
                    value={content}
                    maxLength={5000}
                    rows={5}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={m['common.support.content_placeholder']()}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{m['common.support.attachments_label']()}</Label>
                  <ImageUploader
                    key={uploaderKey}
                    allowMultiple
                    maxImages={9}
                    onChange={(items) => {
                      setAttachments(
                        items
                          .filter((i) => i.status === 'uploaded' && i.url)
                          .map((i) => i.url!)
                      );
                      setUploading(items.some((i) => i.status === 'uploading'));
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {m['common.support.track_hint_prefix']()}{' '}
                  <Link href="/settings/tickets" className="underline hover:text-foreground">
                    {m['common.support.track_hint_link']()}
                  </Link>
                </p>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {m['common.support.cancel']()}
                </Button>
                <Button onClick={submit} disabled={submitting || uploading}>
                  {submitting ? m['common.support.submitting']() : m['common.support.submit']()}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
