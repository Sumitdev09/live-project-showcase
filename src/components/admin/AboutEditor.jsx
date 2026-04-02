import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, X, Loader2, Save, BarChart3, Heart, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const DEFAULT_ABOUT = {
  headline: "Hello! I'm a Creative Professional",
  subtitle: 'A passionate fresh graduate with expertise in web development, graphic design, and digital marketing. I create beautiful digital experiences that inspire and engage users.',
  description: "I'm a fresh graduate with a unique blend of skills in web development, digital marketing, and graphic design.",
  stats: [
    { value: '10+', label: 'Projects Completed' },
    { value: '15+', label: 'Happy Clients' },
    { value: '3+', label: 'Years Learning' },
    { value: '∞', label: 'Cups of Coffee' },
  ],
  traits: [
    { title: 'Fresh Graduate', description: 'Recently graduated with a passion for digital innovation and creativity', icon: 'GraduationCap' },
    { title: 'Goal-Oriented', description: 'Focused on delivering results that exceed expectations every time', icon: 'Target' },
    { title: 'Passionate', description: 'Love turning creative ideas into beautiful digital reality', icon: 'Heart' },
    { title: 'Fast Learner', description: 'Quick to adapt and master new technologies and methodologies', icon: 'Zap' },
  ],
  interests: [],
};

export default function AboutEditor({ profile }) {
  const queryClient = useQueryClient();
  const aboutData = profile?.interests || DEFAULT_ABOUT;
  const [formData, setFormData] = useState(aboutData);

  useEffect(() => {
    if (profile?.interests) {
      setFormData(profile.interests);
    }
  }, [profile]);

  useEffect(() => {
    const handleGlobalSave = () => {
      if (profile?.id) mutation.mutate(formData);
    };
    window.addEventListener('admin-save-all', handleGlobalSave);
    return () => window.removeEventListener('admin-save-all', handleGlobalSave);
  }, [formData, profile]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (profile?.id) return base44.entities.Profile.update(profile.id, { interests: data });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const updateStat = (index, field, value) => {
    const stats = [...(formData.stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    setFormData({ ...formData, stats });
  };

  const addStat = () => {
    setFormData({ ...formData, stats: [...(formData.stats || []), { value: '0+', label: 'New Stat' }] });
  };

  const removeStat = (index) => {
    const stats = [...(formData.stats || [])];
    stats.splice(index, 1);
    setFormData({ ...formData, stats });
  };

  const updateTrait = (index, field, value) => {
    const traits = [...(formData.traits || [])];
    traits[index] = { ...traits[index], [field]: value };
    setFormData({ ...formData, traits });
  };

  const addTrait = () => {
    setFormData({ ...formData, traits: [...(formData.traits || []), { title: 'New Trait', description: 'Describe this trait...', icon: 'Sparkles' }] });
  };

  const removeTrait = (index) => {
    const traits = [...(formData.traits || [])];
    traits.splice(index, 1);
    setFormData({ ...formData, traits });
  };

  const updateInterest = (index, value) => {
    const interests = [...(formData.interests || [])];
    interests[index] = value;
    setFormData({ ...formData, interests });
  };

  const addInterest = () => {
    setFormData({ ...formData, interests: [...(formData.interests || []), 'New Interest'] });
  };

  const removeInterest = (index) => {
    const interests = [...(formData.interests || [])];
    interests.splice(index, 1);
    setFormData({ ...formData, interests });
  };

  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8B1A1A]" /> Headline
        </h3>
        <Input
          value={formData.headline || ''}
          onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
          placeholder="Hello! I'm a Creative Professional"
        />
      </div>

      {/* Subtitle / Intro Paragraph */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8B1A1A]" /> Section Subtitle
        </h3>
        <Textarea
          value={formData.subtitle || ''}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="A short description shown below the section title..."
          rows={2}
          className="resize-none"
        />
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8B1A1A]" /> Description Paragraph
        </h3>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="A detailed paragraph about yourself..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#8B1A1A]" /> Stats
          </h3>
          <Button onClick={addStat} size="sm" className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white h-8 px-3 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {(formData.stats || []).map((stat, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[hsl(var(--muted))] rounded-xl group">
              <Input
                value={stat.value}
                onChange={(e) => updateStat(i, 'value', e.target.value)}
                placeholder="10+"
                className="w-20 h-9 text-center font-bold"
              />
              <Input
                value={stat.label}
                onChange={(e) => updateStat(i, 'label', e.target.value)}
                placeholder="Projects Done"
                className="flex-1 h-9"
              />
              <button onClick={() => removeStat(i)} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Traits */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#8B1A1A]" /> Personality Traits
          </h3>
          <Button onClick={addTrait} size="sm" className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white h-8 px-3 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {(formData.traits || []).map((trait, i) => (
            <div key={i} className="p-4 bg-[hsl(var(--muted))] rounded-xl space-y-2 group">
              <div className="flex items-center gap-3">
                <Input
                  value={trait.title}
                  onChange={(e) => updateTrait(i, 'title', e.target.value)}
                  placeholder="Trait title"
                  className="flex-1 h-9 font-semibold"
                />
                <button onClick={() => removeTrait(i)} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
              <Textarea
                value={trait.description}
                onChange={(e) => updateTrait(i, 'description', e.target.value)}
                placeholder="Describe this trait..."
                rows={2}
                className="resize-none text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            💡 Interests
          </h3>
          <Button onClick={addInterest} size="sm" className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white h-8 px-3 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.interests || []).map((interest, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-[hsl(var(--muted))] rounded-full px-3 py-1.5">
              <Input
                value={interest}
                onChange={(e) => updateInterest(i, e.target.value)}
                className="h-6 border-none bg-transparent p-0 text-sm w-24 focus-visible:ring-0"
              />
              <button onClick={() => removeInterest(i)} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending} className="w-full bg-[#8B1A1A] hover:bg-[#6E1515] text-white h-12 text-base font-semibold rounded-xl shadow-lg shadow-[#8B1A1A]/20">
        {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
        Save About Section
      </Button>
    </div>
  );
}
