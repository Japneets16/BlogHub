const Usermodel = require("../models/user");
const blogmodel = require("../models/blog");
const commentmodel = require("../models/comment");

// List all users (admin only)
const listUsers = async (req, res) => {
    const users = await Usermodel.find({}, "-password");
    res.json({ users });
};

// Promote user to editor/admin (admin only)
const promoteUser = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!['editor', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }
    const user = await Usermodel.findByIdAndUpdate(id, { role }, { new: true });
    res.json({ message: "User promoted", user });
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
    const { id } = req.params;
    await Usermodel.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
};

// Analytics: counts
const analytics = async (req, res) => {
    const userCount = await Usermodel.countDocuments();
    const blogCount = await blogmodel.countDocuments();
    const commentCount = await commentmodel.countDocuments();
    res.json({ userCount, blogCount, commentCount });
};

module.exports = { listUsers, promoteUser, deleteUser, analytics };