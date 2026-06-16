import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, PenLine, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore, useThemeStore } from '../store/authStore';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const links = [
    { to: '/explore', label: 'Explore' },
    ...(user
      ? [
          { to: '/write', label: 'Write' },
          { to: '/dashboard', label: 'Dashboard' },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 dark:border-border-dark/80 bg-canvas/90 dark:bg-canvas-dark/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          Blog<span className="text-accent">Sphere</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink dark:text-[#b8b5ad] dark:hover:text-[#e8e6e1] transition-colors rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/explore"
            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
            aria-label="Search blogs"
          >
            <Search className="h-4 w-4" />
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to={`/author/${user._id}`}
                className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              >
                {user.name}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button to="/login" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button to="/register" variant="primary" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border dark:border-border-dark px-4 py-4 space-y-2 bg-canvas dark:bg-canvas-dark">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-border dark:border-border-dark">
            <button onClick={toggleTheme} className="p-2 rounded-lg" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            {user ? (
              <>
                <Button to="/write" variant="secondary" size="sm" onClick={() => setMobileOpen(false)}>
                  <PenLine className="h-4 w-4" /> Write
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Button>
                <Button to="/register" variant="primary" size="sm" onClick={() => setMobileOpen(false)}>
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
