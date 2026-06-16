import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadApi } from '../api';
import toast from 'react-hot-toast';

export default function ImageUpload({ value, onChange, className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return toast.error('Only jpg, jpeg, png, and webp files are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size must be under 5MB');
    }

    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadApi.image(file, (e) => {
        if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      onChange(res.data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  if (value) {
    return (
      <div className={`relative rounded-xl overflow-hidden border border-border dark:border-border-dark group ${className}`}>
        <img src={value} alt="Cover" className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="Change image"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 rounded-lg bg-white/20 text-white hover:bg-red-500/60 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed transition-colors ${
        dragOver
          ? 'border-accent bg-accent/5'
          : 'border-border dark:border-border-dark hover:border-accent/50'
      } ${className}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex flex-col items-center justify-center gap-3 py-10 px-6 text-center cursor-pointer"
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 text-accent animate-spin" />
            <div className="w-40">
              <div className="h-1.5 rounded-full bg-border dark:bg-border-dark overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-ink-faint mt-2">Uploading... {progress}%</p>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-black/[0.04] dark:bg-white/[0.06]">
              <ImageIcon className="h-6 w-6 text-ink-faint" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-muted dark:text-[#b8b5ad]">
                {dragOver ? 'Drop image here' : 'Add cover image'}
              </p>
              <p className="text-xs text-ink-faint mt-1">
                Drag & drop or click to browse · JPG, PNG, WebP · Max 5MB
              </p>
            </div>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
