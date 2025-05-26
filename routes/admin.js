import express from "express";
const { Router } = express;
const router = Router();
import { upload } from "../helpers/multer.js";

import {
  getOfferListController,
  getPostListController,
  getUserListController,
  getContactListController,
  getReportListController,
  getDashboardController,
  updateSiteSettingController,
  getSiteSettingController,
  getPostDetailController,
  editPostController,
  changeStatusPostController,
  getUserController,
  editUserController,
  editFirmController,
  changeUserStatusController,
} from "../controllers/admin.js";

//USER
router.route("/get-user-list").post(getUserListController);
router.route("/get-user").post(getUserController);
router.route("/change-user-status").post(changeUserStatusController);
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

//POST
router.route("/get-post-list").post(getPostListController);
router.route("/get-post").post(getPostDetailController);
router.route("/edit-post").post(editPostController);
router.route("/change-post").post(changeStatusPostController);

//OFFER
router.route("/get-offer-list").post(getOfferListController);

//CONTACT
router.route("/get-contact").post(getContactListController);

//REPORT
router.route("/get-report").post(getReportListController);

//ADMIN
router.route("/get-dashboard").post(getDashboardController);

//UPDATE SETTINGS
router.route("/update-settings").post(updateSiteSettingController);
router.route("/get-settings").post(getSiteSettingController);

export default router;
