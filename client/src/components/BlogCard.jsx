import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <Link to={`/blog/${post._id}`} className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-accent">
            {post.category}
          </span>
          {post.status === 'draft' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              Draft
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

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/60 dark:border-border-dark/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage/10 text-sage text-xs font-semibold">
              {getInitials(post.author?.name)}
            </div>
            <div>
              <p className="text-sm font-medium">{post.author?.name}</p>
              <p className="text-xs text-ink-faint">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-ink-faint">
            <span>{post.readingTime || 1} min read</span>
            <span>{post.views || 0} views</span>
            <span>{likeCount} likes</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
