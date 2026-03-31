import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, Save, X, Upload, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export default function BlogEditor({ posts }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) return base44.entities.BlogPost.update(data.id, data);
      return base44.entities.BlogPost.create(data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['blogPosts'] }); setEditing(null); setFormData({}); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogPosts'] }),
  });

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, cover_image: file_url });
    setIsUploading(false);
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setFormData({ ...formData, tags: [...(formData.tags || []), tagInput] });
    setTagInput('');
  };

  const startEdit = (post) => { setEditing(post?.id || 'new'); setFormData(post || { published: true }); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Blog Posts</h2>
          <p className="text-sm text-muted-foreground mt-1">Share your thoughts & articles</p>
        </div>
        <Button onClick={() => startEdit({})} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="rounded-2xl border-2 border-[#8B1A1A]/20 bg-[hsl(var(--card))] p-6 space-y-5">
              <h3 className="font-bold text-base">{editing === 'new' ? '📝 New Blog Post' : '✏️ Edit Post'}</h3>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Excerpt</Label>
                <Input value={formData.excerpt || ''} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Brief summary..." className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Content (Markdown)</Label>
                <Textarea value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} className="font-mono text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Cover Image</Label>
                <div className="flex gap-4 items-center">
                  {formData.cover_image && <img src={formData.cover_image} alt="" className="w-40 h-24 object-cover rounded-xl" />}
                  <Label className="cursor-pointer">
                    <Button variant="outline" disabled={isUploading} asChild className="rounded-xl">
                      <span>{isUploading ? 'Uploading...' : <><Upload className="w-4 h-4 mr-2" /> Upload Cover</>}</span>
                    </Button>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </Label>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Tags</Label>
                <div className="flex gap-2 mb-3">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag..." onKeyPress={(e) => e.key === 'Enter' && addTag()} className="h-10" />
                  <Button onClick={addTag} variant="outline" className="rounded-xl h-10"><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.tags || []).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="cursor-pointer rounded-lg" onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, idx) => idx !== i) })}>
                      {tag} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={formData.published ?? true} onCheckedChange={(checked) => setFormData({ ...formData, published: checked })} />
                <Label className="text-sm">Published</Label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-xl">
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
                </Button>
                <Button variant="outline" onClick={() => { setEditing(null); setFormData({}); }} className="rounded-xl">Cancel</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[#8B1A1A]/30 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {post.cover_image ? (
                  <img src={post.cover_image} alt="" className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />
                ) : (
                  <div className="w-20 h-14 rounded-xl bg-[#8B1A1A]/5 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-[#8B1A1A]/30" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">{post.title}</h3>
                    {!post.published && <Badge variant="outline" className="text-[10px] rounded-lg">Draft</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : 'No date'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => startEdit(post)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => deleteMutation.mutate(post.id)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {posts.length === 0 && !editing && (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[hsl(var(--border))]">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No blog posts yet</p>
          <Button onClick={() => startEdit({})} variant="link" className="text-[#8B1A1A] mt-2">Write your first post</Button>
        </div>
      )}
    </div>
  );
}
