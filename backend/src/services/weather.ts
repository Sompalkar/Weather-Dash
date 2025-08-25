import { WeatherData, ForecastData, SearchResult } from '../types'

export class WeatherService {
  private apiKey: string
  private baseUrl = 'https://api.openweathermap.org'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getCurrentWeather(lat: number, lon: number, unit: 'metric' | 'imperial'): Promise<WeatherData> {
    if (!this.apiKey || this.apiKey === 'your_openweather_api_key_here') {
      return this.getMockCurrentWeather(lat, lon, unit)
    }

    const response = await fetch(
      `${this.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${this.apiKey}`
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json() as any

    return {
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      current: {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windKph: Math.round(data.wind.speed * (unit === 'metric' ? 3.6 : 1.60934)),
        condition: data.weather[0].main,
        uvi: data.uvi || 0,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset
      },
      units: {
        temp: unit === 'metric' ? '°C' : '°F',
        wind: unit === 'metric' ? 'km/h' : 'mph'
      }
    }
  }

  async getForecast(lat: number, lon: number, unit: 'metric' | 'imperial'): Promise<ForecastData> {
    if (!this.apiKey || this.apiKey === 'your_openweather_api_key_here') {
      return this.getMockForecast(lat, lon, unit)
    }

    const response = await fetch(
      `${this.baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${this.apiKey}`
    )

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`)
    }

    const data = await response.json() as any

    const dailyData = data.list.reduce((acc: any, item: any) => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!acc[date]) {
        acc[date] = {
          date: item.dt * 1000,
          tempMax: Math.round(item.main.temp_max),
          tempMin: Math.round(item.main.temp_min),
          condition: item.weather[0].main,
          humidity: item.main.humidity,
          windKph: Math.round(item.wind.speed * (unit === 'metric' ? 3.6 : 1.60934))
        }
      } else {
        acc[date].tempMax = Math.max(acc[date].tempMax, Math.round(item.main.temp_max))
        acc[date].tempMin = Math.min(acc[date].tempMin, Math.round(item.main.temp_min))
      }
      return acc
    }, {})

    const forecast = Object.values(dailyData).slice(0, 7) as {
      date: number
      tempMax: number
      tempMin: number
      condition: string
      humidity: number
      windKph: number
    }[]

    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        lat: data.city.coord.lat,
        lon: data.city.coord.lon
      },
      forecast: forecast.map(day => ({
        ...day,
        icon: day.condition.toLowerCase().includes('rain') ? 'rain' : 'sun'
      })),
      units: {
        temp: unit === 'metric' ? '°C' : '°F',
        wind: unit === 'metric' ? 'km/h' : 'mph'
      }
    }
  }

  async searchCities(query: string): Promise<SearchResult[]> {
    if (!this.apiKey || this.apiKey === 'your_openweather_api_key_here') {
      return this.getMockSearchResults(query)
    }

    const response = await fetch(
      `${this.baseUrl}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
    )

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`)
    }

    const data = await response.json() as any[]
    return data.map(city => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
      state: city.state
    }))
  }

  private getMockCurrentWeather(lat: number, lon: number, unit: 'metric' | 'imperial'): WeatherData {
    const cityNames = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Cape Town']
    const cityName = cityNames[Math.floor(Math.abs(lat + lon) % cityNames.length)]
    
    return {
      location: {
        name: cityName,
        country: 'GB',
        lat: lat,
        lon: lon
      },
      current: {
        temp: Math.floor(Math.random() * 30) + 10,
        feelsLike: Math.floor(Math.random() * 30) + 10,
        humidity: Math.floor(Math.random() * 40) + 30,
        windKph: Math.floor(Math.random() * 20) + 5,
        condition: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
        uvi: Math.floor(Math.random() * 10) + 1,
        sunrise: Math.floor(Date.now() / 1000) - 21600,
        sunset: Math.floor(Date.now() / 1000) + 21600
      },
      units: {
        temp: unit === 'metric' ? '°C' : '°F',
        wind: unit === 'metric' ? 'km/h' : 'mph'
      }
    }
  }

  private getMockForecast(lat: number, lon: number, unit: 'metric' | 'imperial'): ForecastData {
    const cityNames = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Cape Town']
    const cityName = cityNames[Math.floor(Math.abs(lat + lon) % cityNames.length)]
    
    const forecast = []
    for (let i = 1; i <= 7; i++) {
      const date = Date.now() + (i * 24 * 60 * 60 * 1000)
      forecast.push({
        date: date,
        tempMax: Math.floor(Math.random() * 25) + 15,
        tempMin: Math.floor(Math.random() * 15) + 5,
        condition: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 30,
        windKph: Math.floor(Math.random() * 20) + 5,
        icon: 'sun'
      })
    }

    return {
      location: {
        name: cityName,
        country: 'GB',
        lat: lat,
        lon: lon
      },
      forecast,
      units: {
        temp: unit === 'metric' ? '°C' : '°F',
        wind: unit === 'metric' ? 'km/h' : 'mph'
      }
    }
  }

  private getMockSearchResults(query: string): SearchResult[] {
    const mockCities = [
      { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278, state: 'England' },
      { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060, state: 'NY' },
      { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503, state: 'Tokyo' },
      { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522, state: 'Île-de-France' },
      { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093, state: 'NSW' }
    ]

    return mockCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase())
    )
  }
}
