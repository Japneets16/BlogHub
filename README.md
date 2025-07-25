

# 📝 BlogHub (Blogging Website)

This is the backend for a blogging website, built with **Node.js**, **Express**, and **MongoDB**. It provides RESTful APIs for user authentication, blog management, comments, likes, notifications, and admin analytics.

---

## 🚀 Features

- 🔐 **User Authentication:** Signup, login (JWT-based), and avatar upload.
- ✍️ **Blog Management:** Create, update, delete, and fetch blogs. Supports image uploads and tags.
- 💬 **Comments:** Add, edit, delete/hide, and fetch nested comments. In-app notifications for new comments.
- ❤️ **Likes:** Like/unlike blogs.
- 🔔 **Notifications:** In-app alerts for user interactions (e.g., new comments).
- 🛠️ **Admin Panel:** List, promote, or delete users. View analytics (user/blog/comment counts).
- 🧑‍⚖️ **Role-based Access:** Admin-only routes for user management and analytics.
- 📁 **File Uploads:** Uses Multer for uploading blog images and avatars.
- 🌐 **CORS Enabled:** For frontend-backend communication.

---

## 🧰 Tech Stack

- ⚙️ **Node.js** & **Express** (API server)
- 🗃️ **MongoDB** & **Mongoose** (Database & ODM)
- 🔑 **JWT** (Authentication)
- 📤 **Multer** (File uploads)
- ✅ **Zod** (Validation)
- ✉️ **Nodemailer** (Email, optional)
- 🛡️ **CORS**

---

## 🛠️ Getting Started

### ✅ Prerequisites

- Node.js (v16+ recommended)
- MongoDB (uses MongoDB Atlas by default, can be changed in `models/db.js`)

### 📦 Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd backend


2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   * MongoDB connection string is currently hardcoded in `models/db.js`. Replace it with your own.

4. Start the server:

   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`.

---

## 📁 Folder Structure

* `Controller/` - Route handlers for auth, blogs, comments, likes, admin, notifications.
* `models/` - Mongoose models & DB connection logic.
* `Middleware/` - Auth and validation logic.
* `routes/` - Defines all API endpoints.
* `uploads/` - Stores uploaded images & avatars.

---

## 📡 API Endpoints

### 🔐 Auth

* `POST /user/signup` - Register a new user
* `POST /user/login` - Login and receive JWT
* `PUT /user/avatar` - Upload/update user avatar (auth required)

### 📝 Blogs

* `POST /user/addblog` - Add a new blog (auth required, supports image upload)
* `PUT /user/updateblog/:id` - Update a blog (auth required)
* `POST /user/deleteblog/:id` - Delete a blog (auth required, author or admin)
* `GET /user/getallblogs` - Get all blogs
* `GET /user/getsingleblog/:id` - Get a single blog by ID

### 💬 Comments

* `POST /user/addcomment/:id` - Add a comment to a blog (auth required)
* `PUT /user/editcomment/:id` - Edit a comment (auth required, author only)
* `DELETE /user/deletecomment/:id` - Delete/hide a comment (auth required, author or admin)
* `GET /user/getallcomments/:id` - Get all comments for a blog (nested)

### ❤️ Likes

* `PUT /user/likes/:id` - Like or unlike a blog (auth required)

### 🛠️ Admin

* `GET /user/admin/users` - List all users (admin only)
* `PUT /user/admin/promote/:id` - Promote user to editor/admin (admin only)
* `DELETE /user/admin/user/:id` - Delete a user (admin only)
* `GET /user/admin/analytics` - Get analytics (user, blog, comment counts) (admin only)

### 🔔 Notifications

* `GET /user/notifications` - Get notifications for logged-in user
* `PUT /user/notifications/:id/read` - Mark notification as read

---


## 📂 Project Architecture
```
backend/
├── Controller/
│ ├── admincontroller.js
│ ├── Authcontroller.js
│ ├── blogcontroller.js
│ ├── commentcontroller.js
│ ├── likecontroller.js
│ └── notificationcontroller.js
├── Middleware/
│ └── validation.js
├── models/
│ ├── blog.js
│ ├── comment.js
│ ├── db.js
│ ├── notification.js
│ └── user.js
├── routes/
│ └── authrouter.js
├── uploads/
│ └── [uploaded files]
├── index.js
├── package.json
├── package-lock.json
└── .gitignore
```

## 📝 Notes

* All protected routes require a valid JWT in the `Authorization` header.
* Uploaded files are served from `/uploads`.
* Update the MongoDB connection string in `models/db.js` for production use.
