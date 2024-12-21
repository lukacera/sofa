"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { EventCard } from '../components/HomePageComponents/EventCard'
import { EventType } from '../types/Event'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { LocationDropdown } from '../components/EventsPageComponents/LocationDropdown'
// import { useSearchParams } from 'next/navigation'
import { TagData } from '../types/Tags'

type SortOption = 'date-asc' | 'date-desc' | 'capacity-asc' | 'capacity-desc';

interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

function EventsPageContent() {
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 9,
    pages: 0
  })

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('date-asc')
  const [showFilters, setShowFilters] = useState(false)
  const [tags, setTags] = useState<TagData[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  const [showFinishedEvents, setShowFinishedEvents] = useState(true)
  
  // Location filter states
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [countries, setCountries] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])  

  // Debounced states for search optimization
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debouncedCountry, setDebouncedCountry] = useState('')
  const [debouncedCity, setDebouncedCity] = useState('')
  
  // Refs and hooks
  // const searchParams = useSearchParams()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize data and handle URL parameters
  useEffect(() => {
    async function initializeData() {
      try {
        // Fetch all initial data in parallel
        const [tagsRes, countriesRes, citiesRes] = await Promise.all([
          fetch('/api/tags'),
          fetch('/api/countries'),
          fetch('/api/cities')
        ]);

        const [tagsData, countriesData, citiesData] = await Promise.all([
          tagsRes.json(),
          countriesRes.json(),
          citiesRes.json()
        ]);

        setTags(tagsData.tags);
        setCountries(countriesData.countries);
        setCities(citiesData.cities);

        // Handle URL parameters if present
        // const cityFromUrl = searchParams.get('city')
        // const tagFromUrl = searchParams.get('tag')
    
        // if (cityFromUrl) setCity(cityFromUrl)
        // if (tagFromUrl) setSelectedTags([tagFromUrl])
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    }

    initializeData();
  }, []);

  // Handle clicks outside the tag dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false)
      }
    }

    if (isTagDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isTagDropdownOpen])

  // Debounce search and location inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setDebouncedCountry(country)
      setDebouncedCity(city)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, country, city])

  // Fetch events based on filters
  useEffect(() => {
    async function fetchEvents() {
      console.log('Fetching events...')
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          finishedEvents: showFinishedEvents.toString()
        })

        // Add optional filter parameters
        if (debouncedSearch) queryParams.set('search', debouncedSearch)
        if (debouncedCountry) queryParams.set('country', debouncedCountry)
        if (debouncedCity) queryParams.set('city', debouncedCity)
        if (sortBy) {
          const [field, order] = sortBy.split('-')
          queryParams.set('sortField', field)
          queryParams.set('sortOrder', order)
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

  // Handler functions
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

  // Loading state
  // if (loading && pagination.page === 1) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   )
  // }

  return (
    <main className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="mb-5">
        <h1 className="text-4xl font-bold text-center mb-8">Events</h1>
    
        <div className="space-y-4">
          {/* Search and filters section */}
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
          {/* Advanced filters section */}
          {showFilters && (
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Location Column */}
                <div className="space-y-4">
                  <h2 className="font-medium text-gray-900">Location</h2>
                  <div className="space-y-3">
                    <LocationDropdown
                      value={country}
                      onChange={setCountry}
                      options={countries}
                      type="country"
                    />
                    <LocationDropdown
                      value={city}
                      onChange={setCity}
                      options={cities}
                      type="city"
                    />
                  </div>
                </div>
                {/* Filters Column */}
                <div className="space-y-4">
                  <h2 className="font-medium text-gray-900">Filters</h2>
                  {/* Tags dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                      className="w-full p-2.5 border rounded-lg text-left flex justify-between items-center hover:border-gray-400 transition-colors"
                    >
                      <span className="text-gray-600">
                        {selectedTags.length === 0
                          ? "Select tags..."
                          : `${selectedTags.length} tag(s) selected`
                        }
                      </span>
                      {isTagDropdownOpen ? <ArrowUpIcon size={18} /> : <ArrowDownIcon size={18} />}
                    </button>
                    {isTagDropdownOpen && (
                      <div className="absolute z-20 w-full mt-1 py-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                        {tags.map(tag => (
                          <label
                            key={tag.name}
                            className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag.name)}
                              onChange={() => handleTagSelect(tag.name)}
                              className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{tag.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Show finished events toggle */}
                  <label className="flex items-center gap-3 hover:cursor-pointer p-1">
                    <input
                      type="checkbox"
                      checked={showFinishedEvents}
                      onChange={(e) => setShowFinishedEvents(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Show finished events</span>
                  </label>
                </div>
              </div>
            </div>
          )}
    
          {/* Selected tags display */}
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
    
      {/* Results section */}
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <p className='text-gray-500 pt-8'>
            {pagination.total} {pagination.total === 1 ? "event" : "events"} found
          </p>
    
          {/* Sort dropdown */}
          <div className="flex flex-col gap-[2px]">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="p-2 border rounded-lg text-sm bg-white"
            >
              <option value="date-asc">Date (Earliest first)</option>
              <option value="date-desc">Date (Latest first)</option>
              <option value="capacity-asc">Capacity (Low to High)</option>
              <option value="capacity-desc">Capacity (High to Low)</option>
            </select>
          </div>
        </div>
        {/* Events grid */}
        {loading && pagination.page === 1 && (
          <div className="min-h-[15rem] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event._id} event={event} className='max-h-[15rem]' />
          ))}
        </div>
      </div>
      {/* Pagination */}
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
      {/* No results message */}
      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found matching your criteria</p>
        </div>
      )}
    </main>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <EventsPageContent />
    </Suspense>
  );
}