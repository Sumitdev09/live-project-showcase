import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { format } from 'date-fns';

export default function BlogSection({ posts }) {
  const publishedPosts = posts?.filter(p => p.published) || [];
 
  if (publishedPosts.length === 0) return null;

  return (
    <section id="blog" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative - Luique style */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-dashed border-[#e0e0e0] rounded-full opacity-50" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-16"
        >
          <div className="text-center w-full md:text-left md:w-auto">
            <span className="font-caveat text-2xl text-[#8B1A1A] mb-4 block">Blog</span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a]">
              Latest <span className="text-[#8B1A1A]">Articles</span>
            </h2>
            <div className="w-16 h-1 bg-[#8B1A1A] mx-auto md:mx-0 mt-4" />
          </div>
          <Link
            to={createPageUrl('Blog')}
            className="hidden md:flex items-center gap-2 px-6 py-3 border border-[#8B1A1A] rounded-full text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white font-medium transition-all group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPosts.slice(0, 3).map((post, index) => {
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={createPageUrl(`BlogPost?id=${post.id}`)}>
                  <motion.article
                    whileHover={{ y: -5 }}
                    className="group h-full bg-white rounded-lg overflow-hidden border border-[#e0e0e0] hover:border-[#8B1A1A] transition-all"
                  >
                    {post.cover_image && (
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="inline-flex items-center gap-2 text-[#666666] text-sm mb-4">
                        <Clock className="w-4 h-4" />
                        {format(new Date(post.created_date), 'MMM d, yyyy')}
                      </div>
                     
                      <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3 group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                     
                      {post.excerpt && (
                        <p className="text-[#666666] text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      )}
                     
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="text-xs text-[#666666] bg-[#f9f9f7] px-3 py-1 rounded-full border border-[#e0e0e0]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center md:hidden"
        >
          <Link
            to={createPageUrl('Blog')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white font-medium rounded-full"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
