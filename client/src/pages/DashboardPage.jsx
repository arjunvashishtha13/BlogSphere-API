import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Eye,
  Heart,
  FileText,
  Clock,
  PenLine,
  Bookmark,
  History,
} from 'lucide-react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';
import { DashboardSkeleton } from '../components/Skeleton';
import { PageTransition } from '../components/PageTransition';
import { usersApi } from '../api';
import { useAuthStore } from '../store/authStore';

function StatCard({ icon: Icon, label, value, color = 'text-accent' }) {
  return (
    <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] ${color}`}>
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <span className="text-sm text-ink-muted dark:text-[#b8b5ad]">{label}</span>
      </div>
      <p className="font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => usersApi.analytics().then((r) => r.data),
  });

  const { data: myPosts = [] } = useQuery({
    queryKey: ['my-posts'],
    queryFn: () => usersApi.posts().then((r) => r.data.posts),
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => usersApi.bookmarks().then((r) => r.data.bookmarks),
  });

  const { data: history = [] } = useQuery({
    queryKey: ['history'],
    queryFn: () => usersApi.history().then((r) => r.data.history),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => usersApi.recommendations().then((r) => r.data.posts),
  });

  const stats = analytics?.stats;

  return (
    <Layout>
      <SEO title="Dashboard" description="Your BlogSphere analytics and content." />
      <PageTransition className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-ink-muted dark:text-[#b8b5ad]">
              Welcome back, {user?.name}
            </p>
          </div>
          <Button to="/write" variant="primary" size="sm">
            <PenLine className="h-4 w-4" /> New post
          </Button>
        </div>

        {analyticsLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              <StatCard icon={FileText} label="Published" value={stats?.totalPosts ?? 0} />
              <StatCard icon={Eye} label="Total views" value={stats?.totalViews ?? 0} color="text-sage" />
              <StatCard icon={Heart} label="Total likes" value={stats?.totalLikes ?? 0} />
              <StatCard icon={Clock} label="Avg. read time" value={`${stats?.avgReadingTime ?? 0}m`} />
            </div>

            {analytics?.topPosts?.length > 0 && (
              <section className="mb-12">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  Top performing
                </h2>
                <div className="rounded-xl border border-border dark:border-border-dark overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border dark:border-border-dark bg-black/[0.02] dark:bg-white/[0.02]">
                        <th className="text-left px-4 py-3 font-medium">Title</th>
                        <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Views</th>
                        <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Likes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topPosts.map((post) => (
                        <tr
                          key={post._id}
                          className="border-b border-border/50 dark:border-border-dark/50 last:border-0"
                        >
                          <td className="px-4 py-3">
                            <Link
                              to={`/blog/${post._id}`}
                              className="hover:text-accent transition-colors line-clamp-1"
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td className="text-right px-4 py-3 text-ink-faint hidden sm:table-cell">
                            {post.views}
                          </td>
                          <td className="text-right px-4 py-3 text-ink-faint hidden sm:table-cell">
                            {post.likeCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}

        <section className="mb-12">
          <h2 className="font-display text-xl font-semibold mb-4">Your posts</h2>
          {myPosts.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="write"
              title="No posts yet"
              description="Start writing and your published posts will appear here."
              action={<Button to="/write">Write your first post</Button>}
            />
          )}
        </section>

        {recommendations.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-xl font-semibold mb-4">Recommended for you</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-xl font-semibold flex items-center gap-2 mb-4">
              <Bookmark className="h-5 w-5" strokeWidth={1.5} /> Bookmarks
            </h2>
            {bookmarks.length ? (
              <div className="space-y-3">
                {bookmarks.slice(0, 5).map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post._id}`}
                    className="block rounded-lg border border-border dark:border-border-dark p-4 hover:border-accent/30 transition-colors"
                  >
                    <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                    <p className="text-xs text-ink-faint mt-1">{post.author?.name}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-faint">No bookmarks saved yet.</p>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold flex items-center gap-2 mb-4">
              <History className="h-5 w-5" strokeWidth={1.5} /> Recently viewed
            </h2>
            {history.length ? (
              <div className="space-y-3">
                {history.slice(0, 5).map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post._id}`}
                    className="block rounded-lg border border-border dark:border-border-dark p-4 hover:border-accent/30 transition-colors"
                  >
                    <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                    <p className="text-xs text-ink-faint mt-1">{post.category}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-faint">Your reading history will appear here.</p>
            )}
          </section>
        </div>
      </PageTransition>
    </Layout>
  );
}
