import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api';
import { formatDate } from '../utils/helpers';

const typeLabels = {
  like: 'liked your post',
  comment: 'commented on your post',
  reply: 'replied to your comment on',
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const queryClient = useQueryClient();

  const { data: countData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.unreadCount().then((r) => r.data.count),
    refetchInterval: 30000,
  });

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list().then((r) => r.data.notifications),
    enabled: open,
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = countData || 0;
  const notifications = notifData || [];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white px-1">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-border-dark">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unread > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                className="text-xs text-accent hover:text-accent-hover transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-ink-faint text-center py-8">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  to={n.post ? `/blog/${n.post._id}` : '#'}
                  onClick={() => {
                    if (!n.read) markReadMutation.mutate(n._id);
                    setOpen(false);
                  }}
                  className={`block px-4 py-3 border-b border-border/50 dark:border-border-dark/50 last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors ${
                    !n.read ? 'bg-accent/[0.04]' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">
                        <span className="font-medium">{n.sender?.name}</span>{' '}
                        <span className="text-ink-muted dark:text-[#b8b5ad]">
                          {typeLabels[n.type] || n.type}
                        </span>{' '}
                        {n.post && (
                          <span className="font-medium">{n.post.title}</span>
                        )}
                      </p>
                      <p className="text-xs text-ink-faint mt-1">{formatDate(n.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
