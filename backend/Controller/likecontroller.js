const blogmodel = require("../models/blog");

const likes = async (req, res) => {
  try {
    //get the blog id*

    const blogid = req.params.id;

    // user id is also reqd to check that which user liked the post*

    const userid = req.user._id;

    const blog = await blogmodel.findById(blogid);

    if (!blog) {
      return res.status(404).json({
        message: "blog is no there",
      });
    }

    // Initialize likes array if it doesn't exist (fix for undefined case)*

    if (!blog.likes) {
      blog.likes = [];
    }

    // to check that the post is already liked*

    //blog.likes is the array that checks that userid , that user is there in the likes or not*

    const checklikes = blog.likes.includes(userid);

    // console.log(checklikes);ls*

    if (!checklikes) {
      // if not liked then add the user to the like array*

      blog.likes.push(userid);

      await blog.save();

      return res.status(200).json({
        message: "post liked successfully",
      });
    } else {
      // if already liked then pull the like*

      blog.likes.pull(userid);

      await blog.save();

      return res.status(200).json({
        message: "post disliked successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "some error is there ",

      err: err.message,
    });
  }
};

module.exports = likes;
