const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
    timezone?: string
  }
  current: {
    temp: number
    feelsLike: number
    humidity: number
    windKph: number
    uvi: number
    condition: string
    icon: string
    sunrise: number
    sunset: number
  }
  units: {
    temp: string
    wind: string
  }
}

export interface ForecastData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
    timezone?: string
  }
  forecast: Array<{
    date: string
    tempMax: number
    tempMin: number
    condition: string
    icon: string
    humidity: number
    windKph: number
  }>
  units: {
    temp: string
    wind: string
  }
}

export interface SearchResult {
  name: string
  country: string
  lat: number
  lon: number
  state?: string
}

export interface ApiResponse<T> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

export async function fetchCurrentWeather(lat: number, lon: number, unit: 'metric' | 'imperial'): Promise<WeatherData> {
  const response = await fetch(
    `${API_BASE}/api/v1/weather/current?lat=${lat}&lon=${lon}&unit=${unit}`,
    {
      headers: {
        'x-device-id': getDeviceId()
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }
  
  const result: ApiResponse<WeatherData> = await response.json()
  if (!result.ok || !result.data) {
    throw new Error(result.error?.message || 'Weather data not available')
  }
  
  return result.data
}

export async function fetchForecast(lat: number, lon: number, unit: 'metric' | 'imperial'): Promise<ForecastData> {
  const response = await fetch(
    `${API_BASE}/api/v1/weather/forecast?lat=${lat}&lon=${lon}&unit=${unit}`,
    {
      headers: {
        'x-device-id': getDeviceId()
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch forecast data')
  }
  
  const result: ApiResponse<ForecastData> = await response.json()
  if (!result.ok || !result.data) {
    throw new Error(result.error?.message || 'Forecast data not available')
  }
  
  return result.data
}

export async function searchCities(query: string): Promise<SearchResult[]> {
  if (query.length < 2) return []
  
  const response = await fetch(
    `${API_BASE}/api/v1/search/cities?q=${encodeURIComponent(query)}`,
    {
      headers: {
        'x-device-id': getDeviceId()
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to search cities')
  }
  
  const result: ApiResponse<SearchResult[]> = await response.json()
  if (!result.ok || !result.data) {
    throw new Error(result.error?.message || 'Search not available')
  }
  
  return result.data
}
