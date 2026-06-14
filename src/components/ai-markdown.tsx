import { Fragment, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

function inlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.92em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function AiMarkdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];
  let orderedItems: string[] = [];
  let codeLines: string[] = [];
  let inCode = false;

  function flushLists() {
    if (listItems.length) {
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="my-2 ml-5 list-disc space-y-1">
          {listItems.map((item, index) => (
            <li key={index}>{inlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
    if (orderedItems.length) {
      nodes.push(
        <ol key={`ol-${nodes.length}`} className="my-2 ml-5 list-decimal space-y-1">
          {orderedItems.map((item, index) => (
            <li key={index}>{inlineMarkdown(item)}</li>
          ))}
        </ol>
      );
      orderedItems = [];
    }
  }

  function flushCode() {
    if (!codeLines.length) return;
    nodes.push(
      <pre key={`pre-${nodes.length}`} className="my-3 overflow-x-auto rounded-md bg-muted p-3 text-xs">
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
    codeLines = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim().startsWith('```')) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushLists();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      flushLists();
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushLists();
      const level = heading[1].length;
      const text = heading[2];
      const className =
        level === 1
          ? 'mt-4 text-lg font-semibold'
          : level === 2
            ? 'mt-3 text-base font-semibold'
            : 'mt-2 text-sm font-semibold';
      nodes.push(
        <p key={`h-${nodes.length}`} className={className}>
          {inlineMarkdown(text)}
        </p>
      );
      continue;
    }

    const bullet = /^\s*[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      orderedItems = orderedItems.length ? orderedItems : [];
      if (orderedItems.length) flushLists();
      listItems.push(bullet[1]);
      continue;
    }

    const ordered = /^\s*\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      if (listItems.length) flushLists();
      orderedItems.push(ordered[1]);
      continue;
    }

    flushLists();
    nodes.push(
      <p key={`p-${nodes.length}`} className="my-2">
        {inlineMarkdown(line.trim())}
      </p>
    );
  }

  flushLists();
  flushCode();

  return <div className={cn('text-sm leading-relaxed', className)}>{nodes}</div>;
}
