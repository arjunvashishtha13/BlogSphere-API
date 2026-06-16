import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Button from '../components/Button';
import { authApi } from '../api';

export default function VerifyEmailPage() {
  const { token } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: () => authApi.verifyEmail(token).then((r) => r.data),
    enabled: !!token,
    retry: false,
  });

  return (
    <Layout>
      <SEO title="Verify Email" description="Verify your BlogSphere email address." />
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6 text-center">
        <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8">
          {isLoading ? (
            <>
              <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto mb-4" />
              <h1 className="font-display text-2xl font-semibold mb-2">Verifying...</h1>
              <p className="text-sm text-ink-muted dark:text-[#b8b5ad]">
                Please wait while we verify your email address.
              </p>
            </>
          ) : isError ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-7 w-7 text-red-500" />
              </div>
              <h1 className="font-display text-2xl font-semibold mb-2">Verification Failed</h1>
              <p className="text-sm text-ink-muted dark:text-[#b8b5ad] mb-6">
                {error?.message || 'Invalid or expired verification link.'}
              </p>
              <Button to="/login" variant="primary">Go to Sign In</Button>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-7 w-7 text-green-500" />
              </div>
              <h1 className="font-display text-2xl font-semibold mb-2">Email Verified!</h1>
              <p className="text-sm text-ink-muted dark:text-[#b8b5ad] mb-6">
                Your email has been verified successfully. You can now use all features.
              </p>
              <Button to="/login" variant="primary">Sign In</Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
