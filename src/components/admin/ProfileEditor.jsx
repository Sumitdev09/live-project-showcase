import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { User, Upload, Plus, X, Loader2, Save, Globe, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const SOCIAL_ICONS = {
  linkedin: '🔗', github: '🐱', twitter: '🐦', instagram: '📸',
  facebook: '📘', youtube: '🎬', dribbble: '🏀', behance: '🅱️', medium: '📝'
};

export default function ProfileEditor({ profile }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(profile || {});
  const [isUploading, setIsUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const handleGlobalSave = () => {
      if (formData && (formData.full_name || formData.email || formData.bio)) {
        mutation.mutate(formData);
      }
    };
    window.addEventListener('admin-save-all', handleGlobalSave);
    return () => window.removeEventListener('admin-save-all', handleGlobalSave);
  }, [formData]);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (profile?.id) return base44.entities.Profile.update(profile.id, data);
      return base44.entities.Profile.create(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, photo_url: file_url });
    setIsUploading(false);
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const skills = formData.skills || [];
    setFormData({ ...formData, skills: [...skills, { name: skillInput, level: 80 }] });
    setSkillInput('');
  };

  const updateSkillLevel = (index, level) => {
    const skills = [...(formData.skills || [])];
    skills[index].level = parseInt(level);
    setFormData({ ...formData, skills });
  };

  const removeSkill = (index) => {
    const skills = [...(formData.skills || [])];
    skills.splice(index, 1);
    setFormData({ ...formData, skills });
  };

  return (
    <div className="space-y-8">
      {/* Photo & Name Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0505] via-[#2a0a0a] to-[#3a1010] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative flex items-center gap-6">
          <div className="relative group">
            {formData.photo_url ? (
              <img src={formData.photo_url} alt="Profile" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/10 shadow-2xl" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center ring-4 ring-white/10">
                <User className="w-10 h-10 text-white/40" />
              </div>
            )}
            <Label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Upload className="w-6 h-6 text-white" />}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </Label>
          </div>
          <div className="flex-1">
            <Input
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Your Full Name"
              className="bg-white/10 border-white/10 text-white text-2xl font-bold placeholder:text-white/30 h-auto py-2 focus:ring-[#8B1A1A]"
            />
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Your Title / Tagline"
              className="bg-white/10 border-white/10 text-white/70 mt-2 placeholder:text-white/30 focus:ring-[#8B1A1A]"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="text-base font-bold mb-5 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#8B1A1A]" /> Contact Information
        </h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</Label>
            <Input value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</Label>
            <Input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</Label>
            <Input value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Mumbai, India" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><LinkIcon className="w-3 h-3" /> Download CV Link</Label>
            <Input value={formData.resume_url || ''} onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })} placeholder="https://drive.google.com/your-cv" className="h-10" />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="text-base font-bold mb-4">✍️ Bio</h3>
        <Textarea
          value={formData.bio || ''}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell your story in a few sentences..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Social Links */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="text-base font-bold mb-5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#8B1A1A]" /> Social Links
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(SOCIAL_ICONS).map(([key, emoji]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground capitalize flex items-center gap-1.5">
                <span className="text-sm">{emoji}</span> {key}
              </Label>
              <Input
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                placeholder={`https://${key}.com/...`}
                className="h-10"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending} className="w-full bg-[#8B1A1A] hover:bg-[#6E1515] text-white h-12 text-base font-semibold rounded-xl shadow-lg shadow-[#8B1A1A]/20">
        {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
        Save Profile
      </Button>
    </div>
  );
}
