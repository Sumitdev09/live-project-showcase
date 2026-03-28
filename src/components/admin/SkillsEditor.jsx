import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, X, Loader2, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ICON_OPTIONS = [
  { value: 'code', label: '💻 Code' },
  { value: 'palette', label: '🎨 Palette' },
  { value: 'trending-up', label: '📈 Trending Up' },
  { value: 'zap', label: '⚡ Zap' },
  { value: 'star', label: '⭐ Star' },
  { value: 'heart', label: '❤️ Heart' },
  { value: 'lightbulb', label: '💡 Lightbulb' },
  { value: 'bar-chart', label: '📊 Bar Chart' },
  { value: 'settings', label: '⚙️ Settings' },
  { value: 'smartphone', label: '📱 Smartphone' },
];

const DEFAULT_STATS = [
  { label: 'Fast Delivery', value: '100%', icon_name: 'zap' },
  { label: 'Client Satisfaction', value: '100%', icon_name: 'heart' },
  { label: 'Creative Solutions', value: '100%', icon_name: 'lightbulb' },
  { label: 'Quality Work', value: '100%', icon_name: 'star' },
];

export default function SkillsEditor() {
  const queryClient = useQueryClient();

  // ── Category state
  const [editingId, setEditingId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({});
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(80);

  // ── Stats state
  const [stats, setStats] = useState(null);
  const [statsSaved, setStatsSaved] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['skillCategories'],
    queryFn: () => base44.entities.SkillCategory.list('order'),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['profile'],
    queryFn: () => base44.entities.Profile.list(),
  });
  const profile = profiles[0];

  useEffect(() => {
    if (profile && stats === null) {
      setStats(profile.skill_stats?.length > 0 ? profile.skill_stats : DEFAULT_STATS);
    }
  }, [profile, stats]);

  // ── Category mutations
  const saveMutation = useMutation({
    mutationFn: (data) => data.id
      ? base44.entities.SkillCategory.update(data.id, data)
      : base44.entities.SkillCategory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillCategories'] });
      setEditingId(null);
      setCategoryForm({});
      setNewSkillName('');
      setNewSkillLevel(80);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SkillCategory.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skillCategories'] }),
  });

  // ── Stats mutation
  const saveStatsMutation = useMutation({
    mutationFn: (statsData) => {
      if (profile?.id) return base44.entities.Profile.update(profile.id, { skill_stats: statsData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setStatsSaved(true);
      setTimeout(() => setStatsSaved(false), 2000);
    },
  });

  const startEdit = (cat) => {
    setEditingId(cat?.id || 'new');
    setCategoryForm(cat
      ? { ...cat, skills: [...(cat.skills || [])] }
      : { title: '', icon_name: 'star', order: categories.length, skills: [] }
    );
    setNewSkillName('');
    setNewSkillLevel(80);
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setCategoryForm(prev => ({
      ...prev,
      skills: [...(prev.skills || []), { name: newSkillName.trim(), level: newSkillLevel }]
    }));
    setNewSkillName('');
    setNewSkillLevel(80);
  };

  const updateSkill = (i, field, value) => {
    const skills = [...(categoryForm.skills || [])];
    skills[i] = { ...skills[i], [field]: value };
    setCategoryForm(prev => ({ ...prev, skills }));
  };

  const removeSkill = (i) => {
    setCategoryForm(prev => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }));
  };

  const updateStat = (i, field, value) => {
    const updated = [...stats];
    updated[i] = { ...updated[i], [field]: value };
    setStats(updated);
  };

  const removeStat = (i) => setStats(stats.filter((_, idx) => idx !== i));

  const addStat = () => setStats([...(stats || []), { label: 'New Stat', value: '100%', icon_name: 'star' }]);

  return (
    <div className="space-y-10">

      {/* ──── Skill Categories ──── */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Skill Categories</h2>
            <p className="text-sm text-slate-500 mt-0.5">Manage the skill columns shown in the Skills section</p>
          </div>
          <Button onClick={() => startEdit(null)} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </div>

        <AnimatePresence>
          {editingId && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="border-[#8B1A1A]/30 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">{editingId === 'new' ? 'New Category' : 'Edit Category'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Category Title</Label>
                      <Input
                        value={categoryForm.title || ''}
                        onChange={(e) => setCategoryForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Web Development"
                      />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Select
                        value={categoryForm.icon_name || 'star'}
                        onValueChange={(v) => setCategoryForm(p => ({ ...p, icon_name: v }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={categoryForm.order ?? 0}
                        onChange={(e) => setCategoryForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  {/* Skills list */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Skills in this Category ({(categoryForm.skills || []).length})
                    </Label>
                    <div className="space-y-2 mb-4">
                      {(categoryForm.skills || []).map((skill, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Input
                            value={skill.name}
                            onChange={(e) => updateSkill(i, 'name', e.target.value)}
                            className="w-36 h-8 text-sm"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => updateSkill(i, 'level', parseInt(e.target.value))}
                            className="flex-1 accent-[#8B1A1A]"
                          />
                          <span className="text-sm font-bold text-[#8B1A1A] w-10 text-right">{skill.level}%</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => removeSkill(i)}>
                            <X className="w-3.5 h-3.5 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      {(categoryForm.skills || []).length === 0 && (
                        <p className="text-sm text-slate-400 italic text-center py-2">No skills yet — add one below</p>
                      )}
                    </div>

                    {/* Add skill row */}
                    <div className="flex gap-2 items-end p-3 bg-[#fdf5f5] border border-[#8B1A1A]/20 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-xs text-slate-500 mb-1 block">Skill Name</Label>
                        <Input
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          placeholder="e.g. React"
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="h-9"
                        />
                      </div>
                      <div className="w-44">
                        <Label className="text-xs text-slate-500 mb-1 block">Level: {newSkillLevel}%</Label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={newSkillLevel}
                          onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                          className="w-full mt-2 accent-[#8B1A1A]"
                        />
                      </div>
                      <Button onClick={addSkill} size="sm" className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white h-9">
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      onClick={() => saveMutation.mutate(categoryForm)}
                      disabled={saveMutation.isPending || !categoryForm.title?.trim()}
                      className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white"
                    >
                      {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Category
                    </Button>
                    <Button variant="outline" onClick={() => { setEditingId(null); setCategoryForm({}); }}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories preview grid */}
        {categories.length === 0 && !editingId ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No skill categories yet. Add your first one!</p>
              <Button onClick={() => startEdit(null)} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Category
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Card key={cat.id} className="hover:border-[#8B1A1A]/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{cat.title}</CardTitle>
                      <span className="text-xs text-slate-400">
                        {ICON_OPTIONS.find(o => o.value === cat.icon_name)?.label || cat.icon_name} · Order {cat.order ?? 0}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(cat)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteMutation.mutate(cat.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(cat.skills || []).map((skill, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-700 truncate flex-1">{skill.name}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full">
                          <div className="h-full bg-[#8B1A1A] rounded-full" style={{ width: `${skill.level}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#8B1A1A] w-8">{skill.level}%</span>
                      </div>
                    </div>
                  ))}
                  {(!cat.skills || cat.skills.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No skills yet</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ──── Bottom Stats ──── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Bottom Stats Boxes</CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">The 4 highlight boxes below the skill cards (e.g. "Fast Delivery · 100%")</p>
            </div>
            <Button variant="outline" size="sm" onClick={addStat}>
              <Plus className="w-4 h-4 mr-1" /> Add Stat
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(stats || []).map((stat, i) => (
            <div key={i} className="flex flex-wrap items-end gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-36">
                <Label className="text-xs mb-1 block">Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(i, 'label', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="w-24">
                <Label className="text-xs mb-1 block">Value</Label>
                <Input
                  value={stat.value}
                  onChange={(e) => updateStat(i, 'value', e.target.value)}
                  className="h-8 text-sm"
                  placeholder="100%"
                />
              </div>
              <div className="w-40">
                <Label className="text-xs mb-1 block">Icon</Label>
                <Select value={stat.icon_name || 'star'} onValueChange={(v) => updateStat(i, 'icon_name', v)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeStat(i)}>
                <X className="w-3.5 h-3.5 text-red-500" />
              </Button>
            </div>
          ))}

          <div className="pt-2 border-t">
            <Button
              onClick={() => saveStatsMutation.mutate(stats)}
              disabled={saveStatsMutation.isPending || !profile?.id}
              className={statsSaved
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-[#8B1A1A] hover:bg-[#6E1515] text-white'}
            >
              {saveStatsMutation.isPending
                ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                : <Save className="w-4 h-4 mr-2" />}
              {statsSaved ? 'Saved!' : 'Save Stats'}
            </Button>
            {!profile?.id && (
              <p className="text-xs text-slate-400 mt-2">Please save a Profile first to enable stats saving.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}