import { Router } from 'express'
import { WeatherService } from '../services/weather'

const router = Router()
const weatherService = new WeatherService(process.env.OPENWEATHER_API_KEY!)

router.get('/cities', async (req, res) => {
  try {
    const { q } = req.query
    
    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.json({ ok: true, data: [] })
    }

    const results = await weatherService.searchCities(q)
    
    res.json({ ok: true, data: results })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ 
      ok: false, 
      error: { 
        code: 'PROVIDER_ERROR', 
        message: 'Search service temporarily unavailable' 
      } 
    })
  }
})

export { router as searchRoutes }
