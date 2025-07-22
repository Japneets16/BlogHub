const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    color: {
        type: String,
        default: '#3498db'
    },
    icon: {
        type: String
    },
    postCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Pre-save middleware to capitalize category name
categorySchema.pre('save', function(next) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
