import express from "express";
const { Router } = express;
const router = Router();

import {
  createCommentController,
  createPostController,
  editPostController,
  getPostDetailController,
  getPostForServiceController,
  getPostListController,
  setPostStatusController,
  canSendMessageController,
} from "../controllers/post.js";

//APP
router.route("/create-post").post(createPostController);
router.route("/edit-post").post(editPostController);
router.route("/create-comment").post(createCommentController);
router.route("/get-post-list").post(getPostListController);
router.route("/get-post").post(getPostDetailController);
router.route("/get-post-for-service").post(getPostForServiceController);
router.route("/set-post-status").post(setPostStatusController);
router.route("/can-send-message").post(canSendMessageController);

export default router;
