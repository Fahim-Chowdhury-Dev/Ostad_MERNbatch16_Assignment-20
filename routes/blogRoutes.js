const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/blogController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getSingleBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
