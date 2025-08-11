// Update user profile (username and email)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({ message: 'No data provided to update.' });
    }
    // Only update provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    const user = await Usermodel.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating profile', err: err.message });
  }
};
const Usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod");

// Signup: now supports role assignment (admin only)
const signup = async (req, res) => {
  const body = req.body;
  const validate = z.object({
    name: z.string().min(1, "name should be atleast 1 character long"),
    email: z.string().email(),
    password: z.string().min(8, "password should be atleast 8 characters long"),
    role: z.string().optional() // Only admin can set this
  });
  const checkparse = validate.safeParse(body);
  if (!checkparse.success) {
    return res.status(400).json({
      message: "Validation failed",
      checkparse: checkparse.error,
    });
  }
  const { name, email, password, role } = checkparse.data;
  try {
    const existinguser = await Usermodel.findOne({email});
    if (existinguser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const newuser = new Usermodel({
      name,
      email,
      password: hashedpassword,
      role: role && req.user && req.user.role === 'admin' ? role : 'user'
    });
    await newuser.save();
    
    // Generate token for immediate login
    const secretkey = "jpsingh";
    const token = jwt.sign(
      { id: newuser._id, email: newuser.email },
      secretkey,
      { expiresIn: "1h" }
    );
    
    return res.status(200).json({ 
      message: "user registered successfully",
      token: token,
      user: {
        id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        avatar: newuser.avatar,
        role: newuser.role
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "user is not created", err: err.message });
  }
};

// Login: returns JWT
const login = async (req, res) => {
  const body = req.body;
  const validate = z.object({
    email: z.string().email(),
    password: z.string().min(8, "password should be atleast 8 characters long"),
  });
  const checkparse = validate.safeParse(body);
  if (!checkparse.success) {
    return res.status(400).json({
      message: "Validation failed",
      checkparse: checkparse.error,
    });
  }
  const { email, password } = checkparse.data;
  try {
    const existinguser = await Usermodel.findOne({ email });
    if(!existinguser){
      return res.status(404).json({ message:"signup first" });
    }
    const result = await bcrypt.compare(password, existinguser.password);
    if(!result){
      return res.status(401).json({ message:"invalid password" });
    }
    const secretkey = "jpsingh";
    const token = jwt.sign(
      { id: existinguser._id, email: existinguser.email },
      secretkey,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      message: "user logged in successfully",
      token: token,
      user: {
        id: existinguser._id,
        name: existinguser.name,
        email: existinguser.email,
        avatar: existinguser.avatar,
        role: existinguser.role
      }
    });
  }catch(err){
    res.status(500).json({ message:"error while logging in", err:err.message });
  }
}

// Avatar upload/update
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const userId = req.user._id;
    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await Usermodel.findByIdAndUpdate(userId, { avatar: avatarPath }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'Avatar updated', avatar: user.avatar });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating avatar', err: err.message });
  }
};

// Get current user data
const getCurrentUser = async (req, res) => {
  try {
    const user = await Usermodel.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching user data', err: err.message });
  }
};

module.exports = { signup, login, updateAvatar, getCurrentUser, updateProfile };