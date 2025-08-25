"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { searchCities } from "../api/weather"
import { useWeatherStore } from "../store/weather"
import { useTheme } from "../context/theme"
import { Search, Sun, Moon, Monitor, Thermometer, X } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { unit, setUnit } = useWeatherStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)



  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["search-cities", searchQuery],
    queryFn: () => searchCities(searchQuery),
    enabled: searchQuery.length > 2 && showSearch,
    staleTime: 5 * 60 * 1000,
  })

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric")
  }


  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-3xl font-bold text-blue-600">WeatherDash</h1>

            <div className="relative">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-all duration-200"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search cities</span>
                </button>
              </div>
            </div>
          </div>



          <div className="flex items-center space-x-3">
            <button
              onClick={toggleUnit}

              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 transition-all duration-200"
              title={unit === "metric" ? "Switch to Fahrenheit" : "Switch to Celsius"}
            >
              <Thermometer className="w-4 h-4" />
              <span className="text-sm font-semibold">{unit === "metric" ? "°C" : "°F"}</span>
            </button>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === "light"

                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                title="Light theme"

              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-slate-700 text-blue-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                title="Dark theme"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("system")}
                
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === "system"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                title="System theme"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {showSearch && (
          <div className="mt-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search for cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearch(false)
                  setSearchQuery("")
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSearching && (
              <div className="mt-3 text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm text-slate-500 mt-2">Searching...</p>
              </div>
            )}

            {searchResults && searchResults.length > 0 && (
              <div className="mt-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto shadow-lg">
                {searchResults.map((city, index) => (
                  <Link
                    key={index}
                    href={`/city/${city.name.toLowerCase().replace(/\s+/g, "-")}?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}&country=${city.country}`}
                    onClick={() => {
                      setShowSearch(false)
                      setSearchQuery("")
                    }}
                    className="block w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100">{city.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {city.country}
                      {city.state ? `, ${city.state}` : ""}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery.length > 2 && !isSearching && searchResults && searchResults.length === 0 && (
              <div className="mt-3 text-center py-4 text-slate-500 dark:text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No cities found</p>
              </div>
            )}

            {searchQuery.length <= 2 && searchQuery.length > 0 && (
              <div className="mt-3 text-center py-4 text-slate-500 dark:text-slate-400">
                <p>Type at least 3 characters to search</p>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
