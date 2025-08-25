import { createClient } from 'redis'
import { PrismaClient } from '@prisma/client'

export class CacheService {
  private redis: ReturnType<typeof createClient> | null = null
  private prisma: PrismaClient
  private redisConnected: boolean = false
  private memoryCache: Map<string, { value: any; expiresAt: number }> = new Map()

  constructor(redisUrl: string, prisma: PrismaClient) {
    this.prisma = prisma
    
    if (redisUrl && redisUrl !== 'redis://localhost:6379') {
      try {
        this.redis = createClient({ url: redisUrl })
        this.connect()
      } catch (error) {
        console.error('Redis client creation failed:', error)
        this.redis = null
      }
    } else {
      console.log('Redis disabled - using memory cache only')
    }
  }

  private async connect() {
    if (!this.redis) return
    
    try {
      await this.redis.connect()
      this.redisConnected = true
      console.log('Redis connected successfully')
    } catch (error) {
      console.error('Redis connection failed:', error)
      this.redisConnected = false
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.redis && this.redisConnected) {
      try {
        const cached = await this.redis.get(key)
        if (cached) {
          return JSON.parse(cached)
        }
      } catch (error) {
        console.error('Redis get error:', error)
        this.redisConnected = false
      }
    }
    
    const memoryCached = this.memoryCache.get(key)
    if (memoryCached && memoryCached.expiresAt > Date.now()) {
      return memoryCached.value as T
    }
    
    try {
      return await this.getFallback<T>(key)
    } catch (error) {
      return null
    }
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    const expiresAt = Date.now() + (ttlSeconds * 1000)
    
    this.memoryCache.set(key, { value, expiresAt })
    
    if (this.redis && this.redisConnected) {
      try {
        await this.redis.setEx(key, ttlSeconds, JSON.stringify(value))
      } catch (error) {
        console.error('Redis set error:', error)
        this.redisConnected = false
      }
    }

    try {
      await this.prisma.weatherCache.upsert({
        where: { key },
        create: {
          key,
          payload: value,
          type: key.includes('current') ? 'current' : 'forecast',
          ttlSec: ttlSeconds,
          expiresAt: new Date(expiresAt)
        },
        update: {
          payload: value,
          expiresAt: new Date(expiresAt)
        }
      })
    } catch (error) {
      console.log('Database not available - using memory cache only')
    }
  }

  async getFallback<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.prisma.weatherCache.findUnique({
        where: { key }
      })
      
      if (cached && cached.expiresAt > new Date()) {
        return cached.payload as T
      }
      
      return null
    } catch (error) {
      return null
    }
  }
}
