import express from "express";
const { Router } = express;
const router = Router();

import {
  createContactController,
  getHomeController,
} from "../controllers/website.js";

//APP
router.route("/create-contact").post(createContactController);
router.route("/get-home").post(getHomeController);

export default router;
