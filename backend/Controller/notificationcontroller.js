const Notification = require("../models/notification");

// Get notifications for logged-in user
const getNotifications = async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ notifications });
};

// Mark notification as read
const markAsRead = async (req, res) => {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: "Notification marked as read" });
};

module.exports = { getNotifications, markAsRead };