import express from "express";
const { Router } = express;
const router = Router();

import {
  createOfferController,
  getMyOfferListController,
  getOfferListController,
  responseOfferController,
} from "../controllers/offer.js";

//APP
router.route("/create-offer").post(createOfferController);
router.route("/response-offer").post(responseOfferController);
router.route("/get-offer-list").post(getOfferListController);
router.route("/get-my-offer-list").post(getMyOfferListController);

export default router;
