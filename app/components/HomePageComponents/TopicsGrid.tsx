"use client"
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TagData, TagsResponse } from '@/app/types/Tags';

const TopicPreview: React.FC<{tag: TagData}> = ({ tag }) => {
  const router = useRouter();
  
  return ( 
    <button 
    onClick={() => window.location.href = `/events?tag=${encodeURIComponent(tag.name)}`}      
    className="group w-full text-left focus:outline-none focus:ring-2 
      focus:ring-primary-100 focus:ring-offset-2 rounded-xl"
    > 
      <div className="p-5 bg-white rounded-xl border border-gray-100 
        shadow-sm hover:shadow-md transition-all duration-300
        transform hover:-translate-y-1">
        <div className="flex flex-col gap-4">
          {/* Header section with title and arrow */}
          <div className="flex items-center gap-2">
            {/* Added truncate class and max-width to title container */}
            <h3 className="font-semibold text-gray-900 truncate max-w-[80%]" 
                title={tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}>
              {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
            </h3>
            {/* Arrow is now flex-shrink-0 to prevent it from being squeezed */}
            <ArrowUpRight 
              className="w-4 h-4 text-gray-400 transition-all duration-300 
              group-hover:text-primary-100 group-hover:transform 
              group-hover:translate-x-0.5 group-hover:-translate-y-0.5
              flex-shrink-0 ml-auto" 
            />
          </div>
          
          {/* Stats section remains unchanged */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-100" />
              <span className="text-sm text-gray-600">
                {tag.totalAttendees.toLocaleString()} attendees
              </span>
            </div>
            <span className="inline-block px-3 py-1 text-xs font-medium 
              bg-primary-100/10 text-primary-100 rounded-full">
              {tag.eventCount} {tag.eventCount === 1 ? 'event' : 'events'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export const TopicsGrid: React.FC = () => {
  const [tagsData, setTagsData] = useState<TagsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const tagsPerPage = 5;
  const totalPages = tagsData ? Math.ceil(tagsData.tags.length / tagsPerPage) : 0;

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentTags = () => {
    if (!tagsData) return [];
    const start = currentPage * tagsPerPage;
    return tagsData.tags.slice(start, start + tagsPerPage);
  };

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        const response = await fetch('/api/tags');
        if (!response.ok) {
          throw new Error('Failed to fetch tags');
        }
        const data: TagsResponse = await response.json();
        setTagsData(data);
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

  if (!tagsData || !tagsData.tags.length) {
    return (
      <div className="px-4 text-center text-gray-500">
        No tags available at the moment.
      </div>
    );
  }

  return (
    <div className="relative w-full px-16">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {getCurrentTags().map((tag) => (
          <TopicPreview 
            key={tag.name} 
            tag={tag}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full 
                     bg-white shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Previous tags"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full 
                     bg-white shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Next tags"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentPage === index ? 'bg-accent w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};