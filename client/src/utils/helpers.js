export const CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Science',
  'Culture',
  'Tutorial',
  'Opinion',
];

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const calculateReadingTime = (content = '') => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

export const renderMarkdown = (content = '') => {
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hubl])(.+)$/gim, '<p>$1</p>');
};

export const sharePost = async (post) => {
  const url = `${window.location.origin}/blog/${post._id}`;
  const data = { title: post.title, text: post.excerpt, url };

  if (navigator.share) {
    await navigator.share(data);
  } else {
    await navigator.clipboard.writeText(url);
  }
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
