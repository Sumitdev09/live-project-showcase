import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, Save, Briefcase, MapPin, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ExperienceEditor({ experiences }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) return base44.entities.Experience.update(data.id, data);
      return base44.entities.Experience.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setEditing(null);
      setFormData({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Experience.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] }),
  });

  const startEdit = (exp) => {
    setEditing(exp?.id || 'new');
    setFormData(exp || {});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Work Experience</h2>
          <p className="text-sm text-muted-foreground mt-1">Add your professional journey</p>
        </div>
        <Button onClick={() => startEdit({})} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Experience
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="rounded-2xl border-2 border-[#8B1A1A]/20 bg-[hsl(var(--card))] p-6 space-y-5">
              <h3 className="font-bold text-base">{editing === 'new' ? '✨ New Experience' : '✏️ Edit Experience'}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Company</Label>
                  <Input value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Position</Label>
                  <Input value={formData.position || ''} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Input type="date" value={formData.end_date || ''} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} disabled={formData.is_current} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <Input value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="h-10" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={formData.is_current || false} onCheckedChange={(checked) => setFormData({ ...formData, is_current: checked })} />
                  <Label className="text-sm">Currently working here</Label>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
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
        {experiences.map(exp => (
          <div key={exp.id} className="group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[#8B1A1A]/30 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B1A1A]/10 to-[#8B1A1A]/5 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-[#8B1A1A]" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{exp.position}</h3>
                  <p className="text-[#8B1A1A] font-medium text-sm">{exp.company}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}</span>
                    {exp.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.location}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => startEdit(exp)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => deleteMutation.mutate(exp.id)}>
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {experiences.length === 0 && !editing && (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[hsl(var(--border))]">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No experience added yet</p>
            <Button onClick={() => startEdit({})} variant="link" className="text-[#8B1A1A] mt-2">Add your first experience</Button>
          </div>
        )}
      </div>
    </div>
  );
}
