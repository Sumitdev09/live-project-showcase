import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, GraduationCap, Folder, BookOpen, MessageSquare, BarChart3,
  Plus, Pencil, Trash2, Save, X, Loader2, Upload, ArrowLeft, LogOut, Sun, Moon
} from 'lucide-react';
import SkillsEditor from '@/components/admin/SkillsEditor';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { format } from 'date-fns';

export default function Admin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('adminTheme') === 'dark');
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    const authTime = sessionStorage.getItem('adminAuthTime');
   
    // Session expires after 2 hours
    const sessionDuration = 2 * 60 * 60 * 1000;
    const isExpired = authTime && (Date.now() - parseInt(authTime)) > sessionDuration;
   
    if (!isAuth || isExpired) {
      sessionStorage.removeItem('adminAuth');
      sessionStorage.removeItem('adminAuthTime');
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('adminTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminAuthTime');
    navigate(createPageUrl('Home'));
  };

  // Queries
  const { data: profiles } = useQuery({
    queryKey: ['profile'],
    queryFn: () => base44.entities.Profile.list(),
  });
  const { data: experiences } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => base44.entities.Experience.list('-start_date'),
  });
  const { data: education } = useQuery({
    queryKey: ['education'],
    queryFn: () => base44.entities.Education.list('-end_year'),
  });
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });
  const { data: blogPosts } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
  });
  const { data: messages } = useQuery({
    queryKey: ['messages'],
    queryFn: () => base44.entities.ContactMessage.list('-created_date'),
  });

  const profile = profiles?.[0];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: experiences?.length },
    { id: 'education', label: 'Education', icon: GraduationCap, count: education?.length },
    { id: 'projects', label: 'Projects', icon: Folder, count: projects?.length },
    { id: 'skills', label: 'Skills', icon: BarChart3 },
    { id: 'blog', label: 'Blog', icon: BookOpen, count: blogPosts?.length },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages?.filter(m => !m.read)?.length },
  ];

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b transition-colors ${darkMode ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e0e0e0]'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon" className="hover:bg-[#8B1A1A]/10">
                <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`} />
              </Button>
            </Link>
            <div>
              <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>Portfolio Admin</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-[#666666]'}`}>Manage your portfolio content</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className={`${darkMode ? 'text-yellow-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Link to={createPageUrl('Home')}>
              <Button variant="outline" className={darkMode ? 'border-[#333] text-white hover:bg-white/10' : 'border-[#e0e0e0]'}>View Portfolio</Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`p-1.5 rounded-xl border mb-8 flex-wrap h-auto gap-1 transition-colors ${darkMode ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e0e0e0]'}`}>
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`flex items-center gap-2 rounded-lg data-[state=active]:bg-[#8B1A1A] data-[state=active]:text-white ${darkMode ? 'text-gray-400 hover:text-white' : 'text-[#666666] hover:text-[#1a1a1a]'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile">
            <ProfileEditor profile={profile} />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceEditor experiences={experiences || []} />
          </TabsContent>

          <TabsContent value="education">
            <EducationEditor education={education || []} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsEditor projects={projects || []} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsEditor />
          </TabsContent>

          <TabsContent value="blog">
            <BlogEditor posts={blogPosts || []} />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesViewer messages={messages || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Profile Editor Component
function ProfileEditor({ profile }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(profile || {});
  const [isUploading, setIsUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  React.useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (profile?.id) {
        return base44.entities.Profile.update(profile.id, data);
      }
      return base44.entities.Profile.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, photo_url: file_url });
    setIsUploading(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, resume_url: file_url });
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
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {formData.photo_url ? (
              <img src={formData.photo_url} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-10 h-10 text-slate-400" />
              </div>
            )}
          </div>
          <div>
            <Label className="cursor-pointer">
              <Button variant="outline" disabled={isUploading} asChild>
                <span>
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload Photo
                </span>
              </Button>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </Label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label>Title / Tagline</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Full Stack Developer"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="San Francisco, CA"
            />
          </div>
          <div>
            <Label>Resume</Label>
            <Label className="cursor-pointer">
              <Button variant="outline" disabled={isUploading} asChild className="w-full">
                <span>
                  {formData.resume_url ? 'Change Resume' : 'Upload Resume'}
                </span>
              </Button>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
            </Label>
          </div>
        </div>

        <div>
          <Label>Bio</Label>
          <Textarea
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell your story..."
            rows={4}
          />
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold mb-4">Social Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {['linkedin', 'github', 'twitter', 'instagram', 'facebook', 'youtube', 'dribbble', 'behance', 'medium'].map(social => (
              <div key={social}>
                <Label className="capitalize">{social}</Label>
                <Input
                  value={formData[social] || ''}
                  onChange={(e) => setFormData({ ...formData, [social]: e.target.value })}
                  placeholder={`https://${social}.com/...`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="font-semibold mb-4">Skills</h3>
          <div className="flex gap-2 mb-4">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill..."
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {(formData.skills || []).map((skill, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <span className="font-medium min-w-24">{skill.name}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => updateSkillLevel(index, e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm text-slate-500 w-12">{skill.level}%</span>
                <Button variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending} className="w-full bg-[#8B1A1A] hover:bg-[#6E1515] text-white">
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
}

// Experience Editor Component
function ExperienceEditor({ experiences }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        return base44.entities.Experience.update(data.id, data);
      }
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
        <h2 className="text-xl font-bold">Work Experience</h2>
        <Button onClick={() => startEdit({})} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Experience
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input value={formData.position || ''} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input type="date" value={formData.end_date || ''} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} disabled={formData.is_current} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={formData.is_current || false} onCheckedChange={(checked) => setFormData({ ...formData, is_current: checked })} />
                    <Label>Current Position</Label>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => { setEditing(null); setFormData({}); }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {experiences.map(exp => (
          <Card key={exp.id}>
            <CardContent className="pt-6 flex justify-between items-start">
              <div>
                <h3 className="font-bold">{exp.position}</h3>
                <p className="text-[#8B1A1A] font-medium">{exp.company}</p>
                <p className="text-sm text-slate-500">{exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => startEdit(exp)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(exp.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Education Editor Component
function EducationEditor({ education }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        return base44.entities.Education.update(data.id, data);
      }
      return base44.entities.Education.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      setEditing(null);
      setFormData({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Education.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['education'] }),
  });

  const startEdit = (edu) => {
    setEditing(edu?.id || 'new');
    setFormData(edu || {});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Education</h2>
        <Button onClick={() => startEdit({})} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Education
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution</Label>
                    <Input value={formData.institution || ''} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input value={formData.degree || ''} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} />
                  </div>
                  <div>
                    <Label>Field of Study</Label>
                    <Input value={formData.field || ''} onChange={(e) => setFormData({ ...formData, field: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Start Year</Label>
                      <Input type="number" value={formData.start_year || ''} onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <Label>End Year</Label>
                      <Input type="number" value={formData.end_year || ''} onChange={(e) => setFormData({ ...formData, end_year: parseInt(e.target.value) })} />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Save
                  </Button>
                  <Button variant="outline" onClick={() => { setEditing(null); setFormData({}); }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-4">
        {education.map(edu => (
          <Card key={edu.id}>
            <CardContent className="pt-6 flex justify-between items-start">
              <div>
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-[#8B1A1A] font-medium">{edu.institution}</p>
                <p className="text-sm text-slate-500">{edu.start_year} - {edu.end_year || 'Present'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => startEdit(edu)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(edu.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Projects Editor Component
function ProjectsEditor({ projects }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [techInput, setTechInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        return base44.entities.Project.update(data.id, data);
      }
      return base44.entities.Project.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditing(null);
      setFormData({});
    },
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

  const startEdit = (proj) => {
    setEditing(proj?.id || 'new');
    setFormData(proj || {});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Projects</h2>
        <Button onClick={() => startEdit({})} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category || 'Web Development'} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                        <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={formData.featured || false} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
                    <Label>Featured Project</Label>
                  </div>
                  <div>
                    <Label>
                      {formData.category === 'Web Development' ? 'Live Preview URL' : 'View Link URL'}
                    </Label>
                    <Input
                      value={formData.live_url || ''}
                      onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                      placeholder={formData.category === 'Web Development' ? 'https://yoursite.com' : 'https://view-link.com'}
                    />
                  </div>
                  {formData.category === 'Web Development' ? (
                    <div>
                      <Label>GitHub URL</Label>
                      <Input
                        value={formData.github_url || ''}
                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  ) : (
                    <div>
                      <Label>Materials / Assets URL</Label>
                      <Input
                        value={formData.material_url || ''}
                        onChange={(e) => setFormData({ ...formData, material_url: e.target.value })}
                        placeholder="https://link-to-materials.com"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label>Image</Label>
                  <div className="flex gap-4 items-center">
                    {formData.image_url && <img src={formData.image_url} alt="" className="w-32 h-20 object-cover rounded" />}
                    <Label className="cursor-pointer">
                      <Button variant="outline" disabled={isUploading} asChild>
                        <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                      </Button>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </Label>
                  </div>
                </div>
                <div>
                  <Label>Technologies</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology..." onKeyPress={(e) => e.key === 'Enter' && addTech()} />
                    <Button onClick={addTech} variant="outline"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.technologies || []).map((tech, i) => (
                      <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => setFormData({ ...formData, technologies: formData.technologies.filter((_, idx) => idx !== i) })}>
                        {tech} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Save
                  </Button>
                  <Button variant="outline" onClick={() => { setEditing(null); setFormData({}); }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(proj => (
          <Card key={proj.id} className="overflow-hidden">
            {proj.image_url && <img src={proj.image_url} alt={proj.title} className="w-full h-32 object-cover" />}
            <CardContent className="pt-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{proj.title}</h3>
                  {proj.featured && <Badge className="bg-[#8B1A1A]/10 text-[#8B1A1A]">Featured</Badge>}
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{proj.description}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(proj)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(proj.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Blog Editor Component
function BlogEditor({ posts }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        return base44.entities.BlogPost.update(data.id, data);
      }
      return base44.entities.BlogPost.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      setEditing(null);
      setFormData({});
    },
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

  const startEdit = (post) => {
    setEditing(post?.id || 'new');
    setFormData(post || { published: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Blog Posts</h2>
        <Button onClick={() => startEdit({})} className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white">
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <Label>Excerpt</Label>
                  <Input value={formData.excerpt || ''} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Brief summary..." />
                </div>
                <div>
                  <Label>Content (Markdown supported)</Label>
                  <Textarea value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} className="font-mono" />
                </div>
                <div>
                  <Label>Cover Image</Label>
                  <div className="flex gap-4 items-center">
                    {formData.cover_image && <img src={formData.cover_image} alt="" className="w-40 h-24 object-cover rounded" />}
                    <Label className="cursor-pointer">
                      <Button variant="outline" disabled={isUploading} asChild>
                        <span>{isUploading ? 'Uploading...' : 'Upload Cover'}</span>
                      </Button>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                    </Label>
                  </div>
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag..." onKeyPress={(e) => e.key === 'Enter' && addTag()} />
                    <Button onClick={addTag} variant="outline"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.tags || []).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, idx) => idx !== i) })}>
                        {tag} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.published ?? true} onCheckedChange={(checked) => setFormData({ ...formData, published: checked })} />
                  <Label>Published</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Save
                  </Button>
                  <Button variant="outline" onClick={() => { setEditing(null); setFormData({}); }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id}>
            <CardContent className="pt-6 flex justify-between items-start">
              <div className="flex gap-4">
                {post.cover_image && <img src={post.cover_image} alt="" className="w-24 h-16 object-cover rounded" />}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{post.title}</h3>
                    {!post.published && <Badge variant="outline">Draft</Badge>}
                  </div>
                  <p className="text-sm text-slate-500">{format(new Date(post.created_date), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => startEdit(post)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(post.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Messages Viewer Component
function MessagesViewer({ messages }) {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState(null);

  const markReadMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setSelectedMessage(null);
    },
  });

  const handleSelect = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markReadMutation.mutate(msg.id);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Contact Messages</h2>
        {messages.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              No messages yet
            </CardContent>
          </Card>
        ) : (
          messages.map(msg => (
            <Card
              key={msg.id}
              className={`cursor-pointer transition-colors ${selectedMessage?.id === msg.id ? 'border-[#8B1A1A]' : ''} ${!msg.read ? 'bg-[#8B1A1A]/10' : ''}`}
              onClick={() => handleSelect(msg)}
            >
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{msg.name}</h3>
                      {!msg.read && <span className="w-2 h-2 bg-[#8B1A1A] rounded-full" />}
                    </div>
                    <p className="text-sm text-slate-500">{msg.email}</p>
                    <p className="text-sm text-slate-600 line-clamp-1 mt-1">{msg.subject || msg.message}</p>
                  </div>
                  <span className="text-xs text-slate-400">{format(new Date(msg.created_date), 'MMM d')}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedMessage && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg">{selectedMessage.name}</h3>
                <a href={`mailto:${selectedMessage.email}`} className="text-[#8B1A1A] hover:underline">{selectedMessage.email}</a>
                <p className="text-sm text-slate-500 mt-1">{format(new Date(selectedMessage.created_date), 'MMMM d, yyyy h:mm a')}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(selectedMessage.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            {selectedMessage.subject && (
              <div className="mb-4">
                <Label>Subject</Label>
                <p className="font-medium">{selectedMessage.subject}</p>
              </div>
            )}
            <div>
              <Label>Message</Label>
              <p className="whitespace-pre-wrap text-slate-700 mt-2">{selectedMessage.message}</p>
            </div>
            <div className="mt-6">
              <Button asChild className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white">
                <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}>
                  Reply via Email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
