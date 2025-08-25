 

"use client"

import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchForecast } from "../../api/weather"
import { ArrowLeft, MapPin, Sun, Cloud, CloudRain, CloudSnow, Gauge, Sunrise, Sunset } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import WeatherWidgets from "../../components/weather-widgets"

export default function CityDetailPage() {
  const searchParams = useSearchParams()
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const cityName = searchParams.get("name")
  const country = searchParams.get("country")
  const [unit, setUnit] = useState<"metric" | "imperial">("imperial")






  const {
    data: weather,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useQuery({
    queryKey: ["current-weather", lat, lon, unit],
    queryFn: async () => {
      console.log("Fetching weather for:", { lat, lon, unit })
      try {
      
        const response = await fetch(`http://localhost:8080/api/v1/weather/current?lat=${lat}&lon=${lon}&unit=${unit}`)
        console.log("Weather response status:", response.status)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const result = await response.json()
        console.log("Weather raw result:", result)

        if (!result.ok || !result.data) {
          throw new Error(result.error?.message || "Weather data not available")
        }

        console.log("Weather processed result:", result.data)
        return result.data
      } catch (error) {
        console.error("Weather fetch error:", error)
        throw error
      }
    },
    enabled: !!lat && !!lon,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  })





  const {
    data: forecast,
    isLoading: isForecastLoading,
    error: forecastError,
  } = useQuery({
    queryKey: ["forecast", lat, lon, unit],
    queryFn: async () => {
      console.log("Fetching forecast for:", { lat, lon, unit })
      try {
        const result = await fetchForecast(Number(lat), Number(lon), unit)
        console.log("Forecast result:", result)
        return result
      } catch (error) {
        console.error("Forecast fetch error:", error)
        throw error
      }
    },
    enabled: !!lat && !!lon,
    staleTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  })

  
  console.log("Weather Query State:", {
    lat,
    lon,
    unit,
    weather,
    isWeatherLoading,
    weatherError,
    forecast,
    isForecastLoading,
    forecastError,
  })

  if (!lat || !lon || !cityName || !country) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">City Not Found</h1>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-6 h-6 text-amber-500" />
      case "clouds":
        return <Cloud className="w-6 h-6 text-slate-500" />
      case "rain":
        return <CloudRain className="w-6 h-6 text-blue-500" />
      case "snow":
        return <CloudSnow className="w-6 h-6 text-blue-300" />
      default:
        return <Cloud className="w-6 h-6 text-slate-500" />
    }
  }

  const getUVStatus = (uvi: number) => {
    if (uvi <= 2)
      return { status: "Low", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" }
    if (uvi <= 5)
      return { status: "Normal", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" }
    if (uvi <= 7)
      return { status: "High", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" }
    if (uvi <= 10) return { status: "Very High", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" }
    return { status: "Extreme", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" }
  }

  const getHumidityStatus = (humidity: number) => {
    if (humidity <= 30)
      return { status: "Low", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" }
    if (humidity <= 60)
      return { status: "Normal", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" }
    return { status: "High", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
 
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{cityName}</h1>
                <p className="text-slate-600 dark:text-slate-400 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {country}
                </p>
              </div>
            </div>

            <button
              onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <span className="text-sm">{unit === "metric" ? "°C" : "°F"}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
  
        {(weatherError || forecastError) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">API Errors:</h3>
            {weatherError && (
              <p className="text-red-700 dark:text-red-300 mb-1">Weather Error: {weatherError.message}</p>
            )}
            {forecastError && <p className="text-red-700 dark:text-red-300">Forecast Error: {forecastError.message}</p>}
          </div>
        )}

        {isWeatherLoading || isForecastLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading weather data...</p>
          </div>
        ) : weather && forecast ? (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
    
            <div className="xl:col-span-4 space-y-6">
    
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {weather.location.name}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">{weather.location.country}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {weather.current.temp}
                      {weather.units.temp}
                    </div>
                    <div className="text-xl text-slate-600 dark:text-slate-400 mb-4">{weather.current.condition}</div>
                    <div className="flex justify-center">{getWeatherIcon(weather.current.condition)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Feels like</div>
                    <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {weather.current.feelsLike}
                      {weather.units.temp}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Humidity</div>
                    <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {weather.current.humidity}%
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Wind</div>
                    <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {weather.current.windKph} {weather.units.wind}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">UV Index</div>
                    <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {weather.current.uvi}
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">7-Day Forecast</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  {forecast.forecast.map((day, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                    >
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {day.tempMax}
                        {forecast.units.temp}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {day.tempMin}
                        {forecast.units.temp}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">{day.condition}</div>
                    </div>
                  ))}
                </div>
              </div>
 
              <WeatherWidgets />
            </div>
 
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Today's Highlights</h3>

                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Sunrise className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Sunrise</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {new Date(weather.current.sunrise * 1000).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Sunset className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Sunset</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {new Date(weather.current.sunset * 1000).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Gauge className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">UV Index</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {weather.current.uvi}
                    </div>
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${getUVStatus(weather.current.uvi).class}`}
                    >
                      {getUVStatus(weather.current.uvi).status}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Gauge className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Humidity</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {weather.current.humidity}%
                    </div>
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${getHumidityStatus(weather.current.humidity).class}`}
                    >
                      {getHumidityStatus(weather.current.humidity).status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Failed to load weather data</p>
          </div>
        )}
      </main>
    </div>
  )
}
