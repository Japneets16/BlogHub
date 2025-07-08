const commentmodel = require("../models/comment");

//to add the comments 
const addcomment = async(req,res)=>{

    try{

        const blogid = req.params.id;
        const body = req.body;

        const findblog = await blogmodel.findById(blogid);
        if(!findblog){
            return res.status(404).json({
                message:"blog not found"
            })
        }

        const newcomment = new commentmodel({
            comment:body.comment,
            author:req.user._id,
            blog:blogid,
            createdAt: new Date(),
        })

        await newcomment.save();

        return res.status(200).json({
            message:"comment added successfully",
            comment:newcomment
        })
    }catch(err){
        return res.status(500).json({
            message: "error while adding comment",
            err: err.message,
        });
    }
}


//to edit the comment 

const editcomment = async(req,res)=>{

    try{

        // const blogid = req.params.id;
        const body = req.body;
        const commentid = req.params.commentid;
    
        //find the comment in the blog using the blogid anad the comment id 
        const findcomment = await commentmodel.findById(commentid);
        if(!findcomment){
            return res.status(404).json({
                message:"comment not found",
            })
        }
    
        //check if the comment belongs to the user who made the request
        if(findcomment.author.toString()!== req.user._id.toString()){
            return res.status(403).json({
                message:"unauthorized user is there to edit this comment",
            })
        }
    
        findcomment.comment = body.comment;
        await findcomment.save();
    
        return res.status(200).json({
            message:"comment updated successfully",
            comment:findcomment
        })
    }catch(err){
        return res.status(500).json({
            message: "error while editing comment",
            err: err.message,
        });
    }

}


//to delete the comment 
const deletecomment= async(req,res)=>{
    const commentid = req.params.id;

    if(!commentid){
        return res.status(400).json({
            message:"Invalid request",
        })
    }
    
    //now delete the comment from the above blog 
    const deleteit = await  commentmodel.findByIdAndDelete(commentid);
    if(!deleteit){
        return res.status(404).json({
            message:"comment not found",
        })
    }
    return res.status(200).json({
        message:"comment deleted successfully",
    })
}


//get all comments for a particular blog
const getallcomments  = async(req,res)=>{

    try{

        const blogid= req.params.id;
    
        const findblog = blogmodel.findById(blogid);
        if(!findblog){
            return res.status(400).json({
                message:"blog not found",
            })
        }
    
        //find all the comments 
        const allcomments = commentmodel.find({blog:blogid}).sort({createdAt:-1});
        return res.status(200).json({
            message:"all comments for this blog",
            comments:allcomments
        })
    }catch(err){
        return res.status(500).json({
            message: "error while getting all comments",
            err: err.message,
        });
    }

}



module.exports = {addcomment, editcomment, deletecomment,getallcomments};



































