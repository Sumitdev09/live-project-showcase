import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, ArrowRight, X, Calendar, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

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

      {/* Premium Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelected(null)}
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top: Certificate Image with gradient overlay */}
              <div className="relative">
                {selected.image_url ? (
                  <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden bg-[#0a0a0a]">
                    <img
                      src={selected.image_url}
                      alt={selected.title}
                      className="w-full h-full object-contain"
                    />
                    {/* Gradient overlay at bottom for smooth transition */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-[#8B1A1A] to-[#4a0e0e] flex items-center justify-center">
                    <Award className="w-16 h-16 text-white/30" />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
                  </div>
                )}

                {/* Floating Award Badge */}
                <div className="absolute -bottom-6 left-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B1A1A] to-[#c0392b] shadow-lg shadow-[#8B1A1A]/30 flex items-center justify-center border-4 border-[#0f0f0f]">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Bottom: Content area with dark theme */}
              <div className="bg-[#0f0f0f] px-6 sm:px-8 pt-10 pb-8">
                {/* Issuer & Date Row */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {selected.issuer && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#8B1A1A]" />
                      <span className="text-sm font-semibold text-[#8B1A1A]">{selected.issuer}</span>
                    </div>
                  )}
                  {selected.issue_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white/50">{selected.issue_date}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
                  {selected.title}
                </h3>

                {/* Decorative line */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-[2px] w-12 bg-gradient-to-r from-[#8B1A1A] to-transparent rounded-full" />
                  <div className="h-[2px] w-6 bg-[#8B1A1A]/40 rounded-full" />
                  <div className="h-[2px] w-3 bg-[#8B1A1A]/20 rounded-full" />
                </div>

                {/* Description */}
                {selected.description && (
                  <p className="text-white/60 leading-relaxed text-base mb-6">
                    {selected.description}
                  </p>
                )}

                {/* CTA Button */}
                {selected.credential_url && (
                  <motion.a
                    href={selected.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#8B1A1A] to-[#a52828] text-white rounded-xl font-semibold text-sm shadow-lg shadow-[#8B1A1A]/25 hover:shadow-[#8B1A1A]/40 transition-shadow duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Credential
                  </motion.a>
                )}
              </div>

              {/* Subtle corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#8B1A1A]/20 rounded-tl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#8B1A1A]/20 rounded-br-3xl pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
