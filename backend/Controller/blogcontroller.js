const blogmodel = require("../models/blog");
const z = require("zod");
// const uploadservice = require("../services/uploadservice"); //feature 4: file upload*

const addblog = async (req, res) => {
  try {
    const body = req.body;

    const validate = z.object({
      title: z.string().min(1, "Title should be at least 1 character long"),
      content: z.string().min(1, "Content should be at least 1 character long"),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(), //feature 8: category*
    });

    const checkparse = validate.safeParse(body);
    if (!checkparse.success) {
      return res.status(400).json({
        message: "Validation failed",
        checkparse: checkparse.error.errors,
      });
    }

    const { title, content, tags, category } = checkparse.data;

    // feature 4: handle image upload if present*
    let featuredImageUrl = null;
    // if (req.file) {
    //   const uploadResult = await uploadservice.uploadToCloudinary(req.file.buffer, 'blog-posts');
    //   featuredImageUrl = uploadResult.secure_url;
    // }

    // add the new blog*
    const newblog = new blogmodel({
      title,
      content,
      author: req.user.id, // assuming user id is stored in req.user._id*
      tags: tags || [],
      category: category || 'Other', //feature 8: category*
      featuredImage: featuredImageUrl, //feature 4: featured image*
      createdAt: new Date(),
    });

    await newblog.save();
    //populate the user field with the blog id*
    //this will take the author details and add it to the blog with the name of the user*
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


//delete the blog*
const deleteblog= async(req,res)=>{
    try{
        const blogid = req.params.id;
        //find the blog with the given id*
        const find  = await blogmodel.findByIdAndDelete(blogid);
        if(!find){
            return res.status(404).json({
                message:"blog not found"
            });
        }

        return res.status(200).json({
            message:"Blog deleted successfully"
        });
    }catch(err){
        res.status(500).json({
            message:"Error while deleting blog",
            err:err.message
        });
    }
}


// feature 1: get all posts with search and filtering*
const getallblogs = async(req,res)=>{
    try{
        const { search, category, author, page = 1, limit = 10 } = req.query;
        
        // build search query*
        let query = {};
        
        // feature 1: text search*
        if (search) {
            query.$text = { $search: search };
        }
        
        // feature 8: category filter*
        if (category && category !== 'All') {
            query.category = category;
        }
        
        // author filter*
        if (author) {
            query.author = author;
        }
        
        // pagination*
        const skip = (page - 1) * limit;
        
        // get blogs with filters*
        const blogs = await blogmodel
            .find(query)
            .populate("author", "name profilePicture")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        // get total count for pagination*
        const totalBlogs = await blogmodel.countDocuments(query);
        
        return res.status(200).json({
            message: "All blogs fetched successfully",
            blogs: blogs,
            totalBlogs: totalBlogs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalBlogs / limit)
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error fetching blogs",
            err: err.message
        });
    }
}


//get single post with view tracking*
const getsingleblog = async(req,res)=>{
    try{
        const blogid = req.params.id;
        
        //find the blog with the given id*
        const find = await blogmodel.findById(blogid).populate("author", "name profilePicture bio");
        if(!find){
            return res.status(404).json({
                message:"blog not found"
            });
        }

        // feature 5: increment view count*
        find.views += 1;
        await find.save();

        return res.status(200).json({
            message:"single blog is here",
            blog:find
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error fetching blog",
            err: err.message
        });
    }
}




// feature 5: analytics - get popular posts*
const getPopularPosts = async(req,res) => {
    try{
        const { limit = 10 } = req.query;
        
        // get posts sorted by views and likes*
        const popularPosts = await blogmodel
            .find({})
            .populate("author", "name profilePicture")
            .sort({ views: -1, likes: -1 })
            .limit(parseInt(limit));
            
        return res.status(200).json({
            message: "Popular posts fetched successfully",
            posts: popularPosts
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error fetching popular posts",
            err: err.message
        });
    }
};

// feature 5: analytics - get user stats*
const getUserStats = async(req,res) => {
    try{
        const userId = req.user.id;
        
        // get user's blog stats*
        const userBlogs = await blogmodel.find({ author: userId });
        const totalViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
        const totalLikes = userBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);
        
        const stats = {
            totalBlogs: userBlogs.length,
            totalViews: totalViews,
            totalLikes: totalLikes,
            averageViews: userBlogs.length > 0 ? Math.round(totalViews / userBlogs.length) : 0
        };
        
        return res.status(200).json({
            message: "User stats fetched successfully",
            stats: stats
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error fetching user stats",
            err: err.message
        });
    }
};

// feature 8: get all categories with post counts*
const getCategories = async(req,res) => {
    try{
        // get category stats*
        const categoryStats = await blogmodel.aggregate([
            {
                $group: {
                    _id: '$category',
                    postCount: { $sum: 1 },
                    totalViews: { $sum: '$views' }
                }
            },
            { $sort: { postCount: -1 } }
        ]);
        
        return res.status(200).json({
            message: "Categories fetched successfully",
            categories: categoryStats
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error fetching categories",
            err: err.message
        });
    }
};

module.exports = { 
    addblog, 
    updateblog,
    deleteblog, 
    getallblogs,
    getsingleblog,
    getPopularPosts,
    getUserStats,
    getCategories
};
