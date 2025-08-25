'use client'

import { useState } from 'react'
import { Droplets, Eye, Gauge, Wind, Sunrise, Sunset, Calendar, Clock } from 'lucide-react'

interface WeatherWidget {
  id: string
  title: string
  value: string
  unit?: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  trend?: string
  color: string
}




export default function WeatherWidgets() {
  const [widgets] = useState<WeatherWidget[]>([
    {
      id: '1',
      title: 'Air Quality',
      value: 'Good',
      icon: Gauge,
      description: 'AQI: 45',
      trend: 'Improving',
      color: 'text-green-600'
    },
    {
      id: '2',
      title: 'Visibility',
      value: '10',
      unit: 'km',
      icon: Eye,
      description: 'Clear conditions',
      color: 'text-blue-600'
    },
    {
      id: '3',
      title: 'Dew Point',
      value: '12',
      unit: '°C',
      icon: Droplets,
      description: 'Comfortable',
      color: 'text-cyan-600'
    },
    {
      id: '4',
      title: 'Pressure',
      value: '1013',
      unit: 'hPa',
      icon: Gauge,
      description: 'Normal',
      trend: 'Stable',
      color: 'text-purple-600'
    }
  ])

  const [timeInfo] = useState({
    sunrise: '6:45 AM',
    sunset: '7:30 PM',
    dayLength: '12h 45m',
    solarNoon: '1:07 PM'
  })

  return (
    <div className="space-y-6">
      {/* Weather Widgets Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Weather Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                  <widget.icon className={`w-4 h-4 ${widget.color}`} />
                </div>
                {widget.trend && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {widget.trend}
                  </span>
                )}
              </div>
              <div className="mb-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {widget.value}{widget.unit}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {widget.title}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {widget.description}
              </div>
            </div>
          ))}
        </div>
      </div>

    
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Sun & Moon
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sunrise className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sunrise</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {timeInfo.sunrise}
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sunset className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sunset</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {timeInfo.sunset}
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Day Length</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {timeInfo.dayLength}
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Solar Noon</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {timeInfo.solarNoon}
            </div>
          </div>
        </div>
      </div>

 
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Today's Summary
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Temperature Range</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">18°C - 25°C</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Precipitation Chance</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">20%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Wind Direction</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">SW 15 km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Humidity Range</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">45% - 75%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
