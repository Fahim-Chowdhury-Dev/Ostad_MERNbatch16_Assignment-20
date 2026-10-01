const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const User = require("../models/User");

const createBlog = async (req, res, next) => {
  try {
    const { title, content, tags, blogImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "title and content are required."
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const blog = await Blog.create({
      title,
      content,
      author: user._id,
      authorName: user.name,
      tags: Array.isArray(tags) ? tags : [],
      blogImage: blogImage || ""
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog
    });
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    next(error);
  }
};

const getSingleBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID."
      });
    }

    const blog = await Blog.findById(id).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID."
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own blog."
      });
    }

    const { title, content, tags, blogImage } = req.body;

    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (tags !== undefined) {
      blog.tags = Array.isArray(tags) ? tags : [];
    }
    if (blogImage !== undefined) blog.blogImage = blogImage;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID."
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own blog."
      });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
};
