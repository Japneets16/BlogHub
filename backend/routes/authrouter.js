const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middlewares
const { authMiddleware, requireRole } = require('../Middleware/validation');

// Controllers
const { signup, login } = require('../Controller/Authcontroller');
const { addblog, updateblog, deleteblog, getallblogs, getsingleblog } = require('../Controller/blogcontroller');
const { addcomment, editcomment, deletecomment, getallcomments } = require('../Controller/commentcontroller');
const likes = require('../Controller/likecontroller');
const admin = require('../Controller/admincontroller');
const notification = require('../Controller/notificationcontroller');

// Auth Routes
router.post('/signup', signup);
router.post('/login', login);

// Blog Routes
router.post('/addblog', authMiddleware, upload.single('image'), addblog);
router.put('/updateblog/:id', authMiddleware, upload.single('image'), updateblog);
router.post('/deleteblog/:id', authMiddleware, deleteblog);
router.get('/getallblogs', getallblogs);
router.get('/getsingleblog/:id', getsingleblog);

// Comment Routes
router.post('/addcomment/:id', authMiddleware, addcomment);
router.put('/editcomment/:id', authMiddleware, editcomment);
router.delete('/deletecomment/:id', authMiddleware, deletecomment);
router.get('/getallcomments/:id', getallcomments);

// Like Route
router.put('/likes/:id', authMiddleware, likes);

// Admin Routes
router.get('/admin/users', authMiddleware, requireRole(['admin']), admin.listUsers);
router.put('/admin/promote/:id', authMiddleware, requireRole(['admin']), admin.promoteUser);
router.delete('/admin/user/:id', authMiddleware, requireRole(['admin']), admin.deleteUser);
router.get('/admin/analytics', authMiddleware, requireRole(['admin']), admin.analytics);

// Notification Routes
router.get('/notifications', authMiddleware, notification.getNotifications);
router.put('/notifications/:id/read', authMiddleware, notification.markAsRead);

module.exports = router;
