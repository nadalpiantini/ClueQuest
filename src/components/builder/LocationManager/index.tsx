'use client'

import React, { useState, useEffect } from 'react'
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Navigation, 
  Search,
  Edit3,
  Target,
  Globe,
  Compass,
  CheckCircle,
  AlertCircle,
  Map,
  Route,
  ArrowRight,
  ArrowDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GamingButton, GamingCard, GamingInput, GamingBadge } from '@/components/ui/gaming-components'
import { useGeocoding } from '@/hooks/useGeocoding'

interface Location {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  address?: string
  radius: number // meters for geofencing
  order: number
  isRequired: boolean
  routeType?: 'walking' | 'driving' | 'checkpoint'
}

interface LocationManagerProps {
  locations: Location[]
  onLocationsChange: (locations: Location[]) => void
  adventureType: 'linear' | 'parallel' | 'hub'
  maxLocations?: number
  enableGeofencing?: boolean
}

export default function LocationManager({
  locations = [],
  onLocationsChange,
  adventureType,
  maxLocations = 20,
  enableGeofencing = true
}: LocationManagerProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null)
  const [addressLookup, setAddressLookup] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [routeSequence, setRouteSequence] = useState<string[]>([])
  
  const { isLoading: isGeocodingLoading, error: geocodingError, geocodeAddress, searchPlaces, clearError } = useGeocoding()

  // Get user's current position for location assistance
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          // Don't show error to user as this is optional functionality
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    }
  }, [])

  // Update route sequence when locations change
  useEffect(() => {
    const sorted = [...locations].sort((a, b) => a.order - b.order)
    setRouteSequence(sorted.map(l => l.id))
  }, [locations])

  const createNewLocation = (): Location => {
    return {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      latitude: currentPosition?.lat || 40.7128,
      longitude: currentPosition?.lng || -74.0060,
      radius: 50,
      order: locations.length + 1,
      isRequired: true,
      routeType: 'checkpoint'
    }
  }

  const addLocation = () => {
    if (locations.length >= maxLocations) return
    
    const newLocation = createNewLocation()
    setSelectedLocation(newLocation)
    setIsAddingLocation(true)
  }

  const saveLocation = (location: Location) => {
    if (!location.name.trim()) return

    const updatedLocations = selectedLocation?.id === location.id && locations.find(l => l.id === location.id)
      ? locations.map(l => l.id === location.id ? location : l)
      : [...locations, location]

    onLocationsChange(updatedLocations)
    setSelectedLocation(null)
    setIsAddingLocation(false)
  }

  const deleteLocation = (locationId: string) => {
    const updatedLocations = locations
      .filter(l => l.id !== locationId)
      .map((l, index) => ({ ...l, order: index + 1 }))
    
    onLocationsChange(updatedLocations)
    if (selectedLocation?.id === locationId) {
      setSelectedLocation(null)
      setIsAddingLocation(false)
    }
  }

  const editLocation = (location: Location) => {
    setSelectedLocation(location)
    setIsAddingLocation(true)
  }

  const reorderLocation = (locationId: string, newOrder: number) => {
    const location = locations.find(l => l.id === locationId)
    if (!location) return

    const updatedLocations = locations.map(l => {
      if (l.id === locationId) return { ...l, order: newOrder }
      if (l.order >= newOrder && l.id !== locationId) return { ...l, order: l.order + 1 }
      return l
    }).sort((a, b) => a.order - b.order)
    .map((l, index) => ({ ...l, order: index + 1 }))

    onLocationsChange(updatedLocations)
  }

  // Real address to coordinates lookup using Google Maps API
  const lookupAddress = async () => {
    if (!addressLookup.trim() || !selectedLocation) return

    clearError()
    const result = await geocodeAddress(addressLookup)
    
    if (result) {
      setSelectedLocation({
        ...selectedLocation,
        latitude: result.latitude,
        longitude: result.longitude,
        address: result.formattedAddress
      })
      setAddressLookup('')
      setShowSearchResults(false)
    }
  }

  // Search for places as user types
  const handleAddressSearch = async (query: string) => {
    setAddressLookup(query)
    
    if (query.length < 3) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    clearError()
    const results = await searchPlaces(query)
    
    if (results && results.length > 0) {
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  // Select a search result
  const selectSearchResult = (result: any) => {
    if (selectedLocation) {
      setSelectedLocation({
        ...selectedLocation,
        latitude: result.latitude,
        longitude: result.longitude,
        address: result.formattedAddress
      })
      setAddressLookup('')
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAdventureTypeInfo = () => {
    switch(adventureType) {
      case 'linear':
        return {
          title: 'Linear Route Planning',
          description: 'Participants visit locations in strict sequence',
          icon: ArrowRight,
          color: 'amber'
        }
      case 'parallel': 
        return {
          title: 'Multi-Path Locations',
          description: 'Participants can visit locations in any order',
          icon: Target,
          color: 'emerald'
        }
      case 'hub':
        return {
          title: 'Hub & Spoke Design',
          description: 'Central location with branching paths',
          icon: Target,
          color: 'purple'
        }
    }
  }

  const typeInfo = getAdventureTypeInfo()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-amber-200 mb-3 flex items-center justify-center gap-3">
          <MapPin className="h-7 w-7" />
          Location Manager
        </h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Set up physical locations for your adventure. Perfect Google Maps integration for real-world coordinates.
        </p>
      </div>

      {/* Adventure Type Context */}
      <div className={`p-6 rounded-xl border border-${typeInfo.color}-500/30 bg-${typeInfo.color}-500/5`}>
        <h4 className={`text-lg font-bold text-${typeInfo.color}-200 mb-2 flex items-center gap-2`}>
          <typeInfo.icon className="h-5 w-5" />
          {typeInfo.title}
        </h4>
        <p className="text-slate-400 text-sm mb-4">{typeInfo.description}</p>
        
        {adventureType === 'linear' && (
          <div className="flex items-center gap-2 text-sm text-amber-300">
            <Route className="h-4 w-4" />
            Route will be: {locations.length > 0 
              ? locations.sort((a, b) => a.order - b.order).map(l => l.name || `Location ${l.order}`).join(' → ')
              : 'No locations yet'
            }
          </div>
        )}
      </div>

      {/* Search and Add Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <GamingButton
          variant="mystery"
          size="md"
          onClick={addLocation}
          disabled={locations.length >= maxLocations}
          className="w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Add Location ({locations.length}/{maxLocations})
        </GamingButton>
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLocations.sort((a, b) => a.order - b.order).map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <GamingCard className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <GamingBadge variant="gold" size="sm">
                      #{location.order}
                    </GamingBadge>
                    <h4 className="text-lg font-bold text-amber-200">
                      {location.name || 'Unnamed Location'}
                    </h4>
                    {location.routeType && (
                      <GamingBadge 
                        variant={location.routeType === 'driving' ? 'gold' : location.routeType === 'walking' ? 'emerald' : 'purple'}
                        size="sm"
                      >
                        {location.routeType === 'driving' ? '🚗 Car' : location.routeType === 'walking' ? '🚶 Walk' : '📍 Point'}
                      </GamingBadge>
                    )}
                  </div>
                  
                  {location.description && (
                    <p className="text-slate-400 text-sm">
                      {location.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </div>
                    {enableGeofencing && (
                      <div className="flex items-center gap-1">
                        <Compass className="h-3 w-3" />
                        {location.radius}m radius
                      </div>
                    )}
                  </div>

                  {location.address && (
                    <div className="text-xs text-slate-400 flex items-start gap-1">
                      <Navigation className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {location.address}
                    </div>
                  )}
                </div>

                {adventureType === 'linear' && (
                  <div className="flex flex-col gap-1 ml-4">
                    <button
                      onClick={() => location.order > 1 && reorderLocation(location.id, location.order - 1)}
                      disabled={location.order === 1}
                      className="p-1 rounded text-xs hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => location.order < locations.length && reorderLocation(location.id, location.order + 1)}
                      disabled={location.order === locations.length}
                      className="p-1 rounded text-xs hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ⬇️
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                <GamingButton
                  variant="ghost"
                  size="sm"
                  onClick={() => editLocation(location)}
                  className="flex-1"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </GamingButton>
                <GamingButton
                  variant="outline"
                  size="sm"
                  onClick={() => deleteLocation(location.id)}
                  className="flex-1 border-red-500/40 text-red-400 hover:border-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </GamingButton>
              </div>
            </GamingCard>
          </motion.div>
        ))}

        {/* Empty State */}
        {filteredLocations.length === 0 && !isAddingLocation && (
          <div className="col-span-2 text-center py-16">
            <MapPin className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-slate-300 mb-2">
              {searchQuery ? 'No locations found' : 'No locations yet'}
            </h4>
            <p className="text-slate-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Add your first location to get started with your adventure'
              }
            </p>
            {!searchQuery && (
              <GamingButton
                variant="mystery"
                onClick={addLocation}
                disabled={locations.length >= maxLocations}
              >
                <Plus className="h-5 w-5" />
                Add First Location
              </GamingButton>
            )}
          </div>
        )}
      </div>

      {/* Location Editor Modal */}
      <AnimatePresence>
        {isAddingLocation && selectedLocation && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Only close if clicking the backdrop, not the modal content
              if (e.target === e.currentTarget) {
                setIsAddingLocation(false)
                setSelectedLocation(null)
              }
            }}
          >
            <motion.div
              className="bg-slate-900 border border-slate-600 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-amber-200">
                    {locations.find(l => l.id === selectedLocation.id) ? 'Edit Location' : 'Add New Location'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingLocation(false)
                      setSelectedLocation(null)
                    }}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <GamingInput
                    label="Location Name"
                    placeholder="e.g., Reception Desk, Conference Room A, Main Entrance"
                    value={selectedLocation.name}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      name: e.target.value
                    })}
                  />

                  <div>
                    <label className="text-sm font-bold text-amber-300 uppercase tracking-wide mb-2 block">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe what participants should do at this location..."
                      value={selectedLocation.description}
                      onChange={(e) => setSelectedLocation({
                        ...selectedLocation,
                        description: e.target.value
                      })}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 min-h-[100px] resize-none"
                    />
                  </div>

                  {/* Route Type Selection */}
                  <div>
                    <label className="text-sm font-bold text-amber-300 uppercase tracking-wide mb-2 block">
                      Route Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'checkpoint', name: 'Checkpoint', icon: '📍', description: 'Stop and scan point' },
                        { id: 'walking', name: 'Walking', icon: '🚶', description: 'Walking route segment' },
                        { id: 'driving', name: 'Driving', icon: '🚗', description: 'Car route segment' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedLocation({
                            ...selectedLocation,
                            routeType: type.id as 'walking' | 'driving' | 'checkpoint'
                          })}
                          className={`p-3 rounded-lg border transition-all text-center ${
                            selectedLocation.routeType === type.id
                              ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-500/20'
                              : 'border-slate-600 bg-slate-800/40 hover:border-slate-500'
                          }`}
                        >
                          <div className="text-lg mb-1">{type.icon}</div>
                          <div className={`text-sm font-semibold ${
                            selectedLocation.routeType === type.id ? 'text-amber-200' : 'text-slate-200'
                          }`}>
                            {type.name}
                          </div>
                          <div className="text-xs text-slate-400">{type.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Google Maps Address Lookup */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-4">
                  <h4 className="text-lg font-bold text-purple-200 flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    🗺️ Google Maps Address Lookup
                  </h4>
                  
                  <div className="relative">
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Enter street address, landmark, or business name..."
                          value={addressLookup}
                          onChange={(e) => handleAddressSearch(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          onKeyPress={(e) => e.key === 'Enter' && lookupAddress()}
                          onFocus={() => {
                            if (searchResults.length > 0) {
                              setShowSearchResults(true)
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding results to allow clicking on them
                            setTimeout(() => setShowSearchResults(false), 200)
                          }}
                        />
                        
                        {/* Search Results Dropdown */}
                        {showSearchResults && searchResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                            {searchResults.map((result, index) => (
                              <button
                                key={index}
                                onClick={() => selectSearchResult(result)}
                                className="w-full px-4 py-3 text-left hover:bg-slate-700 border-b border-slate-700 last:border-b-0 transition-colors"
                              >
                                <div className="text-slate-200 font-medium text-sm">
                                  {result.formattedAddress}
                                </div>
                                {result.addressComponents && (
                                  <div className="text-slate-400 text-xs mt-1">
                                    {[
                                      result.addressComponents.locality,
                                      result.addressComponents.administrativeAreaLevel1,
                                      result.addressComponents.country
                                    ].filter(Boolean).join(', ')}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <GamingButton
                        variant="outline"
                        size="md"
                        onClick={lookupAddress}
                        isLoading={isGeocodingLoading}
                        disabled={!addressLookup.trim()}
                      >
                        <Target className="h-4 w-4" />
                        Find
                      </GamingButton>
                    </div>
                    
                    {/* Error Display */}
                    {geocodingError && (
                      <div className="mt-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-red-300 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          {geocodingError}
                        </div>
                      </div>
                    )}
                  </div>

                  {currentPosition && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Your location: {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
                      </span>
                      <GamingButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (currentPosition) {
                            setSelectedLocation({
                              ...selectedLocation,
                              latitude: currentPosition.lat,
                              longitude: currentPosition.lng,
                              address: 'Current Location'
                            })
                          }
                        }}
                      >
                        <Navigation className="h-4 w-4" />
                        Use My Location
                      </GamingButton>
                    </div>
                  )}
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-4">
                  <GamingInput
                    label="Latitude"
                    type="number"
                    step="0.000001"
                    value={selectedLocation.latitude}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      latitude: parseFloat(e.target.value) || 0
                    })}
                  />
                  <GamingInput
                    label="Longitude"
                    type="number"
                    step="0.000001"
                    value={selectedLocation.longitude}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      longitude: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>

                {/* Geofencing */}
                {enableGeofencing && (
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-4">
                    <h4 className="text-lg font-bold text-amber-200 flex items-center gap-2">
                      <Compass className="h-5 w-5" />
                      Geofencing Settings
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-amber-300 uppercase tracking-wide mb-2 block">
                          Detection Radius
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="10"
                            max="1000"
                            step="10"
                            value={selectedLocation.radius}
                            onChange={(e) => setSelectedLocation({
                              ...selectedLocation,
                              radius: parseInt(e.target.value) || 50
                            })}
                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                            meters
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-end">
                        <label className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={selectedLocation.isRequired}
                            onChange={(e) => setSelectedLocation({
                              ...selectedLocation,
                              isRequired: e.target.checked
                            })}
                            className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 rounded focus:ring-amber-500 focus:ring-2"
                          />
                          Required checkpoint
                        </label>
                        <p className="text-xs text-slate-500 mt-1">
                          Participants must visit this location
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-lg">
                      <strong>Radius Guide:</strong> Small room (10-20m), Large building (50-100m), Outdoor area (100-500m)
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-700">
                  <GamingButton
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setIsAddingLocation(false)
                      setSelectedLocation(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </GamingButton>
                  <GamingButton
                    variant="mystery"
                    size="md"
                    onClick={() => saveLocation(selectedLocation)}
                    disabled={!selectedLocation.name.trim()}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Save Location
                  </GamingButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      {locations.length > 0 && (
        <div className="p-6 rounded-xl border border-slate-600/50 bg-slate-800/30 space-y-4">
          <h4 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Location Summary
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-400">{locations.length}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Total Locations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {locations.filter(l => l.isRequired).length}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Required</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {locations.filter(l => l.routeType === 'driving').length}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Driving Segments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(locations.reduce((sum, l) => sum + l.radius, 0) / locations.length) || 0}m
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Avg Radius</div>
            </div>
          </div>

          {adventureType === 'linear' && locations.length > 1 && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="text-sm font-bold text-amber-200 mb-2">Linear Route Preview:</div>
              <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                {locations.sort((a, b) => a.order - b.order).map((location, index) => (
                  <React.Fragment key={location.id}>
                    <span className="px-2 py-1 bg-amber-500/20 rounded text-amber-200">
                      {location.name || `Location ${location.order}`}
                    </span>
                    {index < locations.length - 1 && <ArrowRight className="h-3 w-3 text-slate-500" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}