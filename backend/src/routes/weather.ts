import { Router } from 'express'
import { WeatherService } from '../services/weather'
import { CacheService } from '../services/cache'
import { prisma } from '../services/database'

const router = Router()
const weatherService = new WeatherService(process.env.OPENWEATHER_API_KEY!)
const cacheService = new CacheService(process.env.REDIS_URL!, prisma)

router.get('/current', async (req, res) => {
  try {
    const { lat, lon, unit = 'metric' } = req.query
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        ok: false, 
        error: { code: 'VALIDATION_ERROR', message: 'Lat and lon are required' } 
      })
    }

    const latNum = parseFloat(lat as string)
    const lonNum = parseFloat(lon as string)
    const unitStr = unit as 'metric' | 'imperial'

    if (isNaN(latNum) || isNaN(lonNum)) {
      return res.status(400).json({ 
        ok: false, 
        error: { code: 'VALIDATION_ERROR', message: 'Invalid lat or lon values' } 
      })
    }

    const cacheKey = `wx:current:${latNum}:${lonNum}:${unitStr}`
    
    let cached = await cacheService.get(cacheKey)
    if (cached) {
      return res.json({ ok: true, data: cached })
    }

    const weatherData = await weatherService.getCurrentWeather(latNum, lonNum, unitStr)
    const ttl = parseInt(process.env.CACHE_TTL_CURRENT_SEC || '300')
    await cacheService.set(cacheKey, weatherData, ttl)
    
    res.json({ ok: true, data: weatherData })
  } catch (error) {
    console.error('Current weather error:', error)
    
    const fallback = await cacheService.getFallback(`wx:current:${req.query.lat}:${req.query.lon}:${req.query.unit}`)
    if (fallback) {
      return res.json({ ok: true, data: fallback, stale: true })
    }
    
    res.status(500).json({ 
      ok: false, 
      error: { code: 'PROVIDER_ERROR', message: 'Weather service temporarily unavailable' } 
    })
  }
})

router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, unit = 'metric' } = req.query
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        ok: false, 
        error: { code: 'VALIDATION_ERROR', message: 'Lat and lon are required' } 
      })
    }

    const latNum = parseFloat(lat as string)
    const lonNum = parseFloat(lon as string)
    const unitStr = unit as 'metric' | 'imperial'

    if (isNaN(latNum) || isNaN(lonNum)) {
      return res.status(400).json({ 
        ok: false, 
        error: { code: 'VALIDATION_ERROR', message: 'Invalid lat or lon values' } 
      })
    }

    const cacheKey = `wx:forecast:${latNum}:${lonNum}:${unitStr}`
    
    let cached = await cacheService.get(cacheKey)
    if (cached) {
      return res.json({ ok: true, data: cached })
    }

    const forecastData = await weatherService.getForecast(latNum, lonNum, unitStr)
    const ttl = parseInt(process.env.CACHE_TTL_FORECAST_SEC || '1800')
    await cacheService.set(cacheKey, forecastData, ttl)
    
    res.json({ ok: true, data: forecastData })
  } catch (error) {
    console.error('Forecast error:', error)
    
    const fallback = await cacheService.getFallback(`wx:forecast:${req.query.lat}:${req.query.lon}:${req.query.unit}`)
    if (fallback) {
      return res.json({ ok: true, data: fallback, stale: true })
    }
    
    res.status(500).json({ 
      ok: false, 
      error: { code: 'PROVIDER_ERROR', message: 'Weather service temporarily unavailable' } 
    })
  }
})

export { router as weatherRoutes }
