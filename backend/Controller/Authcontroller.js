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
    return res.status(200).json({ message: "user registered successfully" });
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
      token:token
    });
  }catch(err){
    res.status(500).json({ message:"error while logging in", err:err.message });
  }
}

module.exports = { signup, login };