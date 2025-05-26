import express from "express";
const { Router } = express;
const router = Router();
import { upload } from "../helpers/multer.js";
import {
  changePasswordController,
  createMessageController,
  createWorkController,
  deleteUserController,
  deleteWorkController,
  editFirmController,
  editUserController,
  editWorkController,
  getCommentsController,
  getNotificationsController,
  getUserController,
  getWorksController,
  readNotificationController,
  reportMessageController,
} from "../controllers/user.js";

//APP
router.route("/create-work").post(createWorkController);
router.route("/edit-work").post(editWorkController);
router.route("/delete-work").post(deleteWorkController);
router.route("/get-user").post(getUserController);
router.route("/get-comments").post(getCommentsController);
router.route("/get-works").post(getWorksController);

router.post(
  "/edit-user",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  editUserController
);

router.post(
  "/edit-firm",
  upload.fields([
    {
      name: "firm-logo",
      maxCount: 1,
    },
    {
      name: "firm-image",
      maxCount: 10,
    },
  ]),
  editFirmController
);

router.route("/create-message").post(createMessageController);
router.route("/change-password").post(changePasswordController);
router.route("/delete-user").post(deleteUserController);
router.route("/get-notifications").post(getNotificationsController);
router.route("/read-notifications").post(readNotificationController);
router.route("/report-message").post(reportMessageController);

export default router;
