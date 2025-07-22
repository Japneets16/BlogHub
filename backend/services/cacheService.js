const redis = require('redis');
require('dotenv').config();

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.connect();
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.isConnected = false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, expireInSeconds = 3600) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.setEx(key, expireInSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async clearPattern(pattern) {
    if (!this.isConnected) return false;
    
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Cache clear pattern error:', error);
      return false;
    }
  }

  // Specific cache methods for common operations
  async getBlogPosts(page = 1, limit = 10, category = null) {
    const key = `blogs:${page}:${limit}:${category || 'all'}`;
    return await this.get(key);
  }

  async setBlogPosts(data, page = 1, limit = 10, category = null) {
    const key = `blogs:${page}:${limit}:${category || 'all'}`;
    return await this.set(key, data, 1800); // 30 minutes
  }

  async getUserProfile(userId) {
    const key = `user:${userId}`;
    return await this.get(key);
  }

  async setUserProfile(userId, data) {
    const key = `user:${userId}`;
    return await this.set(key, data, 3600); // 1 hour
  }

  async incrementViews(blogId) {
    if (!this.isConnected) return 0;
    
    try {
      const key = `blog:views:${blogId}`;
      return await this.client.incr(key);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }
}

module.exports = new CacheService();
