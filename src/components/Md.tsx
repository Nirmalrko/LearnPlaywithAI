import { Fragment, type ReactNode } from 'react';

/** Minimal, safe markdown: paragraphs, "- " bullets, numbered lines, **bold**, *italic*, `code`. No HTML injection. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('**')) out.push(<strong key={i++} className="font-semibold text-slate-900 dark:text-white">{t.slice(2, -2)}</strong>);
    else if (t.startsWith('`'))
      out.push(
        <code key={i++} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700 dark:bg-slate-800 dark:text-brand-300">
          {t.slice(1, -1)}
        </code>,
      );
    else out.push(<em key={i++}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function MdInline({ text }: { text: string }) {
  return <>{inline(text)}</>;
}

export function Md({ text, className = '' }: { text: string; className?: string }) {
  const paras = text.split(/\n\n+/);
  return (
    <div className={`space-y-3 leading-relaxed ${className}`}>
      {paras.map((p, i) => {
        const lines = p.split('\n');
        if (lines.every((l) => /^- /.test(l)))
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 marker:text-brand-500">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+\. /.test(l)))
          return (
            <ol key={i} className="list-decimal space-y-1 pl-5 marker:font-semibold marker:text-brand-500">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\d+\. /, ''))}</li>
              ))}
            </ol>
          );
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
