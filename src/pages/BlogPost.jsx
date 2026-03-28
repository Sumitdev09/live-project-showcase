import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, Clock, User, Tag, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', postId],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.filter({ id: postId });
      return posts[0];
    },
    enabled: !!postId,
  });

  const { data: profiles } = useQuery({
    queryKey: ['profile'],
    queryFn: () => base44.entities.Profile.list(),
  });

  const profile = profiles?.[0];

  const shareUrl = window.location.href;
  const shareTitle = post?.title || '';

  const socialLinks = [
    { icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, label: 'Twitter' },
    { icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, label: 'LinkedIn' },
    { icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, label: 'Facebook' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="aspect-video w-full rounded-2xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Post not found</h1>
          <Link to={createPageUrl('Blog')}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back link */}
          <Link
            to={createPageUrl('Blog')}
            className="inline-flex items-center gap-2 text-[#666666] hover:text-[#8B1A1A] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-sm text-[#8B1A1A] bg-[#f9f0f0] border border-[#e8d0d0] px-4 py-1 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-[#666666] mb-8">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {format(new Date(post.created_date), 'MMMM d, yyyy')}
            </span>
            {profile && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {profile.full_name}
              </span>
            )}
          </div>

          {post.cover_image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full rounded-3xl shadow-xl shadow-[#e0e0e0]"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#1a1a1a]
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-[#666666] prose-p:leading-relaxed
              prose-a:text-[#8B1A1A] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-[#8B1A1A] prose-blockquote:bg-[#f9f0f0] prose-blockquote:py-1 prose-blockquote:rounded-r-lg
              prose-code:bg-[#f9f9f7] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:hidden prose-code:after:hidden
              prose-pre:bg-[#1a1a1a] prose-pre:text-white
              prose-img:rounded-2xl prose-img:shadow-lg"
          >
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </motion.div>

          {/* Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-8 border-t border-[#e0e0e0]"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 text-[#666666]">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share this article</span>
              </div>
              <div className="flex gap-3">
                {socialLinks.map(social => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#f9f9f7] border border-[#e0e0e0] flex items-center justify-center text-[#666666] hover:bg-[#8B1A1A] hover:text-white hover:border-[#8B1A1A] transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Author */}
          {profile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 p-8 bg-[#f9f9f7] border border-[#e0e0e0] rounded-3xl"
            >
              <div className="flex items-center gap-6">
                {profile.photo_url && (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#e0e0e0]"
                  />
                )}
                <div>
                  <p className="text-sm text-[#8B1A1A] font-medium mb-1">Written by</p>
                  <h3 className="text-xl font-bold text-[#1a1a1a]">{profile.full_name}</h3>
                  {profile.title && <p className="text-[#666666]">{profile.title}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </article>
    </div>
  );
}