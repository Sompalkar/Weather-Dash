// "use client"

import { useState } from "react"
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchCurrentWeather } from "../api/weather"

export default function LocationWeather() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locationName, setLocationName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")


  const { data: weather, isLoading: isWeatherLoading } = useQuery({
    queryKey: ["location-weather", location?.lat, location?.lon],
    queryFn: () => fetchCurrentWeather(location!.lat, location!.lon, "imperial"),
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
  })



  const getCurrentLocation = () => {
    setIsLoading(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setIsLoading(false)
      return
    }




    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lon: longitude })

        try {
         
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
          const data = await response.json()
          if (data && data.city) {
            setLocationName(`${data.city}, ${data.countryCode}`)
          }
        } catch (err) {
          console.error("Error getting location name:", err)
          
          setLocationName(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
        }

        setIsLoading(false)
      },
      (err) => {
        setError("Unable to retrieve your location")
        setIsLoading(false)
        console.error("Geolocation error:", err)
      },
    )
  }








  if (!location) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Get Weather for Your Location
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Allow location access to get personalized weather information
          </p>
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            <span>{isLoading ? "Getting Location..." : "Get My Weather"}</span>
          </button>
          {error && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isWeatherLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading weather data...</p>
        </div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Failed to load weather data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Your Location</h3>
        </div>
        <button
          onClick={getCurrentLocation}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Location</p>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {locationName || `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Temperature</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {weather.current.temp}
              {weather.units.temp}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Condition</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">{weather.current.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Humidity</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{weather.current.humidity}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Wind</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {weather.current.windKph} {weather.units.wind}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">UV Index</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{weather.current.uvi}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
