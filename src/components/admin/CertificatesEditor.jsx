import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, Save, X, Upload, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function CertificatesEditor() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => base44.entities.Certificate.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) return base44.entities.Certificate.update(data.id, data);
      return base44.entities.Certificate.create(data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['certificates'] }); setEditing(null); setFormData({}); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Certificate.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['certificates'] }),
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, image_url: file_url });
    setIsUploading(false);
  };

  const startEdit = (cert) => { setEditing(cert?.id || 'new'); setFormData(cert || {}); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1a1a1a]">Certificates ({certificates.length})</h3>
        <Button onClick={() => startEdit(null)} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Certificate
        </Button>
      </div>

      <AnimatePresence>
        {editing !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-[#e0e0e0] p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-[#1a1a1a]">{editing === 'new' ? 'New Certificate' : 'Edit Certificate'}</h4>
              <Button variant="ghost" size="icon" onClick={() => { setEditing(null); setFormData({}); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Certificate title" />
              </div>
              <div className="space-y-2">
                <Label>Issuer</Label>
                <Input value={formData.issuer || ''} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} placeholder="Issuing organization" />
              </div>
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input value={formData.issue_date || ''} onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })} placeholder="e.g. Jan 2024" />
              </div>
              <div className="space-y-2">
                <Label>Credential URL</Label>
                <Input value={formData.credential_url || ''} onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })} placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of the certificate" rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Certificate Image</Label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="w-24 h-16 object-cover rounded-lg border" />
                )}
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#f9f0f0] hover:bg-[#f0e0e0] rounded-xl text-sm font-medium text-[#8B1A1A] transition-colors">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={formData.featured || false} onCheckedChange={(v) => setFormData({ ...formData, featured: v })} />
              <Label>Featured (show on homepage)</Label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => { setEditing(null); setFormData({}); }} className="rounded-xl">Cancel</Button>
              <Button
                onClick={() => saveMutation.mutate(formData)}
                disabled={!formData.title || saveMutation.isPending}
                className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-xl"
              >
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-3">
        {certificates.map((cert) => (
          <motion.div
            key={cert.id}
            layout
            className="bg-white rounded-2xl border border-[#e0e0e0] p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            {cert.image_url ? (
              <img src={cert.image_url} alt={cert.title} className="w-16 h-12 object-cover rounded-lg border" />
            ) : (
              <div className="w-16 h-12 bg-[#f9f0f0] rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-[#8B1A1A]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-[#1a1a1a] truncate">{cert.title}</h4>
                {cert.featured && (
                  <span className="text-[10px] bg-[#8B1A1A]/10 text-[#8B1A1A] px-2 py-0.5 rounded-full font-bold">Featured</span>
                )}
              </div>
              <p className="text-sm text-[#666666] truncate">{cert.issuer} {cert.issue_date && `· ${cert.issue_date}`}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => startEdit(cert)} className="rounded-xl hover:bg-[#f9f0f0]">
                <Pencil className="w-4 h-4 text-[#666666]" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(cert.id)} className="rounded-xl hover:bg-red-50">
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </motion.div>
        ))}
        {certificates.length === 0 && (
          <div className="text-center py-12 text-[#999999]">
            <Award className="w-12 h-12 mx-auto mb-3 text-[#ccc]" />
            <p>No certificates yet. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
