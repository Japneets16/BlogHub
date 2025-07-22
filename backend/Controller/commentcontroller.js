const commentmodel = require("../models/comment");
const blogmodel = require("../models/blog");
const Notification = require("../models/notification");
const Usermodel = require("../models/user");

// Add comment (supports nested, sends notification)
const addcomment = async(req,res)=>{
    try{
        const blogid = req.params.id;
        const body = req.body;
        const findblog = await blogmodel.findById(blogid);
        if(!findblog){
            return res.status(404).json({ message:"blog not found" });
        }
        const newcomment = new commentmodel({
            comment:body.comment,
            author:req.user._id,
            blog:blogid,
            createdAt: new Date(),
            parentComment: body.parentComment || null
        });
        await newcomment.save();
        // Notify blog author (in-app)
        if (findblog.author.toString() !== req.user._id.toString()) {
            await Notification.create({
                user: findblog.author,
                message: `New comment on your blog "${findblog.title}"`
            });
        }
        return res.status(200).json({
            message:"comment added successfully",
            comment:newcomment
        });
    }catch(err){
        return res.status(500).json({ message: "error while adding comment", err: err.message });
    }
}

// Edit comment (author only)
const editcomment = async(req,res)=>{
    try{
        const body = req.body;
        const commentid = req.params.id;
        const findcomment = await commentmodel.findById(commentid);
        if(!findcomment){
            return res.status(404).json({ message:"comment not found" });
        }
        if(findcomment.author.toString()!== req.user._id.toString()){
            return res.status(403).json({ message:"unauthorized user" });
        }
        findcomment.comment = body.comment;
        await findcomment.save();
        return res.status(200).json({
            message:"comment updated successfully",
            comment:findcomment
        });
    }catch(err){
        return res.status(500).json({ message: "error while editing comment", err: err.message });
    }
}

// Delete/hide comment (author or admin)
const deletecomment= async(req,res)=>{
    try {
        const commentid = req.params.id;
        const comment = await commentmodel.findById(commentid);
        if (!comment) {
            return res.status(404).json({ message:"comment not found" });
        }
        // Author can delete, admin can hide
        if (comment.author.toString() === req.user._id.toString() || req.user.role === 'admin') {
            if (req.user.role === 'admin' && comment.author.toString() !== req.user._id.toString()) {
                comment.isHidden = true;
                await comment.save();
                return res.status(200).json({ message:"comment hidden by admin" });
            } else {
                await commentmodel.findByIdAndDelete(commentid);
                return res.status(200).json({ message:"comment deleted successfully" });
            }
        } else {
            return res.status(403).json({ message:"forbidden" });
        }
    } catch (err) {
        return res.status(500).json({ message: "error while deleting/hiding comment", err: err.message });
    }
}

// Get all comments for a blog (nested)
const getallcomments  = async(req,res)=>{
    try{
        const blogid= req.params.id;
        const findblog = await blogmodel.findById(blogid);
        if(!findblog){
            return res.status(400).json({ message:"blog not found" });
        }
        // Find all comments, populate author, and nest replies
        const allcomments = await commentmodel.find({blog:blogid, parentComment: null, isHidden: false})
            .sort({createdAt:-1})
            .populate('author', 'name');
        // Helper to get replies
        const getReplies = async (parentId) => {
            return await commentmodel.find({parentComment: parentId, isHidden: false})
                .sort({createdAt:1})
                .populate('author', 'name');
        };
        // Attach replies to each top-level comment
        for (let comment of allcomments) {
            comment = comment.toObject();
            comment.replies = await getReplies(comment._id);
        }
        return res.status(200).json({
            message:"all comments for this blog",
            comments:allcomments
        });
    }catch(err){
        return res.status(500).json({ message: "error while getting all comments", err: err.message });
    }
}

module.exports = {addcomment, editcomment, deletecomment, getallcomments};
