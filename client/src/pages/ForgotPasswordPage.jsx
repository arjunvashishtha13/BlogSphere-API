import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { PageTransition } from '../components/PageTransition';
import { authApi } from '../api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      toast.success(res.data.message || 'Reset link sent to your email');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

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
            Enter your email address and we will send you a password reset link.
          </p>
          <form
            onSubmit={handleSubmit}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border dark:border-border-dark bg-canvas dark:bg-canvas-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        </div>
      </PageTransition>
    </Layout>
  );
}
