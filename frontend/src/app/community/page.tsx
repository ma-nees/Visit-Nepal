'use client';

import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  BadgeCheck,
  MapPin,
  Send,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CommunityPage() {
  const { posts, addPost, toggleLike, addComment } = useApp();
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    addPost(newContent, newLocation || 'Kathmandu Valley, Nepal');
    setNewContent('');
    setNewLocation('');
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;
    addComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Header Banner: Compact, clean */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#031526] via-[#063360] to-[#031526] p-6 sm:p-8 text-white border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#92C4EA]">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Trekkers &amp; IFMGA Guides Dispatch 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Live From the Himalayan Trails
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Unfiltered trail updates, weather observations, pass clearance reports, and authentic photo stories straight from high camps and tea houses.
          </p>
        </div>
      </div>

      {/* Create Post */}
      <form
        onSubmit={handlePublish}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <PlusCircle className="h-4 w-4 text-[#0552A2]" />
          <span>Share a Trail Update</span>
        </div>
        <textarea
          rows={2}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="What's happening on the trail today?"
          className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Location (e.g. Namche Bazaar, 3,440m)"
              className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#0552A2] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#044182] active:scale-[0.98] transition-all"
          >
            Publish Story
          </button>
        </div>
      </form>

      {/* Posts Feed */}
      <div className="animate-subtle-fade-up space-y-5">
        {posts.map((post) => (
          <article
            key={post.id}
            className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs"
          >
            <div className="flex items-center gap-2.5 p-4">
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                loading="lazy"
                decoding="async"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1">
                  <h2 className="text-xs font-bold text-slate-900">
                    {post.authorName}
                  </h2>
                  {post.verified && (
                    <BadgeCheck className="h-3.5 w-3.5 text-[#0552A2]" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500">
                  {post.authorLocation} • {post.timeAgo}
                </p>
              </div>
            </div>

            <p className="px-4 pb-3 text-xs leading-relaxed text-slate-700">
              {post.content}
            </p>

            <div className="overflow-hidden bg-slate-950">
              <img
                src={post.mediaUrl}
                alt={post.authorLocation}
                loading="lazy"
                decoding="async"
                className="max-h-80 w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-2.5 text-xs font-semibold">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`inline-flex items-center gap-1 active:scale-90 transition-all ${post.userReaction
                    ? 'text-[#EC1F27]'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${post.userReaction ? 'fill-[#EC1F27]' : ''
                      }`}
                  />
                  <span>{post.likesCount} Likes</span>
                </button>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{post.commentsCount} Comments</span>
                </span>
              </div>

              {/* Comments */}
              {post.comments.length > 0 && (
                <div className="space-y-2">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex gap-2 text-xs">
                      <img
                        src={c.avatar}
                        alt={c.author}
                        loading="lazy"
                        decoding="async"
                        className="h-6 w-6 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 rounded-lg bg-slate-50 px-2.5 py-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-[11px]">
                            {c.author}
                          </span>
                          <span className="text-slate-400 text-[10px]">{c.timeAgo}</span>
                        </div>
                        <p className="mt-0.5 text-slate-700 text-xs">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <form
                onSubmit={(e) => handleCommentSubmit(post.id, e)}
                className="flex gap-1.5 pt-1"
              >
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  placeholder="Write a comment..."
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 active:scale-[0.96] transition-all"
                >
                  <Send className="h-3 w-3" />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
