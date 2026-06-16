import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border dark:border-border-dark mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-lg font-semibold">
              Blog<span className="text-accent">Sphere</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted dark:text-[#b8b5ad] max-w-xs">
              A space for thoughtful writing, curated discovery, and meaningful conversations.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-ink-muted dark:text-[#b8b5ad]">
            <Link to="/explore" className="hover:text-accent transition-colors">
              Explore
            </Link>
            <Link to="/write" className="hover:text-accent transition-colors">
              Write
            </Link>
            <a href="https://github.com" className="hover:text-accent transition-colors" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
        <p className="mt-8 text-xs text-ink-faint">
          © {new Date().getFullYear()} BlogSphere. Built with care.
        </p>
      </div>
    </footer>
  );
}
