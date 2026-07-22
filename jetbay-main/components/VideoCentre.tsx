'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Flame } from 'lucide-react';
import { 
  FEATURED_VIDEO, 
  NEWEST_VIDEOS, 
  INTERVIEWS_VIDEOS,
  FACILITIES_VIDEOS,
  QUICK_FIRE_VIDEOS,
  EVENT_VIDEOS_1,
  EVENT_VIDEOS_2,
  VideoItem
} from '@/lib/videoData';

const formatViews = (views: number) => {
  return views.toLocaleString();
};

const VideoCard = ({ video, featured = false }: { video: VideoItem, featured?: boolean }) => (
  <div className="flex flex-col group cursor-pointer">
    <div className={`relative w-full rounded-[12px] overflow-hidden mb-3 ${featured ? 'aspect-video' : 'aspect-video'}`}>
      <Image 
        src={video.thumbnail} 
        alt={video.title} 
        fill 
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform">
          <Play size={20} className="text-white ml-1" fill="currentColor" />
        </div>
      </div>
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md">
        {video.duration}
      </div>
    </div>
    <h3 className={`font-bold text-[#0B1F3A] dark:text-white line-clamp-2 mb-1.5 group-hover:text-[#13B2A6] dark:group-hover:text-[#40DACD] transition-colors ${featured ? 'text-[18px]' : 'text-[14px]'}`}>
      {video.title}
    </h3>
    <p className="text-[12px] text-gray-500 dark:text-gray-400">
      {formatViews(video.views)} views &middot; {video.timeAgo}
    </p>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-6 mt-16 first:mt-0">
    <div className="w-[3px] h-6 bg-[#D4A64A]"></div>
    <h2 className="text-[22px] md:text-[26px] font-bold text-[#0B1F3A] dark:text-white">
      {title}
    </h2>
  </div>
);

export const VideoCentre = () => {

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12 font-sans">
      
      {/* Featured Section */}
      <SectionTitle title="Featured" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* Left: Main Featured Video */}
        <div className="lg:col-span-8">
          <div className="relative group cursor-pointer">
            <div className="relative w-full aspect-video rounded-[16px] overflow-hidden mb-4 shadow-sm">
              <Image 
                src={FEATURED_VIDEO.thumbnail} 
                alt={FEATURED_VIDEO.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-xl group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-white ml-1.5" fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-[#3B5998] text-white text-[11px] font-bold px-2 py-1 rounded shadow-md">
                Featured
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[13px] font-bold px-2 py-1 rounded backdrop-blur-md">
                {FEATURED_VIDEO.duration}
              </div>
            </div>
            <h3 className="text-[20px] md:text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-2 group-hover:text-[#13B2A6] dark:group-hover:text-[#40DACD] transition-colors">
              {FEATURED_VIDEO.title}
            </h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">
              {formatViews(FEATURED_VIDEO.views)} views &middot; {FEATURED_VIDEO.timeAgo}
            </p>
          </div>
        </div>

        {/* Right: Newest Videos Panel */}
        <div className="lg:col-span-4 bg-gray-50 dark:bg-[#152033] rounded-[16px] p-5 md:p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#FFEAE6] dark:bg-[#4A1D1D] flex items-center justify-center text-[#E03A2B]">
              <Flame size={18} fill="currentColor" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white">Newest</h3>
          </div>
          
          <div className="flex flex-col gap-5">
            {NEWEST_VIDEOS.map((video) => (
              <div key={video.id} className="flex gap-4 group cursor-pointer">
                <div className="relative w-[140px] shrink-0 aspect-video rounded-[8px] overflow-hidden">
                  <Image 
                    src={video.thumbnail} 
                    alt={video.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                      <Play size={12} className="text-white ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 rounded backdrop-blur-md">
                    {video.duration}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-[13px] font-bold text-[#0B1F3A] dark:text-white line-clamp-2 leading-snug mb-1 group-hover:text-[#13B2A6] dark:group-hover:text-[#40DACD] transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {formatViews(video.views)} views &middot; {video.timeAgo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>

      {/* Interviews Section */}
      <SectionTitle title="Interviews" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 mb-16">
        {INTERVIEWS_VIDEOS.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Facilities Tour Section */}
      <SectionTitle title="Facilities Tour" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 mb-16">
        {FACILITIES_VIDEOS.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Quick-Fire Questions Section */}
      <SectionTitle title="Quick-Fire Questions" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 mb-16">
        {QUICK_FIRE_VIDEOS.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Events / Others Section */}
      <div className="h-[2px] w-4 bg-[#D4A64A] mb-8 mt-12"></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 mb-8">
        {EVENT_VIDEOS_1.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 mb-16">
        {EVENT_VIDEOS_2.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

    </div>
  );
};
