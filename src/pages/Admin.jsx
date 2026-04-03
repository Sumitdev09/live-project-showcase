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
  const isMobile = useIsMobile();

  const handleSave = () => {
    setSaving(true);
    window.dispatchEvent(new Event('admin-save-all'));
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/20">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-2xl p-[1.5px] bg-gradient-to-r from-[#8B1A1A] via-[#c0392b] to-[#8B1A1A] animate-[spin_6s_linear_infinite]" style={{ backgroundSize: '200% 200%', animation: 'gradientShift 4s ease infinite' }} />
          
          <div className="relative bg-[#1a1a1a] rounded-2xl px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3 sm:gap-5">
            {/* Status indicator */}
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="saved"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-2 sm:gap-3 min-w-0"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p className="text-sm font-semibold text-emerald-400 truncate">Changes saved!</p>
                    <p className="text-[10px] text-white/40 truncate">All updates applied successfully</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-2 sm:gap-3 min-w-0"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#8B1A1A]/20 flex items-center justify-center flex-shrink-0">
                    <Save className="w-4 h-4 sm:w-5 sm:h-5 text-[#c0392b]" />
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p className="text-sm font-semibold text-white/90 truncate">Unsaved changes</p>
                    <p className="text-[10px] text-white/40 truncate">Click to save your updates</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save button */}
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`ml-auto relative overflow-hidden px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-white transition-all duration-300 disabled:opacity-70 ${
                saved
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-[#8B1A1A] to-[#c0392b] shadow-lg shadow-[#8B1A1A]/40 hover:shadow-xl hover:shadow-[#8B1A1A]/50'
              }`}
            >
              {/* Shine effect */}
              {!saving && !saved && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update</span>
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
