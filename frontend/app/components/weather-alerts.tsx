"use client"

import type React from "react"

import { useState } from "react"
import { X, Bell, Wind, CloudRain, Sun } from "lucide-react"

interface WeatherAlert {
  id: string
  type: "warning" | "info" | "severe"
  title: string
  message: string
  icon: React.ComponentType<{ className?: string }>
  timestamp: Date
  expiresAt?: Date
}

export default function WeatherAlerts() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([
    {
      id: "1",
      type: "warning",
      title: "High UV Index",
      message: "UV index is high today. Consider using sunscreen and limiting sun exposure.",
      icon: Sun,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),  
    },
    {
      id: "2",
      type: "info",
      title: "Wind Advisory",
      message: "Strong winds expected in the afternoon. Secure loose objects.",
      icon: Wind,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),  
    },
    {
      id: "3",
      type: "severe",
      title: "Heavy Rainfall",
      message: "Heavy rainfall expected tonight. Possible flooding in low-lying areas.",
      icon: CloudRain,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),  
    },
  ])




  const [isExpanded, setIsExpanded] = useState(false)

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }




  const getAlertStyles = (type: WeatherAlert["type"]) => {
    switch (type) {
      case "severe":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
      case "warning":
        return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
      case "info":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
      default:
        return "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30"
    }
  }



  const getIconColor = (type: WeatherAlert["type"]) => {
    switch (type) {
      case "severe":
        return "text-red-600 dark:text-red-400"
      case "warning":
        return "text-amber-600 dark:text-amber-400"
      case "info":
        return "text-blue-600 dark:text-blue-400"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }



  if (alerts.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Weather Alerts</h3>
          <span className="bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-medium px-2 py-1 rounded-lg">
            {alerts.length}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
        >
          {isExpanded ? "Show Less" : "Show All"}
        </button>
      </div>




      <div className="space-y-3">
        {alerts.slice(0, isExpanded ? alerts.length : 1).map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl border p-4 ${getAlertStyles(alert.type)} transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${getAlertStyles(alert.type)}`}>
                  <alert.icon className={`w-4 h-4 ${getIconColor(alert.type)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{alert.title}</h4>
                    {alert.type === "severe" && (
                      <span className="bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-lg font-medium">
                        Severe
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{alert.message}</p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {alert.timestamp.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    {alert.expiresAt && (
                      <span>
                        Expires:{" "}
                        {alert.expiresAt.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        
      </div>
    </div>
  )
}
