import { useQuery } from '@tanstack/react-query';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';
import { BlogListSkeleton } from '../components/Skeleton';
import { FadeIn, StaggerContainer, staggerItem } from '../components/PageTransition';
import { motion } from 'framer-motion';
import { postsApi } from '../api';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const { user } = useAuthStore();

  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => postsApi.featured().then((r) => r.data.posts),
  });

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['posts', 'trending'],
    queryFn: () => postsApi.trending().then((r) => r.data.posts),
  });

  return (
    <Layout>
      <SEO
        title="Write. Read. Discover."
        description="BlogSphere is a modern platform for thoughtful writing, curated discovery, and meaningful conversations."
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border dark:border-border-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(180,83,9,0.06)_0%,_transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 relative">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent mb-4">
              A home for your ideas
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight max-w-3xl">
              Where thoughtful writing meets{' '}
              <span className="text-accent italic">curious readers</span>
            </h1>
            <p className="mt-6 text-lg text-ink-muted dark:text-[#b8b5ad] max-w-xl leading-relaxed">
              Publish stories that matter. Discover perspectives that broaden yours.
              Built for writers who care about craft, not clutter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={user ? '/write' : '/register'} variant="primary" size="lg">
                Start writing <ArrowRight className="h-4 w-4" />
              </Button>
              <Button to="/explore" variant="secondary" size="lg">
                Explore blogs
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { label: 'Categories', value: '8' },
              { label: 'Reading time', value: 'Smart' },
              { label: 'Analytics', value: 'Built-in' },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-display text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-ink-faint mt-0.5">{stat.label}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-semibold">Featured</h2>
          </div>
          <Link to="/explore" className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {featuredLoading ? (
          <BlogListSkeleton count={3} />
        ) : featured?.length ? (
          <StaggerContainer className="grid gap-6 md:grid-cols-2">
            {featured.slice(0, 4).map((post, i) => (
              <motion.div key={post._id} variants={staggerItem} className={i === 0 ? 'md:col-span-2' : ''}>
                <BlogCard post={post} featured={i === 0} />
              </motion.div>
            ))}
          </StaggerContainer>
        ) : (
          <EmptyState
            title="No featured posts yet"
            description="Be the first to publish something worth reading."
            action={<Button to="/write">Write the first post</Button>}
          />
        )}
      </section>

      {/* Trending */}
      <section className="bg-surface/50 dark:bg-surface-dark/30 border-y border-border dark:border-border-dark">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-5 w-5 text-sage" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-semibold">Trending this week</h2>
          </div>

          {trendingLoading ? (
            <BlogListSkeleton count={4} />
          ) : trending?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trending.slice(0, 4).map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="posts"
              title="Nothing trending yet"
              description="Popular posts from the last seven days will appear here."
            />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-display text-3xl font-semibold mb-4">Ready to share your perspective?</h2>
          <p className="text-ink-muted dark:text-[#b8b5ad] max-w-md mx-auto mb-8">
            Join writers who publish with intention. Draft, preview, and publish — all in one place.
          </p>
          <Button to={user ? '/write' : '/register'} variant="accent" size="lg">
            Create your first post
          </Button>
        </FadeIn>
      </section>
    </Layout>
  );
}
