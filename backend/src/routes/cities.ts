import { Router } from 'express'
import { prisma } from '../services/database'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] as string
    if (!deviceId) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Device ID required' } })
    }

    let user = await prisma.user.findUnique({ where: { deviceId } })
    if (!user) {
      user = await prisma.user.create({ data: { deviceId } })
    }

    const userCities = await prisma.userCity.findMany({
      where: { userId: user.id },
      include: { city: true },
      orderBy: [
        { pinned: 'desc' },
        { order: 'asc' }
      ]
    })

    const cities = userCities.map(uc => ({
      id: uc.id,
      city: {
        name: uc.city.name,
        country: uc.city.country,
        lat: uc.city.lat,
        lon: uc.city.lon
      },
      order: uc.order,
      pinned: uc.pinned
    }))

    res.json({ ok: true, data: cities })
  } catch (error) {
    console.error('Get cities error:', error)
    res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch cities' } })
  }
})

router.post('/', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] as string
    if (!deviceId) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Device ID required' } })
    }

    const { name, country, lat, lon } = req.body

    if (!name || !country || lat === undefined || lon === undefined) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } })
    }

    let user = await prisma.user.findUnique({ where: { deviceId } })
    if (!user) {
      user = await prisma.user.create({ data: { deviceId } })
    }

    let city = await prisma.city.findFirst({
      where: { name, country, lat, lon }
    })

    if (!city) {
      city = await prisma.city.create({
        data: { name, country, lat, lon }
      })
    }

    const existingUserCity = await prisma.userCity.findUnique({
      where: { userId_cityId: { userId: user.id, cityId: city.id } }
    })

    if (existingUserCity) {
      return res.status(400).json({ ok: false, error: { code: 'DUPLICATE_CITY', message: 'City already added' } })
    }

    const maxOrder = await prisma.userCity.aggregate({
      where: { userId: user.id },
      _max: { order: true }
    })

    const userCity = await prisma.userCity.create({
      data: {
        userId: user.id,
        cityId: city.id,
        order: (maxOrder._max.order || 0) + 1
      },
      include: { city: true }
    })

    res.json({
      ok: true,
      data: {
        id: userCity.id,
        city: {
          name: userCity.city.name,
          country: userCity.city.country,
          lat: userCity.city.lat,
          lon: userCity.city.lon
        },
        order: userCity.order,
        pinned: userCity.pinned
      }
    })
  } catch (error) {
    console.error('Add city error:', error)
    res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to add city' } })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] as string
    if (!deviceId) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Device ID required' } })
    }

    const { id } = req.params
    const { order, pinned } = req.body

    let user = await prisma.user.findUnique({ where: { deviceId } })
    if (!user) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'User not found' } })
    }

    const userCity = await prisma.userCity.findFirst({
      where: { id, userId: user.id },
      include: { city: true }
    })

    if (!userCity) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'City not found' } })
    }

    const updatedUserCity = await prisma.userCity.update({
      where: { id },
      data: { order, pinned },
      include: { city: true }
    })

    res.json({
      ok: true,
      data: {
        id: updatedUserCity.id,
        city: {
          name: updatedUserCity.city.name,
          country: updatedUserCity.city.country,
          lat: updatedUserCity.city.lat,
          lon: updatedUserCity.city.lon
        },
        order: updatedUserCity.order,
        pinned: updatedUserCity.pinned
      }
    })
  } catch (error) {
    console.error('Update city error:', error)
    res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update city' } })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] as string
    if (!deviceId) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Device ID required' } })
    }

    const { id } = req.params

    let user = await prisma.user.findUnique({ where: { deviceId } })
    if (!user) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'User not found' } })
    }

    const userCity = await prisma.userCity.findFirst({
      where: { id, userId: user.id }
    })

    if (!userCity) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'City not found' } })
    }

    await prisma.userCity.delete({ where: { id } })

    res.json({ ok: true, data: null })
  } catch (error) {
    console.error('Delete city error:', error)
    res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete city' } })
  }
})

export { router as citiesRoutes }
