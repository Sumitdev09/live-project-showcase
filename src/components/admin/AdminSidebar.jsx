import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Briefcase, GraduationCap, Folder, BookOpen, MessageSquare, BarChart3,
  ArrowLeft, LogOut, ChevronLeft, ChevronRight, Home, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User, description: 'Personal info & social links' },
  { id: 'about', label: 'About Me', icon: Settings, description: 'About section content' },
  { id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history' },
  { id: 'education', label: 'Education', icon: GraduationCap, description: 'Academic background' },
  { id: 'projects', label: 'Projects', icon: Folder, description: 'Portfolio projects' },
  { id: 'skills', label: 'Skills', icon: BarChart3, description: 'Skill categories & stats' },
  { id: 'blog', label: 'Blog', icon: BookOpen, description: 'Blog posts' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, description: 'Contact messages' },
];

export default function AdminSidebar({ activeTab, setActiveTab, collapsed, setCollapsed, counts = {}, isMobile = false }) {
  return (
    <motion.aside
      animate={{ width: isMobile ? '100%' : (collapsed ? 72 : 260) }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`${isMobile ? 'relative w-full h-full' : 'fixed left-0 top-0 bottom-0 z-40'} flex flex-col border-r border-[hsl(var(--border))] bg-gradient-to-b from-[#1a0505] via-[#2a0a0a] to-[#1a0505] text-white overflow-hidden`}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B1A1A] to-[#c43333] flex items-center justify-center font-bold text-sm shadow-lg shadow-[#8B1A1A]/30">
              SY
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">Admin Panel</h2>
              <p className="text-[10px] text-white/40">Portfolio Manager</p>
            </div>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-br from-[#8B1A1A] to-[#c43333] flex items-center justify-center font-bold text-sm shadow-lg shadow-[#8B1A1A]/30">
            SY
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const count = counts[item.id];
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#8B1A1A] to-[#a52020] text-white shadow-lg shadow-[#8B1A1A]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`} />
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{item.label}</span>
                    {count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#8B1A1A]/30 text-[#ff9999]'
                      }`}>
                        {count}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-white/30 truncate block">{item.description}</span>
                </motion.div>
              )}
              {collapsed && count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B1A1A] rounded-full text-[9px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <Link to={createPageUrl('Home')}>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <Home className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">View Portfolio</span>}
          </button>
        </Link>
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4 flex-shrink-0" /> : <ChevronLeft className="w-4 h-4 flex-shrink-0" />}
            {!collapsed && <span className="text-sm">Collapse</span>}
          </button>
        )}
      </div>
    </motion.aside>
  );
}
