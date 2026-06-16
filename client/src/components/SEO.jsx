import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, type = 'website', url }) {
  const fullTitle = title ? `${title} · BlogSphere` : 'BlogSphere — Write. Read. Discover.';
  const desc = description || 'A modern platform for thoughtful writing and discovery.';
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebSite',
          name: fullTitle,
          description: desc,
          url: pageUrl,
        })}
      </script>
    </Helmet>
  );
}
