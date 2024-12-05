"use client"

import { useState, useEffect, useRef } from 'react'
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react'
import { EventCard } from '../components/HomePageComponents/EventCard'
import { EventType } from '../types/Event'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

type SortOption = 'date-asc' | 'date-desc' | 'capacity-asc' | 'capacity-desc';

interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 9,
    pages: 0
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('date-asc')
  const [showFilters, setShowFilters] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  const [showFinishedEvents, setShowFinishedEvents] = useState(false)
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debouncedCountry, setDebouncedCountry] = useState('')
  const [debouncedCity, setDebouncedCity] = useState('')

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/tags')
        const data = await response.json()
        setTags(data.tags)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }
    fetchTags()
  }, [])

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    }

    if (isTagDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTagDropdownOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setDebouncedCountry(country)
      setDebouncedCity(city)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, country, city])

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          finishedEvents: showFinishedEvents.toString()
        })

        if (debouncedSearch) queryParams.set('search', debouncedSearch)
        if (debouncedCountry) queryParams.set('country', debouncedCountry)
        if (debouncedCity) queryParams.set('city', debouncedCity)
        if (sortBy) {
          const [field, order] = sortBy.split('-');
          queryParams.set('sortField', field);
          queryParams.set('sortOrder', order);
        }
        if (selectedTags.length > 0) {
          queryParams.set('tags', selectedTags.join(','))
        }

        const response = await fetch(`/api/events?${queryParams.toString()}`)
        const data = await response.json()
        
        setEvents(data.events)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [debouncedSearch, debouncedCountry, debouncedCity, sortBy, pagination.page, pagination.limit, selectedTags, showFinishedEvents])

  const handleTagSelect = (tag: string) => {
    setSelectedTags(current => 
      current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag]
    )
  }

  const handleTagRemove = (tag: string) => {
    setSelectedTags(current => current.filter(t => t !== tag))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  if (loading && pagination.page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-8">Events</h1>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="p-6 bg-white rounded-lg shadow-sm space-y-7">
              <div className='flex items-center gap-2'>
                <label htmlFor="event-finished" className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="event-finished"
                    checked={showFinishedEvents}
                    onChange={(e) => setShowFinishedEvents(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Show finished events</span>
                </label>
              </div>

              <div className='space-y-2'>
                <h2 className='font-medium'>
                  Location:
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Sort by:</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="date-asc">Date (Earliest first)</option>
                    <option value="date-desc">Date (Latest first)</option>
                    <option value="capacity-asc">Capacity (Low to High)</option>
                    <option value="capacity-desc">Capacity (High to Low)</option>
                  </select>
                </div>
  
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Filter by tags:</h3>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                      className="w-full p-2 border rounded-lg text-left flex justify-between items-center"
                    >
                      <span className="text-gray-600">
                        {selectedTags.length === 0
                          ? "Select tags..."
                          : `${selectedTags.length} tag(s) selected`}
                      </span>
                      {isTagDropdownOpen ? <ArrowUpIcon size={20} /> : <ArrowDownIcon size={20} />}
                    </button>
  
                    {isTagDropdownOpen && (
                      <div className="absolute z-20 w-full mt-1 py-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                        {tags.map(tag => (
                          <label
                            key={tag}
                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag)}
                              onChange={() => handleTagSelect(tag)}
                              className="mr-2"
                            />
                            {tag}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="hover:text-blue-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className='flex flex-col gap-2'>
        {pagination.total > 0 && <p className='text-gray-500'>
          {pagination.total} {pagination.total === 1 ? "event" : "events"} found 
        </p>
        }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event._id} event={event} className='max-h-[15rem]' />
          ))}
        </div>
      </div>
  
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-4 py-2 border rounded-lg ${
                pageNum === pagination.page
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
  
      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found matching your criteria</p>
        </div>
      )}
    </main>
  )
}