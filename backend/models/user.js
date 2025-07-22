const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // feature 2: user profile fields*
    bio: {
        type: String,
        maxlength: 500
    },
    profilePicture: {
        type: String,
        default: null
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    // feature 2: follow system*
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // feature 3: email verification*
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    // feature 9: bookmarks*
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blogs'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Usermodel = mongoose.model('User', userschema);

module.exports = Usermodel;