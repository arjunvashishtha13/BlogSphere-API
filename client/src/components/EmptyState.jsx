import { FileText, Search, Bookmark, PenLine } from 'lucide-react';

const icons = {
  posts: FileText,
  search: Search,
  bookmarks: Bookmark,
  write: PenLine,
};

export default function EmptyState({
  icon = 'posts',
  title = 'Nothing here yet',
  description = 'Check back later for new content.',
  action,
}) {
  const Icon = icons[icon] || FileText;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
        <Icon className="h-6 w-6 text-ink-faint" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      <p className="text-ink-muted dark:text-[#b8b5ad] max-w-sm text-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
