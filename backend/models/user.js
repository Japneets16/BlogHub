const mongoose = require('mongoose');

const userschema  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,    
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    // Role-based access: user, editor, admin
    role: {
        type: String,
        enum: ['user', 'editor', 'admin'],
        default: 'user',
    },
    // Avatar image path or URL
    avatar: {
        type: String,
        default: ''
    },
    // Notifications removed
}, {
    timestamps: true // This will add createdAt and updatedAt fields automatically
});

const Usermodel = mongoose.model('User',userschema);

module.exports = Usermodel;