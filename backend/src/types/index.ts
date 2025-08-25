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

export interface CityData {
  name: string
  country: string
  lat: number
  lon: number
}

export interface UserCityData {
  id: string
  city: CityData
  order: number
  pinned: boolean
}

export interface ApiResponse<T> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  stale?: boolean
}

export interface SearchResult {
  name: string
  country: string
  lat: number
  lon: number
  state?: string
}
