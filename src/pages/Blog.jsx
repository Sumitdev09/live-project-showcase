import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { format } from 'date-fns';
import { BookOpen, Clock, Search, ArrowLeft, Tag } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
  });

  const publishedPosts = posts?.filter(p => p.published) || [];
  const allTags = [...new Set(publishedPosts.flatMap(p => p.tags || []))];

  const filteredPosts = publishedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#f9f9f7]">
      {/* Header */}
      <div className="bg-[#1a1a1a] text-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            to={createPageUrl('Home')}
            className="inline-flex items-center gap-2 text-[#999999] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-[#8B1A1A]" />
              <span className="text-[#8B1A1A] font-medium tracking-widest uppercase text-sm">Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Articles & Insights
            </h1>
            <p className="text-[#999999] text-lg max-w-2xl">
              Thoughts, tutorials, and insights on development, design, and technology.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-[#e0e0e0]"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-[#e0e0e0]"
              />
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedTag
                    ? 'bg-[#8B1A1A] text-white'
                    : 'bg-[#f9f9f7] text-[#666666] border border-[#e0e0e0] hover:border-[#8B1A1A] hover:text-[#8B1A1A]'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-[#8B1A1A] text-white'
                      : 'bg-[#f9f9f7] text-[#666666] border border-[#e0e0e0] hover:border-[#8B1A1A] hover:text-[#8B1A1A]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#e0e0e0]">
                <Skeleton className="aspect-video" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-[#e0e0e0] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#666666] mb-2">No articles found</h3>
            <p className="text-[#999999]">Try adjusting your search or filter</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 pb-16">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={createPageUrl(`BlogPost?id=${post.id}`)}>
                  <article className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e0e0e0] hover:border-[#8B1A1A] hover:shadow-lg transition-all duration-300">
                    {post.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-[#999999] mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(post.created_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-[#1a1a1a] mb-2 group-hover:text-[#8B1A1A] transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-[#666666] line-clamp-2 mb-4">{post.excerpt}</p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-xs text-[#8B1A1A] bg-[#f9f0f0] border border-[#e8d0d0] px-3 py-1 rounded-full"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}