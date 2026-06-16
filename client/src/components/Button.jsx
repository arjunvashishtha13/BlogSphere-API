import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-ink text-canvas hover:bg-ink/90 dark:bg-[#e8e6e1] dark:text-ink dark:hover:bg-white',
  secondary:
    'border border-border dark:border-border-dark bg-surface dark:bg-surface-dark hover:bg-black/[0.03] dark:hover:bg-white/[0.04]',
  accent: 'bg-accent text-white hover:bg-accent-hover',
  ghost: 'hover:bg-black/[0.04] dark:hover:bg-white/[0.06]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  to,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
