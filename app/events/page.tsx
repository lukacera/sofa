"use client"

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { EventCard } from '../components/HomePageComponents/EventCard'
import { EventType } from '../types/Event'

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
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('date-asc')
  const [showFilters, setShowFilters] = useState(false)
  
  // Cache states for filter debouncing
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch events with filters
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString()
        })

        // Add filters to query params
        if (debouncedSearch) queryParams.set('search', debouncedSearch)
        if (sortBy) {
          const [field, order] = sortBy.split('-');
          queryParams.set('sortField', field);
          queryParams.set('sortOrder', order);
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
  }, [debouncedSearch, sortBy, pagination.page, pagination.limit])

  // Pagination controls
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
        
        {/* Search and Filter Controls */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Filter Panel */}
          {showFilters && (
            <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
              <div>
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

              {/* <div>
                <h3 className="font-medium mb-2">Location:</h3>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All locations</option>
                  {allLocations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Other filters remain the same */}
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
        {events.map((event) => (
          <EventCard key={event._id} event={event} className='max-h-[15rem]' />
        ))}
      </div>

      {/* Pagination Controls */}
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

      {/* No Results Message */}
      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found matching your criteria</p>
        </div>
      )}
    </main>
  )
}