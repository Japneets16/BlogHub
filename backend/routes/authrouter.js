const express = require('express');
const router = express.Router();

// Middlewares
const {authMiddleware} = require('../Middleware/validation');

// Controllers
const {signup,login} = require('../Controller/Authcontroller');
const {addblog,updateblog,deleteblog,getallblogs,getsingleblog} = require('../Controller/blogcontroller');
// const { authMiddleware } = require('../Middleware/validation');
const {addcomment,editcomment, deletecomment,getallcomments} = require('../Controller/commentcontroller');
const likes = require('../Controller/likecontroller');

// 🧾 Auth Routes
router.post('/signup', signup);
router.post('/login', login);

// // 📝 Blog Routes
router.post('/addblog',authMiddleware, addblog);
router.put('/updateblog/:id', authMiddleware, updateblog);
router.post('/deleteblog/:id', authMiddleware, deleteblog);
router.get('/getallblogs', getallblogs);
router.get('/getsingleblog/:id', getsingleblog); // optional: get blog by ID

// // 💬 Comment Routes
router.post('/addcomment/:id', authMiddleware, addcomment); // :id => blog ID
router.put('/editcomment/:id', authMiddleware, editcomment); // :id => comment ID
router.delete('/deletecomment/:id', authMiddleware, deletecomment);
router.get('/getallcomments/:id', getallcomments); // :id => blog ID

// // ❤️ Like Route
router.put('/likes/:id', authMiddleware, likes); // :id => blog ID

module.exports = router;
