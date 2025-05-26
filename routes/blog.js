import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from "../controllers/blog.js";
import { verifyAdmin } from "../helpers/adminAuth.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", verifyAdmin, createBlog);
router.put("/:id", verifyAdmin, updateBlog);
router.delete("/:id", verifyAdmin, deleteBlog);

export default router; 