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
    // In-app notifications (simple string array for demo)
    notifications: [{
        type: String
    }]
});

const Usermodel = mongoose.model('User',userschema);

module.exports = Usermodel;