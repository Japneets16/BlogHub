const express = require('express');
const router = express.Router();

// Middlewares*
const {authMiddleware} = require('../Middleware/validation');
const uploadservice = require('../services/uploadservice'); //feature 4: file upload*

// Controllers*
const {signup,login,requestPasswordReset,resetPassword} = require('../Controller/Authcontroller');
const {addblog,updateblog,deleteblog,getallblogs,getsingleblog,getPopularPosts,getUserStats,getCategories} = require('../Controller/blogcontroller');
const {addcomment,editcomment, deletecomment,getallcomments} = require('../Controller/commentcontroller');
const likes = require('../Controller/likecontroller');
const {getUserProfile,updateUserProfile,followUser,getUserFollowers,getUserFollowing,bookmarkBlog,getUserBookmarks} = require('../Controller/usercontroller'); //feature 2 & 9*

// 🧾 Auth Routes*
router.post('/signup', signup);
router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset); //feature 3: password reset*
router.post('/reset-password', resetPassword); //feature 3: password reset*

// 📝 Blog Routes*
router.post('/addblog', authMiddleware, uploadservice.upload.single('featuredImage'), addblog); //feature 4: with image upload*
router.put('/updateblog/:id', authMiddleware, updateblog);
router.post('/deleteblog/:id', authMiddleware, deleteblog);
router.get('/getallblogs', getallblogs); //feature 1: with search and filtering*
router.get('/getsingleblog/:id', getsingleblog); //with view tracking*

// 💬 Comment Routes*
router.post('/addcomment/:id', authMiddleware, addcomment); // :id => blog ID*
router.put('/editcomment/:id', authMiddleware, editcomment); // :id => comment ID*
router.delete('/deletecomment/:id', authMiddleware, deletecomment);
router.get('/getallcomments/:id', getallcomments); // :id => blog ID*

// ❤️ Like Route*
router.put('/likes/:id', authMiddleware, likes); // :id => blog ID*

// 📊 Analytics Routes - feature 5*
router.get('/popular-posts', getPopularPosts); //get popular posts*
router.get('/user-stats', authMiddleware, getUserStats); //get user analytics*

// 📂 Category Routes - feature 8*
router.get('/categories', getCategories); //get all categories with stats*

// 👤 User Profile Routes - feature 2*
router.get('/profile/:id', getUserProfile); //get user profile*
router.get('/profile', authMiddleware, getUserProfile); //get own profile*
router.put('/profile', authMiddleware, uploadservice.upload.single('profilePicture'), updateUserProfile); //update profile with image*
router.post('/follow/:id', authMiddleware, followUser); //follow/unfollow user*
router.get('/followers/:id', getUserFollowers); //get user followers*
router.get('/following/:id', getUserFollowing); //get user following*

// 🔖 Bookmark Routes - feature 9*
router.post('/bookmark/:id', authMiddleware, bookmarkBlog); //bookmark/unbookmark blog*
router.get('/bookmarks', authMiddleware, getUserBookmarks); //get user bookmarks*

module.exports = router;
