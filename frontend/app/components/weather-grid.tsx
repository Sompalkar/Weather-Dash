"use client"

import { useWeatherStore } from "../store/weather"
import { useQuery } from "@tanstack/react-query"
import { fetchCurrentWeather, fetchForecast } from "../api/weather"
import { Skeleton } from "../components/skeleton"
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Gauge } from "lucide-react"

export default function WeatherGrid() {
  const { selectedCityId, cities, unit } = useWeatherStore()

  const selectedCity = cities.find((c) => c.id === selectedCityId)

  if (!selectedCity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 10-9.78 2.096A4.001 4.001 0 003 15z"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Select a City</h2>
        <p className="text-gray-600 dark:text-gray-400">Choose a city from the list to view weather information</p>
      </div>
    )
  }


  

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CurrentWeatherCard city={selectedCity} unit={unit} />
        </div>
        <div className="xl:col-span-1">
          <ForecastCard city={selectedCity} unit={unit} />
        </div>
      </div>

      <div className="xl:col-span-3">
        <HighlightsCard city={selectedCity} unit={unit} />
      </div>
    </div>
  )
}

function CurrentWeatherCard({ city, unit }: { city: any; unit: "metric" | "imperial" }) {
  const {
    data: weather,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["current-weather", city.city.lat, city.city.lon, unit],
    queryFn: () => fetchCurrentWeather(city.city.lat, city.city.lon, unit),
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return <WeatherCardSkeleton />
  }

  if (error || !weather) {
    return (
      <div className="card p-6 text-center">
        <div className="text-red-500 mb-2">Failed to load weather data</div>
        <button onClick={() => window.location.reload()} className="btn-secondary">
          Retry
        </button>
      </div>
    )
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-16 h-16 text-yellow-500" />
      case "clouds":
        return <Cloud className="w-16 h-16 text-gray-400" />
      case "rain":
        return <CloudRain className="w-16 h-16 text-blue-500" />
      case "snow":
        return <CloudSnow className="w-16 h-16 text-blue-300" />
      default:
        return <Cloud className="w-16 h-16 text-gray-400" />
    }
  }

  return (
    <div className="card weather-card p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{weather.location.name}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{weather.location.country}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="text-right">
          <div className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {weather.current.temp}
            {weather.units.temp}
          </div>
          <div className="text-xl text-gray-600 dark:text-gray-400 mb-4">{weather.current.condition}</div>
          <div className="flex justify-center">{getWeatherIcon(weather.current.condition)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Feels like</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {weather.current.feelsLike}
            {weather.units.temp}
          </div>
        </div>

        <div className="metric-card text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Humidity</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{weather.current.humidity}%</div>
        </div>

        <div className="metric-card text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wind</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {weather.current.windKph} {weather.units.wind}
          </div>
        </div>

        <div className="metric-card text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">UV Index</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{weather.current.uvi}</div>
        </div>
      </div>
    </div>
  )
}

function ForecastCard({ city, unit }: { city: any; unit: "metric" | "imperial" }) {
  const {
    data: forecast,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["forecast", city.city.lat, city.city.lon, unit],
    queryFn: () => fetchForecast(city.city.lat, city.city.lon, unit),
    enabled: !!city,
    staleTime: 30 * 60 * 1000,
  })

  if (isLoading) {
    return <ForecastSkeleton />
  }




  if (error || !forecast) {
    return (
      <div className="card p-6 text-center">
        <div className="text-red-500 mb-2">Failed to load forecast data</div>
        <button onClick={() => window.location.reload()} className="btn-secondary">
          Retry
        </button>
      </div>
    )
  }





  const getForecastIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-6 h-6 text-yellow-500" />
      case "clouds":
        return <Cloud className="w-6 h-6 text-gray-400" />
      case "rain":
        return <CloudRain className="w-6 h-6 text-blue-500" />
      case "snow":
        return <CloudSnow className="w-6 h-6 text-blue-300" />
      default:
        return <Cloud className="w-6 h-6 text-gray-400" />
    }
  }

  return (
    <div className="card forecast-card p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">7-Day Forecast</h3>

      <div className="space-y-3">
        {forecast.forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                {getForecastIcon(day.condition)}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{day.condition}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {day.tempMax}
                {forecast.units.temp}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {day.tempMin}
                {forecast.units.temp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HighlightsCard({ city, unit }: { city: any; unit: "metric" | "imperial" }) {
  const { data: weather } = useQuery({
    queryKey: ["current-weather", city.city.lat, city.city.lon, unit],
    queryFn: () => fetchCurrentWeather(city.city.lat, city.city.lon, unit),
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
  })

  if (!weather) return null

  const getUVStatus = (uvi: number) => {
    if (uvi <= 2) return { status: "Low", class: "status-normal" }
    if (uvi <= 5) return { status: "Normal", class: "status-normal" }
    if (uvi <= 7) return { status: "High", class: "status-average" }
    if (uvi <= 10) return { status: "Very High", class: "status-unhealthy" }
    return { status: "Extreme", class: "status-unhealthy" }
  }

  const getHumidityStatus = (humidity: number) => {
    if (humidity <= 30) return { status: "Low", class: "status-average" }
    if (humidity <= 60) return { status: "Normal", class: "status-normal" }
    return { status: "High", class: "status-average" }
  }

  const uvStatus = getUVStatus(weather.current.uvi)
  const humidityStatus = getHumidityStatus(weather.current.humidity)

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Today's Highlights</h3>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {/* UV Index - 2 columns */}
        <div className="col-span-2 metric-card p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <Gauge className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">UV</span>
            </div>
            <span className={`status-badge ${uvStatus.class} text-xs px-1 py-0.5`}>{uvStatus.status}</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{weather.current.uvi}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ 12</span>
          </div>
        </div>

        {/* Wind - 2 columns */}
        <div className="col-span-2 metric-card p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <Wind className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Wind</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{weather.current.windKph}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{weather.units.wind}</span>
          </div>
        </div>

        {/* Sunrise - 1 column */}
        <div className="metric-card p-3">
          <div className="flex items-center justify-center mb-1">
            <Sun className="w-3 h-3 text-amber-500" />
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sunrise</div>
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
              {new Date(weather.current.sunrise * 1000).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>

        {/* Sunset - 1 column */}
        <div className="metric-card p-3">
          <div className="flex items-center justify-center mb-1">
            <Sun className="w-3 h-3 text-amber-500" />
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sunset</div>
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
              {new Date(weather.current.sunset * 1000).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>

        {/* Humidity - 2 columns */}
        <div className="col-span-2 metric-card p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <Gauge className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Humidity</span>
            </div>
            <span className={`status-badge ${humidityStatus.class} text-xs px-1 py-0.5`}>{humidityStatus.status}</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{weather.current.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WeatherCardSkeleton() {
  return (
    <div className="card weather-card p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="text-right">
          <Skeleton className="h-16 w-20 mb-2" />
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card text-center">
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <Skeleton className="h-6 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ForecastSkeleton() {
  return (
    <div className="card forecast-card p-6">
      <Skeleton className="h-6 w-32 mb-6" />

      <div className="space-y-3">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div>
                <Skeleton className="h-5 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <div className="text-right">
              <Skeleton className="h-5 w-12 mb-1" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
