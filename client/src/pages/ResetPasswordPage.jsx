import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { PageTransition } from '../components/PageTransition';
import { authApi } from '../api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEO title="Reset Password" description="Choose a new password for your BlogSphere account." />
      <PageTransition className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-accent mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold mb-2">New password</h1>
          <p className="text-sm text-ink-muted dark:text-[#b8b5ad] mb-6">
            Choose a strong password for your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium mb-1.5">New password</label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border dark:border-border-dark bg-canvas dark:bg-canvas-dark px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-1.5">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg border border-border dark:border-border-dark bg-canvas dark:bg-canvas-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>
        </div>
      </PageTransition>
    </Layout>
  );
}
