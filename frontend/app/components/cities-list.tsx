"use client"

import { useWeatherStore } from "../store/weather"
import { Trash2, MapPin, Sun, Cloud, CloudRain, CloudSnow } from "lucide-react"

export default function CitiesList() {


  
  const { cities, removeCity, selectedCityId, setSelectedCityId } = useWeatherStore()

  if (cities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No cities added yet</h3>
        <p className="text-slate-500 dark:text-slate-400">Search and add cities to start tracking weather</p>
      </div>
    )
  }





  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-5 h-5 text-yellow-500" />
      case "clouds":
        return <Cloud className="w-5 h-5 text-slate-400" />
      case "rain":
        return <CloudRain className="w-5 h-5 text-blue-500" />
      case "snow":
        return <CloudSnow className="w-5 h-5 text-blue-300" />
      default:
        return <Cloud className="w-5 h-5 text-slate-400" />
    }
  }

  return (
    <div className="space-y-3">
      {cities.slice(0, 5).map((city) => (
        <div
          key={city.id}
          className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
            selectedCityId === city.id
              ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
          onClick={() => setSelectedCityId(city.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                {getWeatherIcon("clouds")}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{city.city.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{city.city.country}</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                removeCity(city.id)
              }}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              title="Remove city"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {cities.length > 5 && (
        <div className="text-center py-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">+{cities.length - 5} more cities</p>
        </div>
      )}
    </div>
  )
}
