const blogmodel = require("../models/blog");
const z = require("zod");
const path = require("path");

// Add blog (supports Markdown/HTML, image upload)
const addblog = async (req, res) => {
  try {
    const body = req.body;
    const validate = z.object({
      title: z.string().min(1, "Title should be at least 1 character long"),
      content: z.string().min(1, "Content should be at least 1 character long"),
      tags: z.union([z.array(z.string()), z.string()]).optional(),
    });
    const checkparse = validate.safeParse(body);
    if (!checkparse.success) {
      return res.status(400).json({
        message: "Validation failed",
        checkparse: checkparse.error.errors,
      });
    }
    const { title, content, tags } = checkparse.data;
    // Handle image upload (if any)
    let imagePath = null;
    if (req.file) {
      // Ensure forward slashes for URL compatibility across all operating systems
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    // Handle tags - they might come as a JSON string from FormData
    let processedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          processedTags = JSON.parse(tags);
        } catch (e) {
          processedTags = [];
        }
      } else if (Array.isArray(tags)) {
        processedTags = tags;
      }
    }
    
    const newblog = new blogmodel({
      title,
      content, // Markdown/HTML supported
      author: req.user._id,
      tags: processedTags,
      createdAt: new Date(),
      image: imagePath
    });
    await newblog.save();
    await newblog.populate("author", "name _id");
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

// Update blog
const updateblog = async (req, res) => {
  try {
    const body = req.body;
    const blogid = req.params.id;
    const validate = z.object({
      title: z.string().min(1, "Title should be at least 1 character long"),
      content: z.string().min(1, "Content should be at least 1 character long"),
      tags: z.union([z.array(z.string()), z.string()]).optional(),
    });
    const checkparse = validate.safeParse(body);
    if (!checkparse.success) {
      return res.status(400).json({
        message: "Validation failed",
        checkparse: checkparse.error.errors,
      });
    }
    const { title, content, tags } = checkparse.data;
    let updateData = { title, content, tags };
    if (req.file) {
      // Ensure forward slashes for URL compatibility across all operating systems
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const find = await blogmodel.findByIdAndUpdate(
        blogid,
      updateData,
      { new: true }
    );
    if (!find) {
      return res.status(404).json({ message: "Blog not found" });
    }
    await find.populate("author", "name _id");
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

// Delete blog (admin or author)
const deleteblog= async(req,res)=>{
    try{
        const blogid = req.params.id;
        const find  = await blogmodel.findById(blogid);
        if(!find){
            return res.status(404).json({ message:"blog not found" });
        }
        // Only author or admin can delete
        if (find.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden" });
        }
        await blogmodel.findByIdAndDelete(blogid);
        return res.status(200).json({ message:"Blog deleted successfully" });
    }catch(err){
        res.status(500).json({ message:"Error while deleting blog", err:err.message });
    }
}

// Get all blogs (with search, filter, and analytics)
const getallblogs = async(req,res)=>{
    try {
        const { search, tag } = req.query;
        let query = {};
        if (search) {
            query.$text = { $search: search };
        }
        if (tag) {
            query.tags = tag;
        }
        const blogs = await blogmodel.find(query)
            .populate("author", "name email avatar _id")
            .sort({createdAt: -1});
        return res.status(200).json({
            message:"all the posts are here",
            blogs
        });
    } catch (err) {
        return res.status(500).json({ message: "error fetching blogs", err: err.message });
    }
}

// Get single blog (increments view count)
const getsingleblog = async(req,res)=>{
    try {
        const blogid = req.params.id;
        const find  = await blogmodel.findByIdAndUpdate(
            blogid,
            { $inc: { views: 1 } },
            { new: true }
        ).populate("author", "name email avatar _id");
        if(!find){
            return res.status(404).json({ message:"blog not found" });
        }
        return res.status(200).json({
            message:"single blog is here",
            blog:find
        });
    } catch (err) {
        return res.status(500).json({ message: "error fetching blog", err: err.message });
    }
}

// Get user's blogs
const getuserblogs = async(req,res)=>{
    try {
        const userid = req.params.userid || req.user._id;
        const blogs = await blogmodel.find({ author: userid })
            .populate("author", "name email avatar _id")
            .sort({createdAt: -1});
        return res.status(200).json({
            message:"user blogs fetched successfully",
            blogs
        });
    } catch (err) {
        return res.status(500).json({ message: "error fetching user blogs", err: err.message });
    }
}

module.exports = { addblog, updateblog, deleteblog, getallblogs, getsingleblog, getuserblogs };