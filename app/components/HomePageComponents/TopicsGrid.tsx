"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopicPreviewProps {
  title: string;
  followers?: number;
}

const TopicPreview: React.FC<TopicPreviewProps> = ({ title, followers = 0 }) => {

  const router = useRouter();
  const sampleImages = ['cld-sample', 'cld-sample-2', 'cld-sample-3', 'cld-sample-4', 'cld-sample-5'];
  const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
  const cloudinaryUrl = `https://res.cloudinary.com/dluypaeie/image/upload/c_fill,g_auto,w_250,h_250/${randomImage}`;
  const handleClick = () => {
    router.push(`/events?tags=${encodeURIComponent(title)}`);
  };
  return ( 
    <div onClick={handleClick} className="group cursor-pointer"> 
      <div className="grid grid-rows-[1fr,auto] h-full rounded-lg bg-white shadow-xl text-black overflow-hidden">
        <div className="relative w-full overflow-hidden">
          <Image
            src={cloudinaryUrl}
            alt={title}
            width={150}
            height={150}
            className="object-cover w-full h-full group-hover:scale-110 transition-all duration-300"
          />
        </div>
        
        <div className="p-4 bg-white border-t">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 group-hover:text-primary-100">
              {title.charAt(0).toUpperCase() + title.slice(1)}
            </h3>
            <ArrowUpRight 
              className="h-4 w-4 text-gray-400 opacity-0 transition-all duration-300 
              group-hover:text-gray-900 group-hover:opacity-100" 
            />
          </div>
          
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
            <Users size={12} />
            <span>{followers.toLocaleString()} followers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TopicsGrid: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        const response = await fetch('/api/tags');
        if (!response.ok) {
          throw new Error('Failed to fetch tags');
        }
        const data = await response.json();
        setTags(data.tags);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching tags');
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="px-4 flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!tags.length) {
    return (
      <div className="px-4 text-center text-gray-500">
        No tags available at the moment.
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {tags.map((tag) => (
          <TopicPreview 
            key={tag} 
            title={tag} 
            followers={Math.floor(Math.random() * 10000)} // Simulated follower count
          />
        ))}
      </div>
    </div>
  );
};