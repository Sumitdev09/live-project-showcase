import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Award, ExternalLink, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AllCertificates() {
  const [selected, setSelected] = useState(null);

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => base44.entities.Certificate.list('-created_date'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f7] via-white to-[#faf5f5]">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#e0e0e0]/50 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              to={createPageUrl('Home')}
              className="inline-flex items-center gap-2 text-[#666666] hover:text-[#8B1A1A] transition-all mb-4 md:mb-6 group"
            >
              <motion.div whileHover={{ x: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                <ArrowLeft className="w-4 h-4" />
              </motion.div>
              <span className="text-sm md:text-base font-medium">Back to Home</span>
            </Link>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <motion.h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1a1a1a] mb-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                >
                  All <span className="text-[#8B1A1A]">Certificates</span>
                </motion.h1>
                <motion.p
                  className="text-[#666666] text-base md:text-lg flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="w-4 h-4 text-[#8B1A1A]" />
                  My certifications and achievements
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex items-center gap-2 text-sm text-[#666666] bg-[#f9f0f0] px-5 py-2.5 rounded-full shadow-md"
              >
                <Award className="w-4 h-4 text-[#8B1A1A]" />
                <span className="font-semibold">{certificates.length} Certificate{certificates.length !== 1 ? 's' : ''}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e0e0e0] h-72 animate-pulse">
                <div className="h-44 bg-[#f9f0f0] rounded-t-2xl" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-[#f0e0e0] rounded w-3/4" />
                  <div className="h-3 bg-[#f5f0f0] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-32">
            <Award className="w-16 h-16 mx-auto mb-4 text-[#ccc]" />
            <p className="text-[#666666] text-lg">No certificates yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelected(cert)}
                className="group cursor-pointer bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#8B1A1A]/30 transition-all duration-300"
              >
                <div className="relative h-44 sm:h-48 overflow-hidden bg-[#f5f0f0]">
                  {cert.image_url ? (
                    <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-12 h-12 text-[#8B1A1A]/30" />
                    </div>
                  )}
                  {cert.featured && (
                    <div className="absolute top-3 right-3 bg-[#8B1A1A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  {cert.issuer && <p className="text-xs text-[#8B1A1A] font-medium mb-1">{cert.issuer}</p>}
                  <h3 className="font-bold text-[#1a1a1a] text-sm sm:text-base leading-tight line-clamp-2 mb-1">{cert.title}</h3>
                  {cert.issue_date && <p className="text-xs text-[#999999]">{cert.issue_date}</p>}
                  {cert.description && <p className="text-xs text-[#777] mt-2 line-clamp-2">{cert.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg sm:max-w-2xl bg-white rounded-2xl border-none p-0 overflow-hidden">
          {selected && (
            <>
              {selected.image_url && (
                <div className="w-full h-48 sm:h-64 overflow-hidden bg-[#f5f0f0]">
                  <img src={selected.image_url} alt={selected.title} className="w-full h-full object-contain bg-white" />
                </div>
              )}
              <div className="p-6 sm:p-8">
                <DialogHeader>
                  {selected.issuer && <p className="text-sm text-[#8B1A1A] font-medium mb-1">{selected.issuer}</p>}
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">{selected.title}</DialogTitle>
                  {selected.issue_date && <p className="text-sm text-[#999999] mt-1">{selected.issue_date}</p>}
                </DialogHeader>
                {selected.description && (
                  <DialogDescription className="mt-4 text-[#555555] leading-relaxed text-base">{selected.description}</DialogDescription>
                )}
                {selected.credential_url && (
                  <a
                    href={selected.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#8B1A1A] text-white rounded-xl font-medium text-sm hover:bg-[#6E1515] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Credential
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
