'use client';

import React, { useCallback, useMemo, useState } from 'react';

// A robust CodeBlock that wraps MDX <pre><code> output, adds a copy button
// and shows a language label derived from className (e.g., language-ts).
// It preserves the original children structure for theme highlighting.

function getLanguageFromClassName(className?: string): string | null {
  if (!className) return null;
  const m = className.match(/language-([\w+-]+)/);
  return m?.[1] ?? null;
}

function getLanguageFromProps(props: any, codeEl: React.ReactElement | null) {
  // Try language from <code class="language-xyz"> first
  const codeClass = codeEl && (codeEl.props as any)?.className;
  const fromCode = getLanguageFromClassName(codeClass);
  if (fromCode) return fromCode;

  // Some renderers set data-language on <code> or <pre>
  const codeData = codeEl && (codeEl.props as any)?.['data-language'];
  if (typeof codeData === 'string' && codeData) return codeData;

  // Then check the <pre> itself
  const preClass = props?.className as string | undefined;
  const fromPre = getLanguageFromClassName(preClass);
  if (fromPre) return fromPre;

  const preData = props?.['data-language'];
  if (typeof preData === 'string' && preData) return preData;

  return 'text';
}

function getRawText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(getRawText).join('');
  if (React.isValidElement(node)) {
    // @ts-ignore
    return getRawText(node.props?.children);
  }
  return '';
}

export default function CodeBlock(props: any) {
  // Expected shape: <pre><code class="language-xyz">...</code></pre>
  const child = props?.children as any;
  const codeEl = React.isValidElement(child) ? child : null;
  // @ts-ignore
  const codeClassName: string | undefined = codeEl?.props?.className;

  const language = useMemo(() => getLanguageFromProps(props, codeEl), [props, codeEl]);

  const raw = useMemo(
    // @ts-ignore
    () => getRawText(codeEl?.props?.children ?? props?.children),
    [codeEl, props?.children],
  );

  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // Fallback: try using a hidden textarea
      try {
        const textarea = document.createElement('textarea');
        textarea.value = raw;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
    }
  }, [raw]);

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      {/* Header with language badge and copy button */}
      <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/60 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9 16.2 4.8 12l1.4-1.4L9 13.4l8.8-8.8L19.2 6 9 16.2z"
                  clipRule="evenodd"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Original highlighted code content */}
      <div className="overflow-auto">
        <pre
          {...props}
          className={
            (props?.className ?? '') + ' !m-0 !border-0 !bg-transparent'
          }
        >
          {codeEl
            ? React.cloneElement(codeEl, {
                // @ts-ignore
                className: (codeClassName ?? '') + ' block p-4',
              })
            : props.children}
        </pre>
      </div>
    </div>
  );
}
