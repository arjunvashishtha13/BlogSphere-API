import { renderMarkdown } from '../utils/helpers';

export default function EditorPreview({ title, content }) {
  return (
    <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-wider text-accent mb-3">Preview</p>
      {title && (
        <h1 className="font-display text-2xl font-semibold mb-6">{title}</h1>
      )}
      {content ? (
        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      ) : (
        <p className="text-ink-faint text-sm">Nothing to preview yet.</p>
      )}
    </div>
  );
}
