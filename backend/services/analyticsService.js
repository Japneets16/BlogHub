const blogmodel = require('../models/blog');
const Usermodel = require('../models/user');
const commentmodel = require('../models/comment');
const cacheService = require('./cacheService');

class AnalyticsService {
  // Dashboard stats for admin/user
  async getDashboardStats(userId = null) {
    const cacheKey = userId ? `dashboard:${userId}` : 'dashboard:global';
    
    // Try to get from cache first
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      let stats = {};

      if (userId) {
        // User-specific stats
        const userBlogs = await blogmodel.find({ author: userId });
        const totalViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
        const totalLikes = userBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);
        
        stats = {
          totalPosts: userBlogs.length,
          totalViews,
          totalLikes,
          totalFollowers: (await Usermodel.findById(userId)).followers.length,
          totalComments: await commentmodel.countDocuments({ 
            blog: { $in: userBlogs.map(blog => blog._id) } 
          }),
          publishedPosts: userBlogs.filter(blog => blog.isPublished).length,
          draftPosts: userBlogs.filter(blog => !blog.isPublished).length
        };
      } else {
        // Global stats
        stats = {
          totalUsers: await Usermodel.countDocuments(),
          totalBlogs: await blogmodel.countDocuments(),
          totalComments: await commentmodel.countDocuments(),
          totalViews: await blogmodel.aggregate([
            { $group: { _id: null, total: { $sum: '$views' } } }
          ]).then(result => result[0]?.total || 0),
          totalLikes: await blogmodel.aggregate([
            { $group: { _id: null, total: { $sum: { $size: '$likes' } } } }
          ]).then(result => result[0]?.total || 0)
        };
      }

      // Cache for 30 minutes
      await cacheService.set(cacheKey, stats, 1800);
      return stats;
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
  }

  // Popular posts analytics
  async getPopularPosts(limit = 10, timeframe = 'all') {
    const cacheKey = `popular:${limit}:${timeframe}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      let dateFilter = {};
      
      if (timeframe !== 'all') {
        const now = new Date();
        switch (timeframe) {
          case 'week':
            dateFilter.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
            break;
          case 'month':
            dateFilter.createdAt = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
            break;
          case 'year':
            dateFilter.createdAt = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
            break;
        }
      }

      const popularPosts = await blogmodel
        .find({ isPublished: true, ...dateFilter })
        .sort({ views: -1, likes: -1 })
        .limit(limit)
        .populate('author', 'name profilePicture')
        .select('title slug views likes createdAt author category');

      await cacheService.set(cacheKey, popularPosts, 3600);
      return popularPosts;
    } catch (error) {
      console.error('Popular posts error:', error);
      throw error;
    }
  }

  // User engagement analytics
  async getUserEngagement(userId) {
    const cacheKey = `engagement:${userId}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const user = await Usermodel.findById(userId);
      const userPosts = await blogmodel.find({ author: userId });
      
      const engagement = {
        averageViews: userPosts.length > 0 ? 
          userPosts.reduce((sum, post) => sum + post.views, 0) / userPosts.length : 0,
        averageLikes: userPosts.length > 0 ? 
          userPosts.reduce((sum, post) => sum + post.likes.length, 0) / userPosts.length : 0,
        engagementRate: 0,
        mostPopularPost: userPosts.sort((a, b) => b.views - a.views)[0] || null,
        posting_frequency: await this.getPostingFrequency(userId),
        growth: await this.getGrowthMetrics(userId)
      };

      if (userPosts.length > 0) {
        const totalInteractions = userPosts.reduce((sum, post) => 
          sum + post.views + post.likes.length, 0);
        engagement.engagementRate = totalInteractions / userPosts.length;
      }

      await cacheService.set(cacheKey, engagement, 3600);
      return engagement;
    } catch (error) {
      console.error('User engagement error:', error);
      throw error;
    }
  }

  // Category analytics
  async getCategoryAnalytics() {
    const cacheKey = 'category:analytics';
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const categoryStats = await blogmodel.aggregate([
        { $match: { isPublished: true } },
        {
          $group: {
            _id: '$category',
            postCount: { $sum: 1 },
            totalViews: { $sum: '$views' },
            totalLikes: { $sum: { $size: '$likes' } },
            averageViews: { $avg: '$views' }
          }
        },
        { $sort: { postCount: -1 } }
      ]);

      await cacheService.set(cacheKey, categoryStats, 7200); // 2 hours
      return categoryStats;
    } catch (error) {
      console.error('Category analytics error:', error);
      throw error;
    }
  }

  // Helper method for posting frequency
  async getPostingFrequency(userId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPosts = await blogmodel.countDocuments({
      author: userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    return {
      postsLast30Days: recentPosts,
      averagePerWeek: (recentPosts / 30) * 7
    };
  }

  // Helper method for growth metrics
  async getGrowthMetrics(userId) {
    const user = await Usermodel.findById(userId);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // This is simplified - in a real app, you'd track follower history
    return {
      followersGrowth: user.followers.length, // Would be actual growth calculation
      viewsGrowth: 0 // Would calculate views growth over time
    };
  }

  // Track blog view
  async trackView(blogId, userId = null) {
    try {
      const blog = await blogmodel.findById(blogId);
      if (!blog) return false;

      // Increment view count
      blog.views += 1;

      // Track unique viewers if user is logged in
      if (userId && !blog.viewedBy.some(view => view.user.toString() === userId)) {
        blog.viewedBy.push({ user: userId, viewedAt: new Date() });
      }

      await blog.save();

      // Update cache
      await cacheService.incrementViews(blogId);
      
      return true;
    } catch (error) {
      console.error('Track view error:', error);
      return false;
    }
  }
}

module.exports = new AnalyticsService();
