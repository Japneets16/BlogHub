const Usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod");
const emailservice = require("../services/emailservice"); //feature 3: email integration*

const signup = async (req, res) => {
  const body = req.body;

  //use the zod
  const validate = z.object({
    name: z.string().min(1, "name should be atleast 1 character long"),
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

    const { name, email, password } = checkparse.data;

  try {
    // check for the existing user
    const existinguser = await Usermodel.findOne({email});
    if (existinguser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash the password before saving it
    const hashedpassword = await bcrypt.hash(password, 10);
    // then signup the user
    const newuser = new Usermodel({
      name,
      email,
      password: hashedpassword,
    });

    await newuser.save();

    // feature 3: send welcome email*
    await emailservice.sendWelcomeEmail(email, name);

    // jwtverification*
    const secretkey = "jpsingh";
    const token = jwt.sign(
      {
        id: newuser._id,
        email: newuser.email,
      },
      secretkey,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "user registered successfully",
      token:token
    });
  } catch (err) {
    return res.status(500).json({
      message: "user is not created",
      err: err.message,
    });
  }
};



// for the login part, you will need to validate the request body using zod and then compare the password using bcrypt
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


  try{

    //check for the existing user
    const existinguser = await Usermodel.findOne({ email });
    if(!existinguser){
      return res.status(404).json({
        message:"signup first",
      })
    };
  
  
    //compare the password
    bcrypt.compare(password,existinguser.password,(err,result)=>{
      if(err){
        return res.status(500).json({
          message:"error while comparing password",
          err:err.message,
        })
      }
  
      if(!result){
        return res.status(401).json({
          message:"invalid password",
        })
      }
  
      // jwt verification
      const secretkey = "jpsingh";
      const token = jwt.sign(
        {
          id: existinguser._id,
          email: existinguser.email,
        },
        secretkey,
        { expiresIn: "1h" }
      );
  
      return res.status(200).json({
        message: "user logged in successfully",
        token:token
      });
    })
  }catch(err){
    res.status(500).json({
      message:"error while logging in",
      err:err.message
    })
  }
}

// feature 3: password reset request*
const requestPasswordReset = async (req, res) => {
  const body = req.body;

  const validate = z.object({
    email: z.string().email(),
  });

  const checkparse = validate.safeParse(body);
  if (!checkparse.success) {
    return res.status(400).json({
      message: "Validation failed",
      checkparse: checkparse.error,
    });
  }

  const { email } = checkparse.data;

  try {
    // check if user exists*
    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // generate reset token*
    const resetToken = jwt.sign(
      { userId: user._id },
      "jpsingh",
      { expiresIn: "1h" }
    );

    // save reset token to user*
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour*
    await user.save();

    // send reset email*
    await emailservice.sendPasswordResetEmail(email, resetToken);

    return res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error sending password reset email",
      err: err.message,
    });
  }
};

// feature 3: reset password*
const resetPassword = async (req, res) => {
  const body = req.body;

  const validate = z.object({
    token: z.string(),
    newPassword: z.string().min(8, "password should be atleast 8 characters long"),
  });

  const checkparse = validate.safeParse(body);
  if (!checkparse.success) {
    return res.status(400).json({
      message: "Validation failed",
      checkparse: checkparse.error,
    });
  }

  const { token, newPassword } = checkparse.data;

  try {
    // verify token*
    const decoded = jwt.verify(token, "jpsingh");
    
    // find user with token*
    const user = await Usermodel.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // hash new password*
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user password*
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error resetting password",
      err: err.message,
    });
  }
};

module.exports = {
  signup,
  login,
  requestPasswordReset,
  resetPassword
};
