import React from 'react';
import { CldImage } from 'next-cloudinary';
import { ArrowUpRight, Users } from 'lucide-react';

interface TopicPreviewProps {
  title: string;
  imageUrl: string;
  followers?: number;
  color?: string;
}

const TopicPreview: React.FC<TopicPreviewProps> = ({ 
  title, 
  imageUrl, 
  followers = Math.floor(Math.random() * 10000),
}) => {
  return (
    <div className="group relative cursor-pointer">
      <div className="relative aspect-square w-full overflow-hidden 
      rounded-lg bg-white shadow-xl text-black">
        <div className='overflow-hidden'>
            <CldImage
              src={imageUrl}
              alt={title}
              width="250"
              height="250"
              className="object-cover group-hover:opacity-100 
              group-hover:scale-110 transition-all duration-300"
            />
        </div>
        
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold group-hover:text-primary-100">
              {title}
            </h3>
            <ArrowUpRight 
              className="h-4 w-4 text-gray-400 opacity-0 transition-all duration-300 group-hover:text-white group-hover:opacity-100" 
            />
          </div>
          
          {/* Followers count */}
          <div className="mt-2 flex items-center gap-1 text-xs">
            <Users size={12} />
            <span>{followers.toLocaleString()} followers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TopicsGrid: React.FC = () => {
  const topics: TopicPreviewProps[] = [
    { title: "Technology", imageUrl: "cld-sample", color: "from-blue-600 to-cyan-500" },
    { title: "Business", imageUrl: "cld-sample-2", color: "from-purple-600 to-pink-500" },
    { title: "Design", imageUrl: "cld-sample-3", color: "from-orange-600 to-yellow-500" },
    { title: "Marketing", imageUrl: "cld-sample-4", color: "from-green-600 to-emerald-500" },
    { title: "Development", imageUrl: "cld-sample-5", color: "from-red-600 to-orange-500" }
  ];

  return (
    <div className="px-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {topics.map((topic, index) => (
          <TopicPreview key={index} {...topic} />
        ))}
      </div>
    </div>
  );
};