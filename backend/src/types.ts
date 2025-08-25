export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temp: number
    feelsLike: number
    humidity: number
    windKph: number
    condition: string
    uvi: number
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
  }
  forecast: {
    date: number
    tempMax: number
    tempMin: number
    condition: string
    humidity: number
    windKph: number
  }[]
  units: {
    temp: string
    wind: string
  }
}

export interface SearchResult {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
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
  }
  stale?: boolean
}
