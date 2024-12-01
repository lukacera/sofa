"use client"

import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import { Clock, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import Link from 'next/link'

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  capacity: number
  tags: string[]
  status: 'draft' | 'published'
  aiAnalysis: string
  image: string
  price: number
}

type SortOption = 'date-asc' | 'date-desc' | 'capacity-asc' | 'capacity-desc'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('date-asc')
  const [showFilters, setShowFilters] = useState(false)
  const [locationFilter, setLocationFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [isFreeOnly, setIsFreeOnly] = useState(false)

  // Get unique tags and locations from all events
  const allTags = Array.from(new Set(events.flatMap(event => event.tags || [])))
  const allLocations = Array.from(new Set(events.map(event => event.location)))

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events')
        const data = await response.json()
        setEvents(data.events)
        setFilteredEvents(data.events)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    let filtered = [...events]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(event =>
        selectedTags.every(tag => event.tags?.includes(tag))
      )
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Apply price filters
    if (isFreeOnly) {
      filtered = filtered.filter(event => event.price === 0)
    } else {
      if (minPrice !== '') {
        filtered = filtered.filter(event => event.price >= Number(minPrice))
      }
      if (maxPrice !== '') {
        filtered = filtered.filter(event => event.price <= Number(maxPrice))
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'capacity-asc':
          return a.capacity - b.capacity
        case 'capacity-desc':
          return b.capacity - a.capacity
        default:
          return 0
      }
    })

    setFilteredEvents(filtered)
  }, [events, searchQuery, selectedTags, sortBy, locationFilter, minPrice, maxPrice, isFreeOnly])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-24 max-w-7xl">
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

            {/* Enhanced Filter Panel */}
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

                <div>
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
                </div>

                <div>
                  <h3 className="font-medium mb-2">Price Range:</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isFreeOnly}
                        onChange={(e) => {
                          setIsFreeOnly(e.target.checked)
                          if (e.target.checked) {
                            setMinPrice('')
                            setMaxPrice('')
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Show only free events</span>
                    </label>

                    {!isFreeOnly && (
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="Min price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            min="0"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            min="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Filter by tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTags(prev =>
                          prev.includes(tag)
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        )}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Link href={`/events/${event._id}`} key={event._id}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  <CldImage
                    src={event.image || "cld-sample-2"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                    {event.title}
                  </h2>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span className="text-sm">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span className="text-sm line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {event.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}