// JavaScript types documentation
// Since JavaScript doesn't have interfaces, these are documented for reference

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} [username] - For backward compatibility
 * @property {string} email
 * @property {string} [avatar]
 * @property {'user'|'admin'} [role]
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} Blog
 * @property {string} [id]
 * @property {string} [_id]
 * @property {string} title
 * @property {string} content
 * @property {string} [excerpt]
 * @property {string} [image]
 * @property {User} author
 * @property {string} authorId
 * @property {number} likes
 * @property {number} [views]
 * @property {boolean} [isLiked]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string[]} [tags]
 * @property {number} [commentCount]
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} content
 * @property {User} author
 * @property {string} authorId
 * @property {string} blogId
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {boolean} [isHidden]
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {function(string, string): Promise<void>} login
 * @property {function(SignupData): Promise<void>} signup
 * @property {function(): void} logout
 * @property {function(Partial<User>): void} updateUser
 */

/**
 * @typedef {Object} SignupData
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {*} [data]
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {User} user
 */

/**
 * @typedef {Object} BlogFormData
 * @property {string} title
 * @property {string} content
 * @property {string} [excerpt]
 * @property {string[]} [tags]
 * @property {File} [image]
 */

/**
 * @typedef {Object} AnalyticsData
 * @property {number} totalUsers
 * @property {number} totalBlogs
 * @property {number} totalComments
 * @property {number} totalLikes
 * @property {Object[]} recentActivity
 * @property {string} recentActivity[].date
 * @property {number} recentActivity[].users
 * @property {number} recentActivity[].blogs
 * @property {number} recentActivity[].comments
 */
