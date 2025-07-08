const Usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod");

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



    // // jwtverification
    // const secretkey = "jpsingh";
    // const token = jwt.sign(
    //   {
    //     id: newuser._id,
    //     email: newuser.email,
    //   },
    //   secretkey,
    //   { expiresIn: "1h" }
    // );



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

module.exports =
 {signup,
  login};
