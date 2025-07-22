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
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Virtual for follower count
userschema.virtual('followerCount').get(function() {
    return this.followers.length;
});

// Virtual for following count
userschema.virtual('followingCount').get(function() {
    return this.following.length;
});

const Usermodel = mongoose.model('User', userschema);

module.exports = Usermodel;