# Enhanced Blogging Platform Backend

A feature-rich blogging platform backend built with Node.js, Express, and MongoDB.

## 🚀 Features Implemented

### 1. 🔍 Advanced Search & Filtering
- Full-text search across blog titles, content, tags, and categories
- Filter by category and author
- Pagination support
- Sort by relevance, date, popularity

### 2. 👤 User Profiles & Follow System
- Complete user profiles with bio, profile picture, website, location
- Follow/unfollow functionality
- View followers and following lists
- User statistics (blog count, total views, likes)

### 3. 📧 Email Integration
- Welcome emails for new users
- Password reset functionality with email verification
- Professional HTML email templates

### 4. 📱 File Upload System
- Profile picture uploads
- Featured images for blog posts
- Cloudinary integration for image storage
- Image optimization and transformation

### 5. 📊 Analytics & Metrics
- Blog view tracking
- Popular posts analytics
- User engagement statistics
- Category performance metrics

### 8. 📂 Category Management
- Predefined categories for blog organization
- Category-based filtering
- Category statistics and analytics

### 9. 🔖 Bookmarks/Favorites
- Bookmark/unbookmark blog posts
- View saved bookmarks
- Organized bookmark management

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Validation**: Zod
- **Password Hashing**: bcrypt

## 📁 Project Structure

```
backend/
├── Controller/
│   ├── Authcontroller.js      # Authentication & password reset
│   ├── blogcontroller.js      # Blog CRUD, search, analytics
│   ├── commentcontroller.js   # Comment management
│   ├── likecontroller.js      # Like/unlike functionality
│   └── usercontroller.js      # User profiles, follow, bookmarks
├── models/
│   ├── user.js               # User schema with profiles & follows
│   ├── blog.js               # Enhanced blog schema
│   ├── comment.js            # Comment schema
│   └── db.js                 # Database connection
├── services/
│   ├── emailservice.js       # Email functionality
│   └── uploadservice.js      # File upload handling
├── Middleware/
│   └── validation.js         # JWT authentication
├── routes/
│   └── authrouter.js         # All API routes
└── index.js                  # Main server file
```

## 🔧 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blogging-app
   JWT_SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3000
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /user/signup` - User registration with welcome email
- `POST /user/login` - User login
- `POST /user/request-password-reset` - Request password reset
- `POST /user/reset-password` - Reset password with token

### Blog Management
- `POST /user/addblog` - Create blog with image upload
- `GET /user/getallblogs` - Get all blogs with search & filters
- `GET /user/getsingleblog/:id` - Get single blog (tracks views)
- `PUT /user/updateblog/:id` - Update blog
- `DELETE /user/deleteblog/:id` - Delete blog

### User Profiles & Social
- `GET /user/profile/:id?` - Get user profile
- `PUT /user/profile` - Update profile with image upload
- `POST /user/follow/:id` - Follow/unfollow user
- `GET /user/followers/:id` - Get user followers
- `GET /user/following/:id` - Get user following

### Analytics & Insights
- `GET /user/popular-posts` - Get popular blog posts
- `GET /user/user-stats` - Get user analytics
- `GET /user/categories` - Get category statistics

### Bookmarks & Favorites
- `POST /user/bookmark/:id` - Bookmark/unbookmark blog
- `GET /user/bookmarks` - Get user bookmarks

### Comments & Interactions
- `POST /user/addcomment/:id` - Add comment
- `PUT /user/editcomment/:id` - Edit comment
- `DELETE /user/deletecomment/:id` - Delete comment
- `GET /user/getallcomments/:id` - Get blog comments
- `PUT /user/likes/:id` - Like/unlike blog

## 🔥 Key Features for Resume

1. **Scalable Architecture**: Modular controller-service pattern
2. **Advanced Search**: Full-text search with MongoDB text indexes
3. **File Upload System**: Cloudinary integration with image optimization
4. **Email Integration**: Professional email templates and notifications
5. **Analytics Dashboard**: User engagement and content performance metrics
6. **Social Features**: Follow system and user interactions
7. **Security**: JWT authentication, password hashing, input validation
8. **Database Design**: Efficient MongoDB schemas with relationships

## 🚀 Performance Features

- Text indexing for fast search
- Pagination for large datasets
- Image optimization and CDN delivery
- View tracking and analytics
- Efficient database queries with population

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation with Zod
- File type validation for uploads
- Protected routes with middleware

This enhanced backend demonstrates full-stack development skills, database design, third-party integrations, and modern web development practices perfect for showcasing in your resume!
