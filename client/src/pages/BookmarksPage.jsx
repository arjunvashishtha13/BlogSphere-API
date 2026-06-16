import { useQuery } from '@tanstack/react-query';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';
import { BlogListSkeleton } from '../components/Skeleton';
import { PageTransition } from '../components/PageTransition';
import { usersApi } from '../api';

export default function BookmarksPage() {
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => usersApi.bookmarks().then((r) => r.data.bookmarks),
  });

  return (
    <Layout>
      <SEO title="Bookmarks" description="Your saved posts on BlogSphere." />
      <PageTransition className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <BookmarkIcon className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <h1 className="font-display text-3xl font-semibold">Bookmarks</h1>
          </div>
          <p className="text-ink-muted dark:text-[#b8b5ad]">
            Posts you've saved for later reading.
          </p>
        </div>

        {isLoading ? (
          <BlogListSkeleton count={6} />
        ) : bookmarks.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="bookmarks"
            title="No bookmarks yet"
            description="Save posts to revisit them later."
            action={<Button to="/explore">Explore posts</Button>}
          />
        )}
      </PageTransition>
    </Layout>
  );
}
