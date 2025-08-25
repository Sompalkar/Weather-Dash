"use client"

import Header from "./components/header"
import CitiesList from "./components/cities-list"
import WeatherGrid from "./components/weather-grid"
import WeatherAlerts from "./components/weather-alerts"
import LocationWeather from "./components/location-weather"
import { useWeatherStore } from "./store/weather"
import { useState } from "react"
import { MapPin, TrendingUp, Clock, Star, Globe, Zap, Cloud, Sun, Wind, Thermometer } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { cities } = useWeatherStore()
  const [randomCities] = useState([
    {
      name: "London",
      country: "GB",
      lat: 51.5074,
      lon: -0.1278,
      description: "Historic capital of England",
      temp: "18°C",
      condition: "Partly Cloudy",
    },
    {
      name: "New York",
      country: "US",
      lat: 40.7128,
      lon: -74.006,
      description: "The city that never sleeps",
      temp: "22°C",
      condition: "Sunny",
    },
    {
      name: "Tokyo",
      country: "JP",
      lat: 35.6762,
      lon: 139.6503,
      description: "Modern metropolis of Japan",
      temp: "25°C",
      condition: "Clear",
    },
    {
      name: "Paris",
      country: "FR",
      lat: 48.8566,
      lon: 2.3522,
      description: "City of love and lights",
      temp: "20°C",
      condition: "Cloudy",
    },
    {
      name: "Sydney",
      country: "AU",
      lat: -33.8688,
      lon: 151.2093,
      description: "Harbor city of Australia",
      temp: "28°C",
      condition: "Sunny",
    },
    {
      name: "Dubai",
      country: "AE",
      lat: 25.2048,
      lon: 55.2708,
      description: "Desert city of luxury",
      temp: "35°C",
      condition: "Clear",
    },
    {
      name: "Singapore",
      country: "SG",
      lat: 1.3521,
      lon: 103.8198,
      description: "Lion city of Asia",
      temp: "30°C",
      condition: "Partly Cloudy",
    },
    {
      name: "Cape Town",
      country: "ZA",
      lat: -33.9249,
      lon: 18.4241,
      description: "Mother city of Africa",
      temp: "24°C",
      condition: "Sunny",
    },
  ])

  const quickActions = [
    { icon: Globe, title: "Current Location", description: "Get weather for your location", action: "location" },
    { icon: Star, title: "Favorites", description: "View your favorite cities", action: "favorites" },
    { icon: TrendingUp, title: "Trending", description: "Popular weather searches", action: "trending" },
    { icon: Clock, title: "Recent", description: "Recently viewed cities", action: "recent" },
  ]

  const weatherStats = [
    { icon: Thermometer, label: "Global Avg", value: "22°C", trend: "+2°C" },
    { icon: Cloud, label: "Cloud Cover", value: "45%", trend: "-5%" },
    { icon: Wind, label: "Wind Speed", value: "12 km/h", trend: "+3 km/h" },
    { icon: Sun, label: "UV Index", value: "6.2", trend: "+0.8" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />

      <main className="container mx-auto px-4 py-6 lg:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <aside className="xl:col-span-1">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center justify-between">
                Cities <span className="text-sm text-slate-500 dark:text-slate-400">({cities.length})</span>
              </h2>
              <CitiesList />
            </div>
          </aside>

          <section className="xl:col-span-4">
            {cities.length === 0 ? (
              <div className="space-y-8">
                <WeatherAlerts />
                <LocationWeather />

                <div className="text-center py-16 px-4">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                      <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                        <Cloud className="w-10 h-10 text-white" />
                      </div>
                      <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                        Welcome to <span className="text-blue-600">WeatherDash</span>
                      </h1>
                      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Discover weather conditions around the world. Get real-time forecasts, explore global weather
                        patterns, and stay informed with our comprehensive weather dashboard.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          className="group p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 transition-all duration-200"
                        >
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <action.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-2">
                            {action.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {action.description}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 mb-16 shadow-sm">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 text-center">
                        Global Weather Overview
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {weatherStats.map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <stat.icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{stat.label}</div>
                            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stat.value}</div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              {stat.trend}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Explore Popular Cities</h2>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Zap className="w-4 h-4" />
                      <span>Live weather data</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {randomCities.map((city, index) => (
                      <Link
                        key={index}
                        href={`/city/${city.name.toLowerCase().replace(/\s+/g, "-")}?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}&country=${city.country}`}
                        className="group block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-2 transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{city.temp}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{city.condition}</div>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{city.name}</h3>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">{city.country}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {city.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/30 p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
                    Why Choose WeatherDash?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Real-time Data</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Get instant weather updates with live data from reliable sources
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Global Coverage</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Access weather information for any city around the world
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Smart Features</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Advanced forecasting, alerts, and personalized weather insights
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Use the search bar above to find and add your favorite cities 🌍
                  </p>
                </div>
              </div>
            ) : (
              <WeatherGrid />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
