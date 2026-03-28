import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, CheckCircle, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from '@/api/base44Client';

export default function ContactSection({ profile }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await base44.entities.ContactMessage.create(formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: profile?.email, href: `mailto:${profile?.email}` },
    { icon: Phone, label: 'Phone', value: profile?.phone, href: `tel:${profile?.phone}` },
    { icon: MapPin, label: 'Location', value: profile?.location },
  ].filter(c => c.value);

  return (
    <section id="contact" className="py-32 bg-[#f9f9f7] relative overflow-hidden">
      {/* Decorative elements - Luique style */}
      <div className="absolute top-20 right-20 w-48 h-48 border border-dashed border-[#e0e0e0] rounded-full opacity-50" />
      <div className="absolute bottom-20 left-10 w-32 h-32 border border-dashed border-[#e0e0e0] rounded-full opacity-50" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-caveat text-2xl text-[#8B1A1A] mb-4 block">Get in Touch</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] mb-4">
            Let's <span className="text-[#8B1A1A]">Connect</span>
          </h2>
          <div className="w-16 h-1 bg-[#8B1A1A] mx-auto mb-6" />
          <p className="text-[#666666] max-w-2xl mx-auto">
            Have an exciting project or just want to say hello? I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-lg border border-[#e0e0e0]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-[#8B1A1A] rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">Message Sent!</h3>
                <p className="text-[#666666] mb-6">Thank you for reaching out. I'll get back to you soon.</p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#1a1a1a] text-white rounded-full font-medium"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 border border-[#e0e0e0] space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1a1a1a]">Your Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12 rounded-lg border border-[#e0e0e0] focus:border-[#8B1A1A] text-[#1a1a1a]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1a1a1a]">Your Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 rounded-lg border border-[#e0e0e0] focus:border-[#8B1A1A] text-[#1a1a1a]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1a1a1a]">Subject</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="h-12 rounded-lg border border-[#e0e0e0] focus:border-[#8B1A1A] text-[#1a1a1a]"
                    placeholder="What's this about?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1a1a1a]">Your Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="rounded-lg border border-[#e0e0e0] focus:border-[#8B1A1A] resize-none text-[#1a1a1a]"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white rounded-full h-12 font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
                className="bg-white rounded-lg p-5 border border-[#e0e0e0] flex items-center gap-5 hover:border-[#8B1A1A] transition-all"
              >
                <div className="w-12 h-12 border border-[#e0e0e0] rounded-full flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#1a1a1a]" />
                </div>
                <div>
                  <p className="text-xs text-[#666666] uppercase tracking-wider">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-[#1a1a1a] font-medium hover:text-[#8B1A1A] transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-[#1a1a1a] font-medium">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Social Card - Luique style */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#1a1a1a] rounded-lg p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-3">Follow Me</h3>
              <p className="text-white/60 text-sm mb-6">Stay connected on social media</p>
              <div className="flex flex-wrap gap-3">
                {profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-full text-sm transition-colors">
                    LinkedIn
                  </a>
                )}
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-full text-sm transition-colors">
                    GitHub
                  </a>
                )}
                {profile?.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-full text-sm transition-colors">
                    Twitter
                  </a>
                )}
                {profile?.instagram && (
                  <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-full text-sm transition-colors">
                    Instagram
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
