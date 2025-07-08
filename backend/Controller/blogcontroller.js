const blogmodel = require("../models/blog");
const z = require("zod");

const addblog = async (req, res) => {
  try {
    const body = req.body;

    const validate = z.object({
      title: z.string().min(1, "Title should be at least 1 character long"),
      content: z.string().min(1, "Content should be at least 1 character long"),
      tags: z.array(z.string()).optional(),
    });

    const checkparse = validate.safeParse(body);
    if (!checkparse.success) {
      return res.status(400).json({
        message: "Validation failed",
        checkparse: checkparse.error.errors,
      });
    }

    const { title, content, tags } = checkparse.data;

    // add the new blog
    const newblog = new blogmodel({
      title,
      content,
      author: req.user.id, // assuming user id is stored in req.user._id
      tags: tags || [],
      createdAt: new Date(),
    });

    await newblog.save();
    //populate the user field with the blog id
    //this will take the author details and add it to the blog with the name of the user
    await newblog.populate("author", "name");

    return res.status(200).json({
      message: "blog added successfully",
      blog: newblog,
    });
  } catch (err) {
    return res.status(500).json({
      message: "error while adding blog",
      err: err.message,
    });
  }
};

// update he blog

const updateblog = async (req, res) => {
  try {
    const body = req.body;
    const blogid = req.params.id;

    const validate = z.object({
      title: z.string().min(1, "Title should be at least 1 character long"),
      content: z.string().min(1, "Content should be at least 1 character long"),
      tags: z.array(z.string()).optional(),
    });

    const checkparse = validate.safeParse(body);
    if (!checkparse.success) {
      return res.status(400).json({
        message: "Validation failed",
        checkparse: checkparse.error.errors,
      });
    }

    const { title, content, tags } = checkparse.data;
    // find the blog with the given id

    const find = await blogmodel.findByIdAndUpdate(
        blogid,
      checkparse.data,
      { new: true }
    );

    if (!find) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    //populate the user field with the blog id
    await find.populate("author", "name");

    return res.status(200).json({
      message: "Blog updated successfully",
      blog: find
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating blog",
      err: err.message,
    });
  }
};


//delete the blog 
const deleteblog= async(req,res)=>{
    try{
        const blogid = req.params.id;
        //find the blog with the given id 
        const find  = await blogmodel.findIdAndDelete(blogid);
        if(!find){
            return res.status(404).json({
                message:"blog not found"
            })
        }

        return res.status(200).json({
            message:"Blog deleted successfully"
        })
    }catch(err){
        res.status(500).json({
            message:"Error while deleting blog",
            err:err.message
        })
    }
}


// get all posts 

const getallblogs = async(req,res)=>{
    const find  = await blogmodel.findOne({}, null, {sort: {createdAt: -1}});
    if(!find){
        return res.status(404).json({
            message:"No blog found"
        })
    }

    return res.status(200).json({
        message:"all the posts  are here ",
        blog:find
    });
}


//get single post 
const getsingleblog = async(req,res)=>{
    const blogid = req.params.id;
    //find the blog with the given id 
    const find  = await blogmodel.findById(blogid);
    if(!find){
        return res.status(404).json({
            message:"blog not found"
        })
    }

    return res.status(200).json({
        message:"single blog  is here ",
        blog:find
    });
}




module.exports = { addblog, updateblog,deleteblog, getallblogs,getallblogs ,getsingleblog};
