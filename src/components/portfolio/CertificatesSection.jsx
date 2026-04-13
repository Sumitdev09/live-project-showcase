import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function CertificatesSection({ certificates }) {
  const [selected, setSelected] = useState(null);

  if (!certificates || certificates.length === 0) return null;

  const featured = certificates.filter(c => c.featured).slice(0, 4);
  const hasMore = certificates.length > 4;

  if (featured.length === 0) return null;

  return (
    <section id="certificates" className="py-20 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B1A1A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#8B1A1A]/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B1A1A]/10 border border-[#8B1A1A]/20 mb-6">
            <Award className="w-4 h-4 text-[#8B1A1A]" />
            <span className="text-sm text-[#8B1A1A] font-medium">Achievements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight">
            Certificates & <span className="text-[#8B1A1A]">Awards</span>
          </h2>
          <p className="mt-4 text-[#666666] max-w-lg mx-auto">
            Recognition and certifications earned through dedication and continuous learning.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              onClick={() => setSelected(cert)}
              className="group cursor-pointer relative bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#8B1A1A]/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-40 sm:h-44 overflow-hidden bg-[#f5f0f0]">
                {cert.image_url ? (
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award className="w-12 h-12 text-[#8B1A1A]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                {cert.issuer && (
                  <p className="text-xs text-[#8B1A1A] font-medium mb-1 truncate">{cert.issuer}</p>
                )}
                <h3 className="font-bold text-[#1a1a1a] text-sm sm:text-base leading-tight line-clamp-2 mb-1">
                  {cert.title}
                </h3>
                {cert.issue_date && (
                  <p className="text-xs text-[#999999]">{cert.issue_date}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10 md:mt-14"
          >
            <Link to={createPageUrl('AllCertificates')}>
              <motion.button
                whileHover={{ scale: 1.03, x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#1a1a1a] text-white rounded-full font-semibold text-sm hover:bg-[#8B1A1A] transition-colors duration-300 shadow-lg"
              >
                View All Certificates
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
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
                  {selected.issuer && (
                    <p className="text-sm text-[#8B1A1A] font-medium mb-1">{selected.issuer}</p>
                  )}
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                    {selected.title}
                  </DialogTitle>
                  {selected.issue_date && (
                    <p className="text-sm text-[#999999] mt-1">{selected.issue_date}</p>
                  )}
                </DialogHeader>
                {selected.description && (
                  <DialogDescription className="mt-4 text-[#555555] leading-relaxed text-base">
                    {selected.description}
                  </DialogDescription>
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
    </section>
  );
}
