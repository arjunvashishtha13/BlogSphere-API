import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save, Eye, Send, Clock, ImagePlus, X, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { Skeleton } from '../components/Skeleton';
import { postsApi, uploadApi } from '../api';
import { useDraftStore } from '../store/authStore';
import { CATEGORIES, calculateReadingTime, renderMarkdown } from '../utils/helpers';

const PreviewPanel = lazy(() => import('../components/EditorPreview'));

export default function WritePage() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const { draft, saveDraft, clearDraft } = useDraftStore();

  const [title, setTitle] = useState(draft?.title || '');
  const [content, setContent] = useState(draft?.content || '');
  const [category, setCategory] = useState(draft?.category || 'Technology');
  const [tags, setTags] = useState(draft?.tags?.join(', ') || '');
  const [coverImage, setCoverImage] = useState(draft?.coverImage || '');
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingContentImg, setIsUploadingContentImg] = useState(false);

  // If we're editing an existing post, fetch its details
  const { data: existingPost } = useQuery({
    queryKey: ['post', editId],
    queryFn: () => postsApi.getById(editId),
    enabled: !!editId,
  });

  useEffect(() => {
    if (existingPost?.data?.post && editId) {
      const post = existingPost.data.post;
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setTags(post.tags?.join(', ') || '');
      setCoverImage(post.coverImage || '');
    }
  }, [existingPost, editId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        saveDraft({
          title,
          content,
          category,
          coverImage,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [title, content, category, coverImage, tags, saveDraft]);

  const publishMutation = useMutation({
    mutationFn: (status) => {
      const payload = {
        title,
        content,
        category,
        coverImage,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        status,
      };
      return editId ? postsApi.update(editId, payload) : postsApi.create(payload);
    },
    onSuccess: (res, status) => {
      clearDraft();
      toast.success(status === 'draft' ? 'Draft saved' : 'Published successfully');
      navigate(`/blog/${res.data.post._id}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const readingTime = calculateReadingTime(content);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    try {
      setIsUploading(true);
      const res = await uploadApi.image(file);
      setCoverImage(res.data.url);
      toast.success('Cover image uploaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage('');
  };

  const handleContentImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    try {
      setIsUploadingContentImg(true);
      const res = await uploadApi.image(file);
      const imageUrl = res.data.url;
      // Append markdown image syntax to content
      setContent((prev) => prev + (prev ? '\n\n' : '') + `![Image](${imageUrl})\n`);
      toast.success('Image added to content');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingContentImg(false);
    }
  };

  return (
    <Layout>
      <SEO title="Write" description="Create and publish your blog post." />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="font-display text-2xl font-semibold">
            {editId ? 'Edit post' : 'New post'}
          </h1>
          <div className="flex items-center gap-2 text-xs text-ink-faint">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
            {draft && <span className="ml-2 text-sage">· Draft auto-saved</span>}
          </div>
        </div>

        <div className="space-y-5">
          {coverImage ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-4 group">
              <img src={coverImage} alt="Cover preview" className="object-cover w-full h-full" />
              <button 
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                title="Remove cover image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <input
                type="file"
                id="coverImageInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="coverImageInput"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-ink-faint border border-border dark:border-border-dark rounded-lg cursor-pointer hover:bg-surface dark:hover:bg-surface-dark transition-colors"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {isUploading ? 'Uploading...' : 'Add cover image'}
              </label>
            </div>
          )}

          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full font-display text-2xl sm:text-3xl font-semibold bg-transparent border-none outline-none placeholder:text-ink-faint"
          />

          <div className="flex flex-wrap gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="flex-1 min-w-[200px] rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div className="flex flex-col w-full">
            {!showPreview && (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="file"
                  id="contentImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleContentImageUpload}
                  disabled={isUploadingContentImg}
                />
                <label
                  htmlFor="contentImageInput"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-faint border border-border dark:border-border-dark rounded-md cursor-pointer hover:bg-surface dark:hover:bg-surface-dark transition-colors"
                >
                  {isUploadingContentImg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                  {isUploadingContentImg ? 'Uploading...' : 'Insert Image'}
                </label>
              </div>
            )}
            {!showPreview ? (
              <textarea
                placeholder="Write your story... (Markdown supported: # headings, **bold**, *italic*, `code`, > quotes)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="w-full rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-5 py-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y font-mono"
              />
            ) : (
              <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
                <PreviewPanel title={title} content={content} />
              </Suspense>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t border-border dark:border-border-dark">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (!title || !content) return toast.error('Title and content required');
              publishMutation.mutate('draft');
            }}
            disabled={publishMutation.isPending}
          >
            <Save className="h-4 w-4" /> Save draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (!title || !content) return toast.error('Title and content required');
              publishMutation.mutate('published');
            }}
            disabled={publishMutation.isPending}
          >
            <Send className="h-4 w-4" /> Publish
          </Button>
        </div>
      </div>
    </Layout>
  );
}
