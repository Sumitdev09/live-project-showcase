import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, Save, X, Upload, Folder, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProjectsEditor({ projects }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [techInput, setTechInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) return base44.entities.Project.update(data.id, data);
      return base44.entities.Project.create(data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); setEditing(null); setFormData({}); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, image_url: file_url });
    setIsUploading(false);
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setFormData({ ...formData, technologies: [...(formData.technologies || []), techInput] });
    setTechInput('');
  };

  const startEdit = (proj) => { setEditing(proj?.id || 'new'); setFormData(proj || {}); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">Showcase your best work</p>
        </div>
        <Button onClick={() => startEdit({})} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="rounded-2xl border-2 border-[#8B1A1A]/20 bg-[hsl(var(--card))] p-6 space-y-5">
              <h3 className="font-bold text-base">{editing === 'new' ? '🚀 New Project' : '✏️ Edit Project'}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <Input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <Select value={formData.category || 'Web Development'} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={formData.featured || false} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
                  <Label className="text-sm">⭐ Featured Project</Label>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    {formData.category === 'Web Development' ? 'Live Preview URL' : 'View Link URL'}
                  </Label>
                  <Input value={formData.live_url || ''} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} placeholder="https://..." className="h-10" />
                </div>
                {formData.category === 'Web Development' ? (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">GitHub URL</Label>
                    <Input value={formData.github_url || ''} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} placeholder="https://github.com/..." className="h-10" />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Materials / Assets URL</Label>
                    <Input value={formData.material_url || ''} onChange={(e) => setFormData({ ...formData, material_url: e.target.value })} placeholder="https://link-to-materials.com" className="h-10" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Project Image</Label>
                <div className="flex gap-4 items-center">
                  {formData.image_url && <img src={formData.image_url} alt="" className="w-32 h-20 object-cover rounded-xl" />}
                  <Label className="cursor-pointer">
                    <Button variant="outline" disabled={isUploading} asChild className="rounded-xl">
                      <span>{isUploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...</> : <><Upload className="w-4 h-4 mr-2" /> Upload Image</>}</span>
                    </Button>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </Label>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Technologies</Label>
                <div className="flex gap-2 mb-3">
                  <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology..." onKeyPress={(e) => e.key === 'Enter' && addTech()} className="h-10" />
                  <Button onClick={addTech} variant="outline" className="rounded-xl h-10"><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.technologies || []).map((tech, i) => (
                    <Badge key={i} variant="secondary" className="cursor-pointer rounded-lg hover:bg-red-100 transition-colors" onClick={() => setFormData({ ...formData, technologies: formData.technologies.filter((_, idx) => idx !== i) })}>
                      {tech} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(proj => (
          <div key={proj.id} className="group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden hover:border-[#8B1A1A]/30 hover:shadow-lg transition-all">
            {proj.image_url ? (
              <div className="relative h-36 overflow-hidden">
                <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {proj.featured && (
                  <Badge className="absolute top-3 left-3 bg-[#8B1A1A] text-white text-[10px] rounded-lg">⭐ Featured</Badge>
                )}
              </div>
            ) : (
              <div className="h-36 bg-gradient-to-br from-[#8B1A1A]/5 to-[#8B1A1A]/10 flex items-center justify-center">
                <Folder className="w-10 h-10 text-[#8B1A1A]/20" />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm truncate">{proj.title}</h3>
                  <Badge variant="outline" className="text-[10px] mt-1 rounded-lg">{proj.category}</Badge>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{proj.description}</p>
                </div>
                <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => startEdit(proj)}><Pencil className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => deleteMutation.mutate(proj.id)}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && !editing && (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[hsl(var(--border))]">
          <Folder className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No projects yet</p>
          <Button onClick={() => startEdit({})} variant="link" className="text-[#8B1A1A] mt-2">Add your first project</Button>
        </div>
      )}
    </div>
  );
}
