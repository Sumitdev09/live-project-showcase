import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, Save, GraduationCap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function EducationEditor({ education }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) return base44.entities.Education.update(data.id, data);
      return base44.entities.Education.create(data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['education'] }); setEditing(null); setFormData({}); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Education.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['education'] }),
  });

  const startEdit = (edu) => { setEditing(edu?.id || 'new'); setFormData(edu || {}); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Education</h2>
          <p className="text-sm text-muted-foreground mt-1">Your academic background</p>
        </div>
        <Button onClick={() => startEdit({})} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Education
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="rounded-2xl border-2 border-[#8B1A1A]/20 bg-[hsl(var(--card))] p-6 space-y-5">
              <h3 className="font-bold text-base">{editing === 'new' ? '🎓 New Education' : '✏️ Edit Education'}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Institution</Label>
                  <Input value={formData.institution || ''} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Degree</Label>
                  <Input value={formData.degree || ''} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Field of Study</Label>
                  <Input value={formData.field || ''} onChange={(e) => setFormData({ ...formData, field: e.target.value })} className="h-10" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Start Year</Label>
                    <Input type="number" value={formData.start_year || ''} onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) })} className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">End Year</Label>
                    <Input type="number" value={formData.end_year || ''} onChange={(e) => setFormData({ ...formData, end_year: parseInt(e.target.value) })} className="h-10" />
                  </div>
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

      <div className="grid md:grid-cols-2 gap-4">
        {education.map(edu => (
          <div key={edu.id} className="group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[#8B1A1A]/30 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B1A1A]/10 to-[#8B1A1A]/5 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-[#8B1A1A]" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{edu.degree}</h3>
                  <p className="text-[#8B1A1A] font-medium text-sm">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground mt-1">{edu.start_year} — {edu.end_year || 'Present'}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => startEdit(edu)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => deleteMutation.mutate(edu.id)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {education.length === 0 && !editing && (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[hsl(var(--border))]">
          <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No education added yet</p>
          <Button onClick={() => startEdit({})} variant="link" className="text-[#8B1A1A] mt-2">Add your first education</Button>
        </div>
      )}
    </div>
  );
}
