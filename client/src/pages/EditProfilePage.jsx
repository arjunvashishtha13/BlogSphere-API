import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Camera, Globe, Github, Twitter, Linkedin, Save } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SEO from '../components/SEO';
import ImageUpload from '../components/ImageUpload';
import { PageTransition } from '../components/PageTransition';
import { usersApi } from '../api';
import { useAuthStore } from '../store/authStore';

export default function EditProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => usersApi.profile().then((r) => r.data.user),
  });

  const [form, setForm] = useState({
    name: profile?.name || user?.name || '',
    bio: profile?.bio || user?.bio || '',
    avatar: profile?.avatar || user?.avatar || '',
    website: profile?.website || '',
    github: profile?.github || '',
    twitter: profile?.twitter || '',
    linkedin: profile?.linkedin || '',
  });

  // Sync form when profile loads
  useState(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        website: profile.website || '',
        github: profile.github || '',
        twitter: profile.twitter || '',
        linkedin: profile.linkedin || '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data) => usersApi.updateProfile(data),
    onSuccess: (res) => {
      const updated = res.data.user;
      setAuth({ ...user, ...updated }, token);
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Profile updated');
      navigate(`/author/${user._id}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <Layout>
      <SEO title="Edit Profile" description="Update your BlogSphere profile." />
      <PageTransition className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold mb-8">Edit Profile</h1>

        <div className="space-y-8">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-3">Profile photo</label>
            <div className="flex items-start gap-6">
              <div className="relative group">
                {form.avatar ? (
                  <img src={form.avatar} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-sage/10 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-ink-faint" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <ImageUpload
                  value={form.avatar}
                  onChange={(url) => setForm({ ...form, avatar: url })}
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              className="w-full rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1.5">Bio</label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={handleChange('bio')}
              rows={3}
              maxLength={500}
              placeholder="Tell others about yourself..."
              className="w-full rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
            />
            <p className="mt-1 text-xs text-ink-faint">{form.bio.length}/500</p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-medium mb-4">Social Links</h3>
            <div className="space-y-3">
              {[
                { key: 'website', icon: Globe, placeholder: 'https://yoursite.com' },
                { key: 'github', icon: Github, placeholder: 'https://github.com/username' },
                { key: 'twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
                { key: 'linkedin', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
              ].map(({ key, icon: Icon, placeholder }) => (
                <div key={key} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-ink-faint shrink-0" />
                  <input
                    type="url"
                    value={form[key]}
                    onChange={handleChange(key)}
                    placeholder={placeholder}
                    className="flex-1 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-border dark:border-border-dark">
            <Button
              variant="primary"
              onClick={() => updateMutation.mutate(form)}
              disabled={updateMutation.isPending}
            >
              <Save className="h-4 w-4" /> {updateMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
