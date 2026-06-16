const calculateReadingTime = (content = '') => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

const generateExcerpt = (content = '', maxLength = 160) => {
  const plain = content.replace(/[#*_`>\[\]()]/g, '').trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trim()}…`;
};

module.exports = { calculateReadingTime, generateExcerpt };
