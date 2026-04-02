import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, Shield, Fingerprint } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { supabase } from '@/integrations/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Invalid email or password');
      setIsLoading(false);
      return;
    }

    navigate(createPageUrl('Admin'));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0a] to-[#0a0a0a]" />
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-[#8B1A1A]/20 rounded-full blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[#8B1A1A]/15 rounded-full blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B1A1A]/5 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          to={createPageUrl('Home')}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>
      </motion.div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="relative">
          {/* Glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-b from-[#8B1A1A]/30 via-[#8B1A1A]/10 to-transparent rounded-3xl blur-xl" />
          
          <div className="relative bg-[#111111]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#8B1A1A]/30 rounded-2xl blur-xl" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-[#8B1A1A] to-[#6E1515] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8B1A1A]/30">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#111111]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight"
              >
                Welcome Back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/40 text-sm"
              >
                Sign in to access your admin dashboard
              </motion.p>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20 rounded-xl focus:border-[#8B1A1A] focus:ring-[#8B1A1A]/20 focus:ring-2 transition-all"
                    required
                  />
                  <Fingerprint className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15 group-focus-within:text-[#8B1A1A]/50 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20 rounded-xl pr-12 focus:border-[#8B1A1A] focus:ring-[#8B1A1A]/20 focus:ring-2 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#8B1A1A] to-[#A52828] hover:from-[#7A1717] hover:to-[#942424] text-white font-semibold rounded-xl shadow-lg shadow-[#8B1A1A]/25 transition-all hover:shadow-xl hover:shadow-[#8B1A1A]/30 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
              <p className="text-white/25 text-xs flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                Secured admin access only
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
