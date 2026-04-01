import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Save, Loader2, CheckCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

// Admin components
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProfileEditor from '@/components/admin/ProfileEditor';
import ExperienceEditor from '@/components/admin/ExperienceEditor';
import EducationEditor from '@/components/admin/EducationEditor';
import ProjectsEditor from '@/components/admin/ProjectsEditor';
import SkillsEditor from '@/components/admin/SkillsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import MessagesViewer from '@/components/admin/MessagesViewer';

export default function Admin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate(createPageUrl('AdminLogin'));
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') navigate(createPageUrl('AdminLogin'));
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(createPageUrl('Home'));
  };

  // Queries
  const { data: profiles } = useQuery({ queryKey: ['profile'], queryFn: () => base44.entities.Profile.list() });
  const { data: experiences } = useQuery({ queryKey: ['experiences'], queryFn: () => base44.entities.Experience.list('-start_date') });
  const { data: education } = useQuery({ queryKey: ['education'], queryFn: () => base44.entities.Education.list('-end_year') });
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: () => base44.entities.Project.list() });
  const { data: blogPosts } = useQuery({ queryKey: ['blogPosts'], queryFn: () => base44.entities.BlogPost.list('-created_date') });
  const { data: messages } = useQuery({ queryKey: ['messages'], queryFn: () => base44.entities.ContactMessage.list('-created_date') });

  const profile = profiles?.[0];
  const unreadMessages = messages?.filter(m => !m.read)?.length || 0;

  const counts = {
    experience: experiences?.length || 0,
    education: education?.length || 0,
    projects: projects?.length || 0,
    blog: blogPosts?.length || 0,
    messages: unreadMessages,
  };

  const SECTION_TITLES = {
    profile: { title: 'Profile', subtitle: 'Manage your personal information' },
    experience: { title: 'Experience', subtitle: 'Your professional journey' },
    education: { title: 'Education', subtitle: 'Academic background & qualifications' },
    projects: { title: 'Projects', subtitle: 'Showcase your portfolio work' },
    skills: { title: 'Skills', subtitle: 'Technical expertise & stats' },
    blog: { title: 'Blog', subtitle: 'Articles & blog posts' },
    messages: { title: 'Messages', subtitle: `${unreadMessages} unread message${unreadMessages !== 1 ? 's' : ''}` },
  };

  const currentSection = SECTION_TITLES[activeTab];

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        counts={counts}
      />

      {/* Main Content */}
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-[#f8f7f4]/80 backdrop-blur-xl border-b border-[hsl(var(--border))]">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#1a1a1a]">{currentSection.title}</h1>
              <p className="text-sm text-muted-foreground">{currentSection.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              {unreadMessages > 0 && (
                <button
                  onClick={() => setActiveTab('messages')}
                  className="relative p-2 rounded-xl hover:bg-[#8B1A1A]/5 transition-colors"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8B1A1A] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadMessages}
                  </span>
                </button>
              )}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 pb-28 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && <ProfileEditor profile={profile} />}
              {activeTab === 'experience' && <ExperienceEditor experiences={experiences || []} />}
              {activeTab === 'education' && <EducationEditor education={education || []} />}
              {activeTab === 'projects' && <ProjectsEditor projects={projects || []} />}
              {activeTab === 'skills' && <SkillsEditor />}
              {activeTab === 'blog' && <BlogEditor posts={blogPosts || []} />}
              {activeTab === 'messages' && <MessagesViewer messages={messages || []} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sticky Bottom Save */}
        <StickyUpdateButton />
      </motion.div>
    </div>
  );
}

function StickyUpdateButton() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    window.dispatchEvent(new Event('admin-save-all'));
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 1200);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 border-t border-[hsl(var(--border))] bg-white/90 backdrop-blur-xl" style={{ left: 'inherit', width: 'calc(100%)' }}>
      <div className="px-8 py-4 flex items-center justify-between max-w-5xl">
        <p className="text-sm text-muted-foreground">
          {saved ? '✅ All changes saved!' : 'Make changes above, then save.'}
        </p>
        <Button
          onClick={handleSave}
          disabled={saving}
          className={`px-8 h-11 text-sm font-semibold rounded-xl transition-all ${
            saved
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-[#8B1A1A] hover:bg-[#6E1515] text-white shadow-lg shadow-[#8B1A1A]/20'
          }`}
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
          ) : saved ? (
            <><CheckCircle className="w-4 h-4 mr-2" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Update Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}
