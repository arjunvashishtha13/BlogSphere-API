import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { PageTransition } from '../components/PageTransition';
import { usersApi } from '../api';
import { formatDate, getInitials } from '../utils/helpers';

export default function AuthorPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['author', id],
    queryFn: () => usersApi.publicProfile(id).then((r) => r.data),
    enabled: !!id,
  });

  const user = data?.user;
  const posts = data?.posts || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <EmptyState title="Author not found" description="This profile doesn't exist." />
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={user.name}
        description={user.bio || `Read posts by ${user.name} on BlogSphere.`}
      />
      <PageTransition className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-start gap-5 mb-10 pb-10 border-b border-border dark:border-border-dark">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage/10 text-sage text-lg font-semibold shrink-0">
            {getInitials(user.name)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">{user.name}</h1>
            {user.bio && (
              <p className="mt-2 text-sm text-ink-muted dark:text-[#b8b5ad] leading-relaxed max-w-lg">
                {user.bio}
              </p>
            )}
            <p className="mt-2 text-xs text-ink-faint">
              Member since {formatDate(user.createdAt)} · {posts.length} posts
            </p>
          </div>
        </div>

        <h2 className="font-display text-xl font-semibold mb-6">Published posts</h2>
        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No published posts"
            description={`${user.name} hasn't published anything yet.`}
          />
        )}
      </PageTransition>
    </Layout>
  );
}
