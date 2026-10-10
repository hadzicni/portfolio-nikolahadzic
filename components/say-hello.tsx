'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { GithubIcon } from '@/components/icons';
import { profile } from '@/lib/content';

const field =
  'w-full rounded-none border-b border-dashed border-white/15 bg-transparent py-1 text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-acid';

/**
 * Contact as a little shell script: write the subject and message right here,
 * and sending hands both to the visitor's own mail app through a `mailto:`
 * link. Nothing passes through a server and nothing is stored.
 *
 * Without JavaScript the form still submits to `mailto:`, the browser's own
 * way of doing the same thing.
 */
export function SayHello() {
  const subjectId = React.useId();
  const messageId = React.useId();
  const [log, setLog] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState(false);

  function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get('subject') ?? '').trim();
    const body = String(data.get('body') ?? '').trim();

    const query = [
      subject && `subject=${encodeURIComponent(subject)}`,
      body && `body=${encodeURIComponent(body)}`,
    ]
      .filter(Boolean)
      .join('&');

    setLog([
      `composing ${subject ? `"${subject}"` : 'a message'} ... ok`,
      'handing over to your mail app ... ok',
    ]);
    window.location.href = `mailto:${profile.email}${query ? `?${query}` : ''}`;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast.success('Copied to clipboard', { description: profile.email });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy the address');
    }
  }

  return (
    <div className="terminal-dark soft-lg overflow-hidden rounded-2xl bg-card text-left ring-1 ring-white/15">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">
          {profile.handle} — say-hello.sh
        </span>
      </div>

      <form
        action={`mailto:${profile.email}`}
        method="get"
        onSubmit={send}
        className="p-5 font-mono text-xs leading-relaxed sm:text-sm"
      >
        <p>
          <span className="text-acid">~/contact ❯</span> ./say-hello.sh
        </p>

        <div className="mt-4 grid grid-cols-[4.5rem_1fr] items-baseline gap-x-3 gap-y-3.5">
          <span className="text-muted-foreground">to</span>
          <span className="flex min-w-0 flex-wrap items-baseline gap-x-3">
            <span className="truncate">{profile.email}</span>
            <button
              type="button"
              onClick={copy}
              className="text-muted-foreground transition-colors hover:text-acid"
            >
              {copied ? 'copied' : 'copy'}
            </button>
          </span>

          <label htmlFor={subjectId} className="text-muted-foreground">
            subject
          </label>
          <input
            id={subjectId}
            name="subject"
            autoComplete="off"
            placeholder="Hello from your portfolio"
            className={field}
          />

          <label htmlFor={messageId} className="text-muted-foreground">
            message
          </label>
          <textarea
            id={messageId}
            name="body"
            rows={3}
            placeholder="What are you building?"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                event.currentTarget.form?.requestSubmit();
              }
            }}
            className={`${field} resize-none`}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="submit"
            className="rounded-md bg-acid px-3.5 py-1.5 font-semibold text-acid-foreground transition-opacity hover:opacity-90"
          >
            send ↵
          </button>
          <span className="text-muted-foreground/70">opens your mail app, nothing is stored</span>
        </div>

        <div aria-live="polite" className="mt-3 space-y-1 empty:hidden">
          {log.map((entry) => (
            <p key={entry} className="text-muted-foreground">
              <span className="text-acid">›</span> {entry}
            </p>
          ))}
        </div>
      </form>

      <div className="flex flex-wrap gap-x-7 gap-y-2 border-t border-white/10 px-5 py-4 font-mono text-xs sm:text-sm">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 transition-colors hover:text-acid"
        >
          <GithubIcon aria-hidden className="size-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">github</span> @{profile.handle}
        </a>
        <a
          href={profile.website}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 transition-colors hover:text-acid"
        >
          <span className="text-muted-foreground">web</span> {profile.website.replace('https://', '')}
        </a>
      </div>
    </div>
  );
}
