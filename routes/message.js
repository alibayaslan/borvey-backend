import express from "express";
const { Router } = express;
const router = Router();

import { getMessageListController } from "../controllers/message.js";

//APP
router.route("/get-message-list").post(getMessageListController);

export default router;
