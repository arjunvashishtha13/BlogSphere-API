import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Heart,
  Bookmark,
  Share2,
  Eye,
  Clock,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { PageTransition } from '../components/PageTransition';
import { postsApi, commentsApi, usersApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { formatDate, renderMarkdown, sharePost, getInitials } from '../utils/helpers';

export default function BlogDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [bookmarked, setBookmarked] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getById(id).then((r) => r.data.post),
    enabled: !!id,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentsApi.list(id).then((r) => r.data.comments),
    enabled: !!id,
  });

  const { data: related = [] } = useQuery({
    queryKey: ['related', id],
    queryFn: () => postsApi.related(id).then((r) => r.data.posts),
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: () =>
      post?.isLiked ? postsApi.unlike(id) : postsApi.like(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
    onError: (err) => toast.error(err.message),
  });

  const commentMutation = useMutation({
    mutationFn: (text) => commentsApi.create(id, text),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      toast.success('Comment added');
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => commentsApi.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      toast.success('Comment deleted');
    },
    onError: (err) => toast.error(err.message),
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => usersApi.toggleBookmark(id),
    onSuccess: (res) => {
      setBookmarked(res.data.bookmarked);
      toast.success(res.data.bookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks');
    },
    onError: (err) => toast.error(err.message),
  });

  const handleShare = async () => {
    try {
      await sharePost(post);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not share');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <EmptyState title="Post not found" description="This blog may have been removed or doesn't exist." />
      </Layout>
    );
  }

  const likeCount = post.likeCount ?? post.likes?.length ?? 0;

  return (
    <Layout>
      <SEO
        title={post.title}
        description={post.excerpt}
        type="article"
        url={`${window.location.origin}/blog/${post._id}`}
      />
      <PageTransition>
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <header className="mb-10">
            <span className="text-xs font-medium uppercase tracking-wider text-accent">
              {post.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-3 leading-tight">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-faint">
              <Link
                to={`/author/${post.author?._id}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/10 text-sage text-xs font-semibold">
                  {getInitials(post.author?.name)}
                </div>
                <span className="font-medium text-ink dark:text-[#e8e6e1]">
                  {post.author?.name}
                </span>
              </Link>
              <span>{formatDate(post.createdAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {post.views} views
              </span>
            </div>

            {post.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs rounded-full border border-border dark:border-border-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {post.coverImage && (
            <div className="mb-10 w-full overflow-hidden rounded-2xl border border-border dark:border-border-dark aspect-video">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div
            className="prose-blog text-base"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Actions */}
          <div className="mt-12 flex flex-wrap items-center gap-3 pt-8 border-t border-border dark:border-border-dark">
            <Button
              variant={post.isLiked ? 'accent' : 'secondary'}
              size="sm"
              onClick={() => {
                if (!token) return toast.error('Sign in to like posts');
                likeMutation.mutate();
              }}
              disabled={likeMutation.isPending}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
              {likeCount}
            </Button>
            <Button
              variant={bookmarked ? 'accent' : 'secondary'}
              size="sm"
              onClick={() => {
                if (!token) return toast.error('Sign in to bookmark posts');
                bookmarkMutation.mutate();
              }}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>

          {/* Comments */}
          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
              Comments ({comments.length})
            </h2>

            {token && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!commentText.trim()) return;
                  commentMutation.mutate(commentText);
                }}
                className="mb-8"
              >
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  disabled={commentMutation.isPending}
                >
                  Post comment
                </Button>
              </form>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-lg border border-border dark:border-border-dark p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sage/10 text-sage text-xs font-semibold">
                        {getInitials(comment.author?.name)}
                      </div>
                      <span className="text-sm font-medium">{comment.author?.name}</span>
                      <span className="text-xs text-ink-faint">{formatDate(comment.createdAt)}</span>
                    </div>
                    {user?._id === comment.author?._id && (
                      <button
                        onClick={() => deleteCommentMutation.mutate(comment._id)}
                        className="text-ink-faint hover:text-red-500 transition-colors"
                        aria-label="Delete comment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-ink-muted dark:text-[#b8b5ad]">{comment.text}</p>
                </div>
              ))}
              {!comments.length && (
                <p className="text-sm text-ink-faint text-center py-6">
                  No comments yet. Start the conversation.
                </p>
              )}
            </div>
          </section>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-border dark:border-border-dark bg-surface/50 dark:bg-surface-dark/30">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
              <h2 className="font-display text-2xl font-semibold mb-6">Related reads</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <BlogCard key={p._id} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </PageTransition>
    </Layout>
  );
}
