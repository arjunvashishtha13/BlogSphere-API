import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';
import { BlogListSkeleton } from '../components/Skeleton';
import { PageTransition } from '../components/PageTransition';
import { postsApi } from '../api';
import { CATEGORIES } from '../utils/helpers';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      page,
      limit: 9,
      ...(search && { search }),
      ...(category && { category }),
    }),
    [page, search, category]
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.list(params).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  return (
    <Layout>
      <SEO title="Explore" description="Discover blogs across categories on BlogSphere." />
      <PageTransition className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold mb-2">Explore</h1>
          <p className="text-ink-muted dark:text-[#b8b5ad]">
            Browse published stories across every category.
          </p>
        </div>

        {/* Search & filters */}
        <div className="space-y-4 mb-10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
            <input
              type="search"
              placeholder="Search by title or content..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
              aria-label="Search blogs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCategory('');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !category
                  ? 'bg-ink text-canvas dark:bg-[#e8e6e1] dark:text-ink'
                  : 'border border-border dark:border-border-dark hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-accent text-white'
                    : 'border border-border dark:border-border-dark hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <BlogListSkeleton count={6} />
        ) : posts.length ? (
          <>
            <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-60' : ''}`}>
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-ink-faint">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon="search"
            title="No posts found"
            description={
              search || category
                ? 'Try adjusting your search or filter.'
                : 'No published posts yet. Check back soon.'
            }
            action={
              search || category ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('');
                    setCategory('');
                  }}
                >
                  Clear filters
                </Button>
              ) : null
            }
          />
        )}
      </PageTransition>
    </Layout>
  );
}
