import { useParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Tag } from 'lucide-react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';
import { BlogListSkeleton } from '../components/Skeleton';
import { PageTransition } from '../components/PageTransition';
import { postsApi } from '../api';

export default function TagPage() {
  const { tag } = useParams();
  const [page, setPage] = useState(1);

  const params = useMemo(() => ({ page, limit: 9, tag }), [page, tag]);

  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'tag', tag, page],
    queryFn: () => postsApi.list(params).then((r) => r.data),
    placeholderData: keepPreviousData,
    enabled: !!tag,
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  return (
    <Layout>
      <SEO title={`#${tag}`} description={`Posts tagged with "${tag}" on BlogSphere.`} />
      <PageTransition className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <h1 className="font-display text-3xl font-semibold">#{tag}</h1>
          </div>
          <p className="text-ink-muted dark:text-[#b8b5ad]">
            {data?.total || 0} post{data?.total !== 1 ? 's' : ''} tagged with "{tag}"
          </p>
        </div>

        {isLoading ? (
          <BlogListSkeleton count={6} />
        ) : posts.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-ink-faint">Page {page} of {totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState icon="search" title="No posts found" description={`No posts tagged with "${tag}" yet.`} />
        )}
      </PageTransition>
    </Layout>
  );
}
