import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { weatherRoutes } from './routes/weather'
import { citiesRoutes } from './routes/cities'
import { searchRoutes } from './routes/search'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080




app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.ALLOWED_ORIGIN
  ].filter((origin): origin is string => Boolean(origin)),
  credentials: true
}))



app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})



app.use('/api/v1/weather', weatherRoutes)
app.use('/api/v1/cities', citiesRoutes)
app.use('/api/v1/search', searchRoutes)





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
