import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, Clock } from 'lucide-react';
import { formatDate, getInitials } from '../utils/helpers';

export default function BlogCard({ post, featured = false }) {
  const likeCount = post.likes?.length ?? post.likeCount ?? 0;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark overflow-hidden transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      <Link to={`/blog/${post._id}`} className="flex flex-col flex-1">
        {/* Cover image */}
        {post.coverImage && (
          <div className={`overflow-hidden ${featured ? 'md:w-1/2 md:shrink-0' : ''}`}>
            <img
              src={post.coverImage}
              alt={post.title}
              className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                featured ? 'h-48 md:h-full' : 'h-44'
              }`}
              loading="lazy"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Link
              to={`/categories/${post.category}`}
              className="text-xs font-medium uppercase tracking-wider text-accent hover:text-accent-hover transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {post.category}
            </Link>
            {post.status === 'draft' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Draft
              </span>
            )}
            {post.isFeatured && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                Featured
              </span>
            )}
          </div>

          <h3
            className={`font-display font-semibold text-ink dark:text-[#e8e6e1] group-hover:text-accent transition-colors ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {post.title}
          </h3>

          <p className="mt-2 text-sm text-ink-muted dark:text-[#b8b5ad] line-clamp-2 leading-relaxed flex-1">
            {post.excerpt || post.content?.slice(0, 140)}
          </p>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-ink-muted dark:text-[#b8b5ad]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/60 dark:border-border-dark/60">
            <div className="flex items-center gap-2.5">
              {post.author?.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage/10 text-sage text-xs font-semibold">
                  {getInitials(post.author?.name)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{post.author?.name}</p>
                <p className="text-xs text-ink-faint">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-faint">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {post.readingTime || 1}m
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {post.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> {likeCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
