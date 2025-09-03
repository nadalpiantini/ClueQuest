'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  QrCode, Map, List, Navigation, Camera, Users, Trophy, 
  Clock, Star, MapPin, Zap, Compass, Route, Eye, EyeOff 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Scene, QRCode, Participant } from '@/types/adventure'
import Image from 'next/image'

type ViewMode = 'map' | 'list'
type LocationAccess = 'granted' | 'denied' | 'checking' | 'unavailable'

interface QRLocationData extends QRCode {
  scene: {
    id: string
    title: string
    description: string
    location_lat: number
    location_lng: number
    location_name: string
    estimated_duration_minutes: number
    order_index: number
  }
  distance?: number
  isUnlocked: boolean
  isCompleted: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
}

export default function AdventureHubPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionCode = searchParams.get('session')
  const isGuest = searchParams.get('guest') === 'true'

  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [locationAccess, setLocationAccess] = useState<LocationAccess>('checking')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [qrLocations, setQrLocations] = useState<QRLocationData[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [adventure, setAdventure] = useState<any>(null)
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  const [suggestedRoute, setSuggestedRoute] = useState<string[]>([])
  const [showCompleted, setShowCompleted] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  // Load adventure data and locations
  useEffect(() => {
    loadAdventureData()
    requestLocationAccess()
  }, [sessionCode])

  // Calculate distances when user location is available
  useEffect(() => {
    if (userLocation && qrLocations.length > 0) {
      updateDistances()
      generateSuggestedRoute()
    }
  }, [userLocation, qrLocations])

  const loadAdventureData = async () => {
    try {
      // Mock adventure data with QR locations
      const adventureData = {
        id: '1',
        title: 'The Enchanted Forest Quest',
        theme: 'fantasy',
        description: 'Explore magical locations around the venue',
        scenes: [
          {
            id: '1',
            title: 'Entrance Gate',
            description: 'Begin your journey at the mystical entrance',
            location_lat: 40.7589, // Mock coordinates
            location_lng: -73.9851,
            location_name: 'Main Entrance',
            estimated_duration_minutes: 10,
            order_index: 0
          },
          {
            id: '2',
            title: 'Ancient Tree',
            description: 'Discover the wisdom of the ancient oak',
            location_lat: 40.7614,
            location_lng: -73.9776,
            location_name: 'Central Garden',
            estimated_duration_minutes: 15,
            order_index: 1
          },
          {
            id: '3',
            title: 'Crystal Cave',
            description: 'Explore the shimmering crystal formations',
            location_lat: 40.7505,
            location_lng: -73.9934,
            location_name: 'Lower Level',
            estimated_duration_minutes: 20,
            order_index: 2
          },
          {
            id: '4',
            title: 'Dragon\'s Lair',
            description: 'Face the final challenge',
            location_lat: 40.7580,
            location_lng: -73.9855,
            location_name: 'Upper Terrace',
            estimated_duration_minutes: 25,
            order_index: 3
          }
        ]
      }

      setAdventure(adventureData)

      // Generate QR location data
      const qrData: QRLocationData[] = adventureData.scenes.map((scene, index) => ({
        id: `qr-${scene.id}`,
        scene_id: scene.id,
        code: `QR${index + 1}`,
        secure_hash: `hash-${scene.id}`,
        location_description: scene.location_name || 'Unknown location',
        geofence_radius_meters: 50,
        scan_limit: null,
        scan_count: 0,
        is_active: true,
        expires_at: null,
        created_at: new Date().toISOString(),
        scene,
        isUnlocked: index === 0, // First location unlocked by default
        isCompleted: false,
        difficulty: ['easy', 'medium', 'hard', 'medium'][index] as 'easy' | 'medium' | 'hard',
        estimatedTime: scene.estimated_duration_minutes
      }))

      setQrLocations(qrData)

      // Calculate progress
      const completedCount = qrData.filter(loc => loc.isCompleted).length
      setProgress({
        completed: completedCount,
        total: qrData.length,
        percentage: (completedCount / qrData.length) * 100
      })

    } catch (error) {
      console.error('Failed to load adventure data:', error)
    }
  }

  const requestLocationAccess = async () => {
    if (!navigator.geolocation) {
      setLocationAccess('unavailable')
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
      setLocationAccess('granted')

      // Start watching position changes
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => console.warn('Location watch error:', error),
        { enableHighAccuracy: true, maximumAge: 30000 }
      )

      // Cleanup on unmount
      return () => navigator.geolocation.clearWatch(watchId)
    } catch (error) {
      console.warn('Location access denied:', error)
      setLocationAccess('denied')
    }
  }

  const updateDistances = () => {
    if (!userLocation) return

    const updatedLocations = qrLocations.map(location => {
      if (location.scene.location_lat && location.scene.location_lng) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          location.scene.location_lat,
          location.scene.location_lng
        )
        return { ...location, distance }
      }
      return location
    })

    setQrLocations(updatedLocations)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180
    const φ2 = lat2 * Math.PI/180
    const Δφ = (lat2-lat1) * Math.PI/180
    const Δλ = (lng2-lng1) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return Math.round(R * c) // Distance in meters
  }

  const generateSuggestedRoute = () => {
    // AI-suggested optimal route based on location, difficulty, and story progression
    const unlockedLocations = qrLocations.filter(loc => loc.isUnlocked && !loc.isCompleted)
    
    if (userLocation && unlockedLocations.length > 0) {
      // Sort by distance for efficiency
      const sortedByDistance = unlockedLocations
        .filter(loc => loc.distance !== undefined)
        .sort((a, b) => a.distance! - b.distance!)
      
      setSuggestedRoute(sortedByDistance.map(loc => loc.id))
    }
  }

  const handleQRScan = async (qrLocation: QRLocationData) => {
    setIsScanning(true)
    
    try {
      // Navigate to QR scanner with location context
      router.push(`/qr-scan?session=${sessionCode}&location=${qrLocation.id}${isGuest ? '&guest=true' : ''}`)
    } catch (error) {
      console.error('Failed to start QR scan:', error)
    } finally {
      setIsScanning(false)
    }
  }

  const handleNavigate = (qrLocation: QRLocationData) => {
    if (qrLocation.scene.location_lat && qrLocation.scene.location_lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${qrLocation.scene.location_lat},${qrLocation.scene.location_lng}`
      window.open(url, '_blank')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'text-green-600 bg-green-50 border-green-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      hard: 'text-red-600 bg-red-50 border-red-200'
    }
    return colors[difficulty as keyof typeof colors] || colors.medium
  }

  const getDistanceText = (distance?: number) => {
    if (!distance) return 'Distance unknown'
    if (distance < 1000) return `${distance}m away`
    return `${(distance / 1000).toFixed(1)}km away`
  }

  const filteredLocations = qrLocations.filter(loc => 
    showCompleted || !loc.isCompleted
  )

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <div className="pt-safe px-4 py-4 bg-card border-b sticky top-0 z-50 backdrop-blur-sm bg-card/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg center-flex">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">{adventure?.title}</h1>
              <p className="text-sm text-muted-foreground">
                {progress.completed}/{progress.total} locations discovered
              </p>
            </div>
          </div>
          
          {/* View Toggle */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <TabsList className="grid w-24 grid-cols-2">
              <TabsTrigger value="map" className="p-1">
                <Map className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="p-1">
                <List className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Adventure Progress</span>
            <span>{Math.round(progress.percentage)}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>
      </div>

      {/* Location Access Status */}
      <AnimatePresence>
        {locationAccess !== 'granted' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-3 bg-yellow-50 border-b border-yellow-200"
          >
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-800">
                {locationAccess === 'checking' && 'Requesting location access...'}
                {locationAccess === 'denied' && 'Location access denied - distances unavailable'}
                {locationAccess === 'unavailable' && 'Location services not available'}
              </span>
              {locationAccess === 'denied' && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={requestLocationAccess}
                  className="h-auto p-0 text-yellow-700 underline"
                >
                  Retry
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1">
        <Tabs value={viewMode} className="h-full">
          
          {/* Map View */}
          <TabsContent value="map" className="m-0 h-full">
            <div className="h-96 bg-muted/50 relative overflow-hidden">
              {/* Placeholder for actual map integration */}
              <div className="absolute inset-0 center-flex flex-col">
                <Map className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-sm text-center px-4">
                  Interactive map will be integrated here<br />
                  <span className="text-xs">(Google Maps / Mapbox)</span>
                </p>
              </div>

              {/* Map Overlay Controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                  <Compass className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="m-0">
            <div className="px-4 py-4">
              
              {/* Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                    id="show-completed"
                  />
                  <label htmlFor="show-completed" className="text-sm">
                    Show completed
                  </label>
                </div>
                
                {suggestedRoute.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <Route className="w-3 h-3 mr-1" />
                    Optimal route suggested
                  </Badge>
                )}
              </div>

              {/* Location List */}
              <div className="space-y-3">
                {filteredLocations.map((qrLocation, index) => (
                  <motion.div
                    key={qrLocation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`relative overflow-hidden transition-all duration-200 ${
                        !qrLocation.isUnlocked 
                          ? 'opacity-60' 
                          : qrLocation.isCompleted 
                            ? 'bg-green-50 border-green-200'
                            : suggestedRoute[0] === qrLocation.id
                              ? 'ring-2 ring-primary/20 bg-primary/5'
                              : 'hover:shadow-md'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-lg center-flex ${
                              qrLocation.isCompleted 
                                ? 'bg-green-500 text-white' 
                                : qrLocation.isUnlocked
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                            }`}>
                              {qrLocation.isCompleted ? (
                                <Star className="w-6 h-6" />
                              ) : (
                                <QrCode className="w-6 h-6" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <CardTitle className="text-base flex items-center gap-2">
                                {qrLocation.scene.title}
                                {suggestedRoute[0] === qrLocation.id && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Next
                                  </Badge>
                                )}
                                {!qrLocation.isUnlocked && (
                                  <Badge variant="outline" className="text-xs">
                                    <Eye className={`w-3 h-3 mr-1 ${!qrLocation.isUnlocked ? 'hidden' : ''}`} />
                                    <EyeOff className={`w-3 h-3 mr-1 ${qrLocation.isUnlocked ? 'hidden' : ''}`} />
                                    Locked
                                  </Badge>
                                )}
                              </CardTitle>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {qrLocation.scene.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {qrLocation.location_description}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {qrLocation.estimatedTime}min
                                </div>
                                {qrLocation.distance && (
                                  <div className="flex items-center gap-1">
                                    <Navigation className="w-3 h-3" />
                                    {getDistanceText(qrLocation.distance)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Difficulty Badge */}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getDifficultyColor(qrLocation.difficulty)}`}
                          >
                            {qrLocation.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleQRScan(qrLocation)}
                            disabled={!qrLocation.isUnlocked || qrLocation.isCompleted || isScanning}
                            className="flex-1 touch-target"
                            variant={qrLocation.isCompleted ? "secondary" : "default"}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            {qrLocation.isCompleted ? 'Completed' : 'Scan QR'}
                          </Button>
                          
                          {qrLocation.scene.location_lat && qrLocation.scene.location_lng && (
                            <Button
                              onClick={() => handleNavigate(qrLocation)}
                              variant="outline"
                              size="icon"
                              className="touch-target"
                            >
                              <Navigation className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>

                      {/* Completion Indicator */}
                      {qrLocation.isCompleted && (
                        <div className="absolute top-0 right-0 w-8 h-8">
                          <div className="absolute top-0 right-0 w-0 h-0 border-l-[2rem] border-l-transparent border-t-[2rem] border-t-green-500"></div>
                          <Star className="absolute top-0.5 right-0.5 w-3 h-3 text-white" />
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredLocations.length === 0 && (
                <div className="text-center py-8">
                  <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {showCompleted ? 'No locations to show' : 'All locations completed!'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 pb-safe space-y-3">
        {/* Quick Scan Button */}
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-primary hover:bg-primary/90 touch-target-lg"
          onClick={() => router.push(`/qr-scan?session=${sessionCode}${isGuest ? '&guest=true' : ''}`)}
        >
          <Camera className="w-6 h-6 mr-2" />
          Quick Scan
        </Button>

        {/* Team Status Button */}
        <Button
          size="lg"
          variant="secondary"
          className="rounded-full shadow-lg bg-secondary hover:bg-secondary/90 touch-target-lg"
          onClick={() => router.push(`/team-status?session=${sessionCode}${isGuest ? '&guest=true' : ''}`)}
        >
          <Users className="w-6 h-6 mr-2" />
          Team
        </Button>
      </div>
    </div>
  )
}