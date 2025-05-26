import express from "express";
const { Router } = express;
const router = Router();
import { upload } from "../helpers/multer.js";

import {
  checkEmailController,
  emailSentResetPasswordController,
  loginAdminController,
  loginController,
  passwordResetController,
  registerController,
  sendEmailAgainController,
  sendEmailForActiveController,
} from "../controllers/auth.js";

//APP
router.post(
  "/register",
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
  registerController
);
router.route("/login").post(loginController);
router.route("/login-admin").post(loginAdminController);
router.route("/reset-password-email").post(emailSentResetPasswordController);
router.route("/reset-password").post(passwordResetController);
router.route("/check-email").post(checkEmailController);
router.route("/send-email-again").post(sendEmailAgainController);
router.route("/send-email-for-active").post(sendEmailForActiveController);

export default router;
