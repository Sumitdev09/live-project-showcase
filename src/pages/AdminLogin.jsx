import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from "@/utils";

// Admin credentials - Change these to your preferred credentials
const ADMIN_ID = "SuperAdmin@2026";
const ADMIN_PASSWORD = "X#9kLm!Qr$7vZp";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for UX
    setTimeout(() => {
      if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
        // Store auth in sessionStorage
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminAuthTime', Date.now().toString());
        navigate(createPageUrl('Admin'));
      } else {
        setError('Invalid Admin ID or Password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f7] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          to={createPageUrl('Home')}
          className="inline-flex items-center gap-2 text-[#666666] hover:text-[#1a1a1a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        <Card className="border-[#e0e0e0]">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold text-[#1a1a1a]">Admin Login</CardTitle>
            <p className="text-[#666666] text-sm mt-2">Enter your credentials to access the admin panel</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="adminId" className="text-[#1a1a1a]">Admin ID</Label>
                <Input
                  id="adminId"
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter your admin ID"
                  className="mt-1 border-[#e0e0e0] focus:border-[#8b5cf6]"
                  required
                />
              </div>
             
              <div>
                <Label htmlFor="password" className="text-[#1a1a1a]">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="border-[#e0e0e0] focus:border-[#8b5cf6] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#1a1a1a]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[#999999] text-xs mt-6">
          Secure admin access only
        </p>
      </motion.div>
    </div>
  );
}