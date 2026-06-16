import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Shield,
  Users,
  FileText,
  MessageCircle,
  Eye,
  Star,
  Ban,
  Trash2,
  UserCheck,
  BarChart3,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { Skeleton } from '../components/Skeleton';
import { PageTransition } from '../components/PageTransition';
import { adminApi } from '../api';
import { formatDate } from '../utils/helpers';

/* ───────────── Reusable helpers ───────────── */

function StatCard({ icon: Icon, label, value, color = 'text-accent', sub }) {
  return (
    <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] ${color}`}>
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <span className="text-sm text-ink-muted dark:text-[#b8b5ad]">{label}</span>
      </div>
      <p className="font-display text-2xl font-semibold">{value?.toLocaleString()}</p>
      {sub && <p className="text-xs text-ink-faint mt-1">{sub}</p>}
    </div>
  );
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-ink-muted">
      <span>Page {page} of {totalPages}</span>
      <div className="flex gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="p-1.5 rounded hover:bg-black/[0.04] dark:hover:bg-white/[0.06] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="p-1.5 rounded hover:bg-black/[0.04] dark:hover:bg-white/[0.06] disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ConfirmDelete({ label, onConfirm, isPending }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => { onConfirm(); setConfirming(false); }}
          disabled={isPending}
          className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors"
          title="Confirm delete"
        >
          <CheckCircle className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="p-1.5 rounded text-ink-faint hover:bg-black/[0.04] transition-colors"
          title="Cancel"
        >
          <XCircle className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors"
      title={label}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}

/* ───────────── Tab: Overview ───────────── */
function OverviewTab({ stats, isLoading }) {
  return (
    <div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} />
          <StatCard icon={FileText} label="Published Posts" value={stats?.totalPosts ?? 0} color="text-sage" />
          <StatCard icon={MessageCircle} label="Total Comments" value={stats?.totalComments ?? 0} />
          <StatCard icon={Eye} label="Total Views" value={stats?.totalViews ?? 0} color="text-sage" />
        </div>
      )}
    </div>
  );
}

/* ───────────── Tab: Users ───────────── */
function UsersTab({ queryClient }) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: () => adminApi.users({ page, limit: 20 }).then((r) => r.data),
  });

  const banMutation = useMutation({
    mutationFn: (id) => adminApi.banUser(id),
    onSuccess: (res) => { toast.success(res.data.message); queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }); },
    onError: (err) => toast.error(err.message),
  });

  const unbanMutation = useMutation({
    mutationFn: (id) => adminApi.unbanUser(id),
    onSuccess: (res) => { toast.success(res.data.message); queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }); },
    onError: (err) => toast.error(err.message),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: (res) => { toast.success(res.data.message); queryClient.invalidateQueries({ queryKey: ['admin'] }); },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink-faint">{data?.total ?? 0} total users</p>
      </div>
      <div className="rounded-xl border border-border dark:border-border-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border dark:border-border-dark bg-black/[0.02] dark:bg-white/[0.02]">
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Email</th>
              <th className="text-center px-4 py-3 font-medium hidden sm:table-cell">Role</th>
              <th className="text-center px-4 py-3 font-medium hidden sm:table-cell">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data?.users || []).map((u) => (
              <tr key={u._id} className="border-b border-border/50 dark:border-border-dark/50 last:border-0 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {u.avatar ? (
                      <img src={u.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-sage/10 flex items-center justify-center text-xs font-semibold text-sage">
                        {u.name?.[0]}
                      </div>
                    )}
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-faint hidden sm:table-cell">{u.email}</td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-black/[0.04] dark:bg-white/[0.06]'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {u.isBanned ? (
                    <span className="inline-flex items-center gap-1 text-xs text-red-500"><Ban className="h-3 w-3" /> Banned</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-green-500"><CheckCircle className="h-3 w-3" /> Active</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {u.role !== 'admin' && (
                    <div className="flex items-center justify-end gap-1">
                      {u.isBanned ? (
                        <button
                          onClick={() => unbanMutation.mutate(u._id)}
                          disabled={unbanMutation.isPending}
                          className="p-1.5 rounded text-green-500 hover:bg-green-500/10 transition-colors"
                          title="Unban user"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => banMutation.mutate(u._id)}
                          disabled={banMutation.isPending}
                          className="p-1.5 rounded text-amber-500 hover:bg-amber-500/10 transition-colors"
                          title="Ban user"
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <ConfirmDelete
                        label="Delete user"
                        onConfirm={() => deleteUserMutation.mutate(u._id)}
                        isPending={deleteUserMutation.isPending}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
    </div>
  );
}

/* ───────────── Tab: Content (Posts) ───────────── */
function ContentTab({ queryClient }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'posts', page, search],
    queryFn: () => adminApi.posts({ page, limit: 20, search }).then((r) => r.data),
  });

  const deletePostMutation = useMutation({
    mutationFn: (id) => adminApi.deletePost(id),
    onSuccess: (res) => { toast.success(res.data.message); queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }); },
    onError: (err) => toast.error(err.message),
  });

  const featureMutation = useMutation({
    mutationFn: (id) => adminApi.featurePost(id),
    onSuccess: (res) => { toast.success(res.data.message); queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] }); },
    onError: (err) => toast.error(err.message),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-ink-faint">{data?.total ?? 0} total posts</p>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title..."
              className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent/30 w-52"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">Search</Button>
          {search && (
            <Button type="button" variant="ghost" size="sm" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>
              Clear
            </Button>
          )}
        </form>
      </div>

      <div className="rounded-xl border border-border dark:border-border-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border dark:border-border-dark bg-black/[0.02] dark:bg-white/[0.02]">
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Author</th>
              <th className="text-center px-4 py-3 font-medium hidden sm:table-cell">Status</th>
              <th className="text-center px-4 py-3 font-medium hidden md:table-cell">Views</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data?.posts || []).map((p) => (
              <tr key={p._id} className="border-b border-border/50 dark:border-border-dark/50 last:border-0 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                <td className="px-4 py-3 max-w-[220px]">
                  <div className="flex items-start gap-2">
                    {p.coverImage && (
                      <img src={p.coverImage} alt="" className="h-9 w-14 rounded object-cover flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium line-clamp-1">{p.title}</p>
                      <p className="text-xs text-ink-faint">{p.category} · {formatDate(p.createdAt)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted hidden lg:table-cell">{p.author?.name}</td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.status === 'published' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {p.status}
                  </span>
                  {p.isFeatured && (
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">featured</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-ink-muted hidden md:table-cell">{p.views?.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/blog/${p._id}`}
                      target="_blank"
                      className="p-1.5 rounded text-ink-faint hover:text-ink hover:bg-black/[0.04] transition-colors"
                      title="View post"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => featureMutation.mutate(p._id)}
                      disabled={featureMutation.isPending}
                      className={`p-1.5 rounded transition-colors ${p.isFeatured ? 'text-accent hover:bg-accent/10' : 'text-ink-faint hover:text-accent hover:bg-accent/10'}`}
                      title={p.isFeatured ? 'Unfeature post' : 'Feature post'}
                    >
                      <Star className={`h-3.5 w-3.5 ${p.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                    <ConfirmDelete
                      label="Delete post"
                      onConfirm={() => deletePostMutation.mutate(p._id)}
                      isPending={deletePostMutation.isPending}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {data?.posts?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ink-faint">No posts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
    </div>
  );
}

/* ───────────── Tab: Comments ───────────── */
function CommentsTab({ queryClient }) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'comments', page],
    queryFn: () => adminApi.comments({ page, limit: 30 }).then((r) => r.data),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id) => adminApi.deleteComment(id),
    onSuccess: (res) => { toast.success(res.data.message); queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }); },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink-faint">{data?.total ?? 0} total comments</p>
      </div>
      <div className="space-y-3">
        {(data?.comments || []).map((c) => (
          <div key={c._id} className="rounded-xl border border-border dark:border-border-dark p-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1.5">
                  {c.author?.avatar ? (
                    <img src={c.author.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-sage/10 flex items-center justify-center text-[10px] font-semibold text-sage">
                      {c.author?.name?.[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium">{c.author?.name ?? 'Unknown'}</span>
                  <span className="text-xs text-ink-faint">·</span>
                  <span className="text-xs text-ink-faint">{formatDate(c.createdAt)}</span>
                  {c.post && (
                    <>
                      <span className="text-xs text-ink-faint">on</span>
                      <Link
                        to={`/blog/${c.post._id}`}
                        target="_blank"
                        className="text-xs text-accent hover:underline inline-flex items-center gap-0.5 truncate max-w-[200px]"
                      >
                        {c.post.title}
                        <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                      </Link>
                    </>
                  )}
                </div>
                <p className="text-sm text-ink-muted dark:text-[#b8b5ad] line-clamp-2">{c.text}</p>
              </div>
              <ConfirmDelete
                label="Delete comment"
                onConfirm={() => deleteCommentMutation.mutate(c._id)}
                isPending={deleteCommentMutation.isPending}
              />
            </div>
          </div>
        ))}
        {data?.comments?.length === 0 && (
          <p className="text-sm text-ink-faint text-center py-10">No comments found.</p>
        )}
      </div>
      <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
    </div>
  );
}

/* ───────────── Tab: Analytics ───────────── */
function AnalyticsTab({ queryClient }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminApi.analytics().then((r) => r.data),
  });

  const featureMutation = useMutation({
    mutationFn: (id) => adminApi.featurePost(id),
    onSuccess: (res) => { toast.success(res.data.message); queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] }); },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="space-y-10">
      {/* Most Viewed */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-accent" /> Most Viewed Posts
        </h2>
        <div className="rounded-xl border border-border dark:border-border-dark overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-border-dark bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Author</th>
                <th className="text-right px-4 py-3 font-medium">Views</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.mostViewed?.map((p) => (
                <tr key={p._id} className="border-b border-border/50 dark:border-border-dark/50 last:border-0">
                  <td className="px-4 py-3 line-clamp-1 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-ink-faint hidden sm:table-cell">{p.author?.name}</td>
                  <td className="px-4 py-3 text-right text-ink-faint">{p.views?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/blog/${p._id}`} target="_blank" className="p-1.5 rounded text-ink-faint hover:text-ink hover:bg-black/[0.04] transition-colors" title="View post">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => featureMutation.mutate(p._id)}
                        disabled={featureMutation.isPending}
                        className="p-1.5 rounded text-accent hover:bg-accent/10 transition-colors"
                        title="Toggle Feature"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Most Liked */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Most Liked Posts</h2>
        <div className="rounded-xl border border-border dark:border-border-dark overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-border-dark bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-right px-4 py-3 font-medium">Likes</th>
              </tr>
            </thead>
            <tbody>
              {data?.mostLiked?.map((p) => (
                <tr key={p._id} className="border-b border-border/50 dark:border-border-dark/50 last:border-0">
                  <td className="px-4 py-3 line-clamp-1 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-right text-ink-faint">{p.likeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Users */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Recent Signups</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {data?.newUsers?.map((u) => (
            <div key={u._id} className="flex items-center gap-3 rounded-lg border border-border dark:border-border-dark p-4">
              {u.avatar ? (
                <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-sage/10 flex items-center justify-center text-xs font-semibold text-sage">
                  {u.name?.[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-ink-faint">{u.email} · Joined {formatDate(u.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ───────────── Main AdminPage ───────────── */
export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.stats().then((r) => r.data.stats),
    refetchInterval: 60_000, // auto-refresh stats every minute
  });

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'content', label: 'Content', icon: FileText },
    { key: 'comments', label: 'Comments', icon: MessageCircle },
    { key: 'analytics', label: 'Analytics', icon: Eye },
  ];

  return (
    <Layout>
      <SEO title="Admin Dashboard" description="BlogSphere administration panel." />
      <PageTransition className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-accent/10">
            <Shield className="h-6 w-6 text-accent" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-ink-faint">Manage users, content, and platform analytics.</p>
          </div>
        </div>

        {/* Quick stats strip (always visible) */}
        {!statsLoading && stats && (
          <div className="grid gap-3 sm:grid-cols-4 mb-8">
            <StatCard icon={Users} label="Users" value={stats.totalUsers} />
            <StatCard icon={FileText} label="Posts" value={stats.totalPosts} color="text-sage" />
            <StatCard icon={MessageCircle} label="Comments" value={stats.totalComments} />
            <StatCard icon={Eye} label="Views" value={stats.totalViews} color="text-sage" />
          </div>
        )}
        {statsLoading && (
          <div className="grid gap-3 sm:grid-cols-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 border-b border-border dark:border-border-dark overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && <OverviewTab stats={stats} isLoading={statsLoading} />}
        {tab === 'users' && <UsersTab queryClient={queryClient} />}
        {tab === 'content' && <ContentTab queryClient={queryClient} />}
        {tab === 'comments' && <CommentsTab queryClient={queryClient} />}
        {tab === 'analytics' && <AnalyticsTab queryClient={queryClient} />}
      </PageTransition>
    </Layout>
  );
}
