import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Save, Loader2, CheckCircle, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { createPageUrl } from "@/utils";

// Admin components
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProfileEditor from '@/components/admin/ProfileEditor';
import AboutEditor from '@/components/admin/AboutEditor';
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) setMobileSheetOpen(false);
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
    about: { title: 'About Me', subtitle: 'Edit your about section content' },
    experience: { title: 'Experience', subtitle: 'Your professional journey' },
    education: { title: 'Education', subtitle: 'Academic background & qualifications' },
    projects: { title: 'Projects', subtitle: 'Showcase your portfolio work' },
    skills: { title: 'Skills', subtitle: 'Technical expertise & stats' },
    blog: { title: 'Blog', subtitle: 'Articles & blog posts' },
    messages: { title: 'Messages', subtitle: `${unreadMessages} unread message${unreadMessages !== 1 ? 's' : ''}` },
  };

  const currentSection = SECTION_TITLES[activeTab];

  const sidebarContent = (
    <AdminSidebar
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      collapsed={isMobile ? false : sidebarCollapsed}
      setCollapsed={setSidebarCollapsed}
      counts={counts}
      isMobile={isMobile}
    />
  );

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Desktop Sidebar */}
      {!isMobile && sidebarContent}

      {/* Mobile Sheet Sidebar */}
      {isMobile && (
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetContent side="left" className="p-0 w-[280px] bg-transparent border-none">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <motion.div
        animate={{ marginLeft: isMobile ? 0 : (sidebarCollapsed ? 72 : 260) }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-[#f8f7f4]/80 backdrop-blur-xl border-b border-[hsl(var(--border))]">
          <div className="px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileSheetOpen(true)}
                  className="rounded-xl"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              <div>
                <h1 className="text-lg md:text-xl font-bold text-[#1a1a1a]">{currentSection.title}</h1>
                <p className="text-xs md:text-sm text-muted-foreground">{currentSection.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              {unreadMessages > 0 && (
                <button
                  onClick={() => handleTabChange('messages')}
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
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 pb-28 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && <ProfileEditor profile={profile} />}
              {activeTab === 'about' && <AboutEditor profile={profile} />}
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient border top */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#8B1A1A] to-transparent" />
      
      <div className="bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-[hsl(var(--border))]">
        <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 max-w-5xl mx-auto">
          {/* Status text */}
          <div className="hidden sm:flex items-center gap-2 min-w-0">
            {saved ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 text-green-600"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">All changes saved!</span>
              </motion.div>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Make changes above, then save.
              </p>
            )}
          </div>

          {/* Save button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto"
          >
            <Button
              onClick={handleSave}
              disabled={saving}
              className={`w-full sm:w-auto px-5 sm:px-8 h-11 sm:h-12 text-sm font-bold rounded-xl transition-all duration-300 ${
                saved
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
                  : 'bg-gradient-to-r from-[#8B1A1A] to-[#a52020] hover:from-[#6E1515] hover:to-[#8B1A1A] text-white shadow-lg shadow-[#8B1A1A]/30 hover:shadow-xl hover:shadow-[#8B1A1A]/40'
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : saved ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved!</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Update Changes</span>
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
