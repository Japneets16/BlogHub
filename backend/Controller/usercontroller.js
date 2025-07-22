const Usermodel = require("../models/user");
const blogmodel = require("../models/blog");
const z = require("zod");
// const uploadservice = require("../services/uploadservice"); //feature 4: file upload*

// feature 2: get user profile*
const getUserProfile = async(req,res) => {
    try{
        const userId = req.params.id || req.user.id;
        
        // find user by id*
        const user = await Usermodel.findById(userId)
            .populate("followers", "name profilePicture")
            .populate("following", "name profilePicture")
            .populate("bookmarks", "title featuredImage createdAt")
            .select("-password -resetPasswordToken");
            
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        // get user's blog count*
        const blogCount = await blogmodel.countDocuments({ author: userId });
        
        // get user's total views and likes*
        const userBlogs = await blogmodel.find({ author: userId });
        const totalViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
        const totalLikes = userBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);
        
        const userProfile = {
            ...user._doc,
            blogCount: blogCount,
            totalViews: totalViews,
            totalLikes: totalLikes,
            followerCount: user.followers.length,
            followingCount: user.following.length
        };
        
        return res.status(200).json({
            message: "User profile fetched successfully",
            user: userProfile
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error fetching user profile",
            err: err.message
        });
    }
};

// feature 2: update user profile*
const updateUserProfile = async(req,res) => {
    try{
        const body = req.body;
        const userId = req.user.id;
        
        const validate = z.object({
            name: z.string().min(1).optional(),
            bio: z.string().max(500).optional(),
            website: z.string().optional(),
            location: z.string().optional()
        });
        
        const checkparse = validate.safeParse(body);
        if(!checkparse.success){
            return res.status(400).json({
                message: "Validation failed",
                checkparse: checkparse.error
            });
        }
        
        // feature 4: handle profile picture upload*
        let profilePictureUrl = null;
        // if(req.file){
        //     const uploadResult = await uploadservice.uploadToCloudinary(req.file.buffer, 'profile-pictures');
        //     profilePictureUrl = uploadResult.secure_url;
        // }
        
        // update user profile*
        const updateData = { ...checkparse.data };
        if(profilePictureUrl){
            updateData.profilePicture = profilePictureUrl;
        }
        
        const updatedUser = await Usermodel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password -resetPasswordToken");
        
        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error updating profile",
            err: err.message
        });
    }
};

// feature 2: follow user*
const followUser = async(req,res) => {
    try{
        const targetUserId = req.params.id;
        const currentUserId = req.user.id;
        
        // check if trying to follow self*
        if(targetUserId === currentUserId){
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }
        
        // find both users*
        const targetUser = await Usermodel.findById(targetUserId);
        const currentUser = await Usermodel.findById(currentUserId);
        
        if(!targetUser){
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        // check if already following*
        const isFollowing = currentUser.following.includes(targetUserId);
        
        if(isFollowing){
            // unfollow*
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUserId);
            
            await currentUser.save();
            await targetUser.save();
            
            return res.status(200).json({
                message: "User unfollowed successfully"
            });
        } else {
            // follow*
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
            
            await currentUser.save();
            await targetUser.save();
            
            return res.status(200).json({
                message: "User followed successfully"
            });
        }
        
    }catch(err){
        return res.status(500).json({
            message: "Error following/unfollowing user",
            err: err.message
        });
    }
};

// feature 2: get user's followers*
const getUserFollowers = async(req,res) => {
    try{
        const userId = req.params.id;
        
        const user = await Usermodel.findById(userId)
            .populate("followers", "name profilePicture bio")
            .select("followers");
            
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            message: "Followers fetched successfully",
            followers: user.followers
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error fetching followers",
            err: err.message
        });
    }
};

// feature 2: get user's following*
const getUserFollowing = async(req,res) => {
    try{
        const userId = req.params.id;
        
        const user = await Usermodel.findById(userId)
            .populate("following", "name profilePicture bio")
            .select("following");
            
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            message: "Following fetched successfully",
            following: user.following
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error fetching following",
            err: err.message
        });
    }
};

// feature 9: bookmark blog post*
const bookmarkBlog = async(req,res) => {
    try{
        const blogId = req.params.id;
        const userId = req.user.id;
        
        // check if blog exists*
        const blog = await blogmodel.findById(blogId);
        if(!blog){
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        
        // find user*
        const user = await Usermodel.findById(userId);
        
        // check if already bookmarked*
        const isBookmarked = user.bookmarks.includes(blogId);
        
        if(isBookmarked){
            // remove bookmark*
            user.bookmarks.pull(blogId);
            await user.save();
            
            return res.status(200).json({
                message: "Blog removed from bookmarks"
            });
        } else {
            // add bookmark*
            user.bookmarks.push(blogId);
            await user.save();
            
            return res.status(200).json({
                message: "Blog bookmarked successfully"
            });
        }
        
    }catch(err){
        return res.status(500).json({
            message: "Error bookmarking blog",
            err: err.message
        });
    }
};

// feature 9: get user's bookmarks*
const getUserBookmarks = async(req,res) => {
    try{
        const userId = req.user.id;
        
        const user = await Usermodel.findById(userId)
            .populate({
                path: "bookmarks",
                populate: {
                    path: "author",
                    select: "name profilePicture"
                }
            })
            .select("bookmarks");
            
        return res.status(200).json({
            message: "Bookmarks fetched successfully",
            bookmarks: user.bookmarks
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Error fetching bookmarks",
            err: err.message
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    followUser,
    getUserFollowers,
    getUserFollowing,
    bookmarkBlog,
    getUserBookmarks
};
