import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Shield, Users, FileText, MessageCircle, Eye, Star, Ban, Trash2, UserCheck } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { Skeleton } from '../components/Skeleton';
import { PageTransition } from '../components/PageTransition';
import { adminApi } from '../api';
import { formatDate } from '../utils/helpers';

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

export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.stats().then((r) => r.data.stats),
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.users().then((r) => r.data),
    enabled: tab === 'users',
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminApi.analytics().then((r) => r.data),
    enabled: tab === 'analytics',
  });

  const banMutation = useMutation({
    mutationFn: (id) => adminApi.banUser(id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const unbanMutation = useMutation({
    mutationFn: (id) => adminApi.unbanUser(id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const featurePostMutation = useMutation({
    mutationFn: (id) => adminApi.featurePost(id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'analytics', label: 'Analytics' },
  ];

  return (
    <Layout>
      <SEO title="Admin Dashboard" description="BlogSphere administration panel." />
      <PageTransition className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-6 w-6 text-accent" />
          <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border dark:border-border-dark">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            {statsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} />
                <StatCard icon={FileText} label="Total Posts" value={stats?.totalPosts ?? 0} color="text-sage" />
                <StatCard icon={MessageCircle} label="Total Comments" value={stats?.totalComments ?? 0} />
                <StatCard icon={Eye} label="Total Views" value={stats?.totalViews ?? 0} color="text-sage" />
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
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
                {(usersData?.users || []).map((u) => (
                  <tr key={u._id} className="border-b border-border/50 dark:border-border-dark/50 last:border-0">
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
                        <span className="text-xs text-red-500">Banned</span>
                      ) : (
                        <span className="text-xs text-green-500">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-1">
                          {u.isBanned ? (
                            <button
                              onClick={() => unbanMutation.mutate(u._id)}
                              className="p-1.5 rounded text-green-500 hover:bg-green-500/10 transition-colors"
                              title="Unban"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => banMutation.mutate(u._id)}
                              className="p-1.5 rounded text-amber-500 hover:bg-amber-500/10 transition-colors"
                              title="Ban"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete user "${u.name}" and all their content?`)) {
                                deleteUserMutation.mutate(u._id);
                              }
                            }}
                            className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics */}
        {tab === 'analytics' && analyticsData && (
          <div className="space-y-10">
            {/* Most Viewed */}
            <section>
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-accent" /> Most Viewed Posts
              </h2>
              <div className="rounded-xl border border-border dark:border-border-dark overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border dark:border-border-dark bg-black/[0.02] dark:bg-white/[0.02]">
                      <th className="text-left px-4 py-3 font-medium">Title</th>
                      <th className="text-right px-4 py-3 font-medium">Views</th>
                      <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.mostViewed?.map((p) => (
                      <tr key={p._id} className="border-b border-border/50 dark:border-border-dark/50 last:border-0">
                        <td className="px-4 py-3 line-clamp-1">{p.title}</td>
                        <td className="px-4 py-3 text-right text-ink-faint">{p.views}</td>
                        <td className="px-4 py-3 text-right hidden sm:table-cell">
                          <button
                            onClick={() => featurePostMutation.mutate(p._id)}
                            className="p-1.5 rounded text-accent hover:bg-accent/10 transition-colors"
                            title="Toggle Feature"
                          >
                            <Star className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Most Liked */}
            <section>
              <h2 className="font-display text-xl font-semibold mb-4">Most Liked Posts</h2>
              <div className="rounded-xl border border-border dark:border-border-dark overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border dark:border-border-dark bg-black/[0.02] dark:bg-white/[0.02]">
                      <th className="text-left px-4 py-3 font-medium">Title</th>
                      <th className="text-right px-4 py-3 font-medium">Likes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.mostLiked?.map((p) => (
                      <tr key={p._id} className="border-b border-border/50 dark:border-border-dark/50 last:border-0">
                        <td className="px-4 py-3 line-clamp-1">{p.title}</td>
                        <td className="px-4 py-3 text-right text-ink-faint">{p.likeCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* New Users */}
            <section>
              <h2 className="font-display text-xl font-semibold mb-4">Recent Users</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {analyticsData.newUsers?.map((u) => (
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
                      <p className="text-xs text-ink-faint">Joined {formatDate(u.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </PageTransition>
    </Layout>
  );
}
