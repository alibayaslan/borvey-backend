import {
  createOffer,
  getMyOfferList,
  getOfferList,
  responseOffer,
} from "../services/offer.js";

export const createOfferController = async (req, res) => {
  const {
    personalUserID,
    serviceUserID,
    postID,
    type,
    time,
    date,
    price,
    conditions,
  } = req.body;

  try {
    let offer = await createOffer({
      personalUserID,
      serviceUserID,
      postID,
      type,
      time,
      date,
      price,
      conditions,
    });
    res.send(offer);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const responseOfferController = async (req, res) => {
  const { offerId, status, postId, userId, name, postTitle, serviceUserId } =
    req.body;

  try {
    let offer = await responseOffer(status, offerId, postId, {
      userId,
      name,
      postTitle,
      serviceUserId,
    });
    res.send(offer);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getOfferListController = async (req, res) => {
  const { userId, type } = req.body;

  try {
    let offer = await getOfferList(userId, type);
    res.send(offer);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getMyOfferListController = async (req, res) => {
  const { userId } = req.body;

  try {
    let offer = await getMyOfferList(userId);
    res.send(offer);
  } catch (error) {
    res.status(400).send(error);
  }
};
