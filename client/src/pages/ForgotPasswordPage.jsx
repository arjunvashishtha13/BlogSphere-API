import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { PageTransition } from '../components/PageTransition';

export default function ForgotPasswordPage() {
  return (
    <Layout>
      <SEO title="Forgot password" description="Reset your BlogSphere password." />
      <PageTransition className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-accent mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 sm:p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border dark:border-border-dark">
            <Mail className="h-6 w-6 text-accent" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-semibold mb-2">Password reset</h1>
          <p className="text-sm text-ink-muted dark:text-[#b8b5ad] leading-relaxed mb-6">
            Password reset via email requires a mail service integration (e.g. SendGrid, Resend).
            This UI demonstrates the flow — wire it to your backend when deploying to production.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium mb-1.5">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border dark:border-border-dark bg-canvas dark:bg-canvas-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled>
              Send reset link
            </Button>
          </form>
          <p className="mt-4 text-xs text-ink-faint">
            Connect an email provider to enable this feature in production.
          </p>
        </div>
      </PageTransition>
    </Layout>
  );
}
