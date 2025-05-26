import { Offer } from "../models/offer.js";
import moment from "moment";
import { PersonalUser } from "../models/personalUser.js";
import { ServiceUser } from "../models/serviceUser.js";
import { Post } from "../models/post.js";
import { createNotification } from "./user.js";
import { sendMailUpdate } from "../helpers/sendEmail.js";

export const createOffer = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Offer.create({
        personalUserID: data.personalUserID,
        serviceUserID: data.serviceUserID,
        postID: data.postID,
        type: data.type,
        time: data.time,
        date: data.date,
        price: data.price,
        conditions: data.conditions,
        createDate: moment().format(),
      })
        .then(async (res) => {
          const currentId = await res._id;
          const updatePersonalUser = await PersonalUser.findOneAndUpdate(
            { _id: data.personalUserID },
            {
              $push: {
                offers: currentId,
              },
            },
            { new: true }
          );
          const updateServiceUser = await ServiceUser.findOneAndUpdate(
            { _id: data.serviceUserID },
            {
              $push: {
                offers: currentId,
              },
            },
            { new: true }
          );

          const updatePost = await Post.findOneAndUpdate(
            { _id: data.postID },
            {
              $push: {
                offers: currentId,
              },
            }
          );

          if (updatePersonalUser && updateServiceUser && updatePost) {
            await sendMailUpdate(
              updatePersonalUser.email,
              "teklifler",
              "newOffer"
            );

            createNotification({
              type: "offer",
              name: updateServiceUser.firm.name,
              personalUserId: data.personalUserID,
              serviceUserId: data.serviceUserID,
              offerId: currentId,
              postId: data.postID,
              postTitle: updatePost.title,
            });

            resolve(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const responseOffer = async (
  data,
  offerId,
  postId,
  notificationData
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Offer.updateOne(
        { _id: offerId },
        {
          status: data,
        }
      )
        .then(async (res) => {
          if (data === "accept") {
            await Post.updateOne(
              { _id: postId },
              {
                status: "working",
              }
            ).then(async (i) => {
              const currentService = await ServiceUser.findOne({
                _id: notificationData.serviceUserId,
              });

              await sendMailUpdate(
                currentService.email,
                "tekliflerim",
                "offerStatus"
              );

              createNotification({
                type: "offerAnswer",
                name: notificationData.name,
                personalUserId: notificationData.userId,
                serviceUserId: notificationData.serviceUserId,
                offerId: offerId,
                postId: postId,
                postTitle: notificationData.postTitle,
                answer: "accept",
              });

              resolve(res);
            });
          } else {
            const currentService = await ServiceUser.findOne({
              _id: notificationData.serviceUserId,
            });

            await sendMailUpdate(
              currentService.email,
              "tekliflerim",
              "offerStatus"
            );
            resolve(res);
            createNotification({
              type: "offerAnswer",
              name: notificationData.name,
              personalUserId: notificationData.userId,
              serviceUserId: notificationData.serviceUserId,
              offerId: offerId,
              postId: postId,
              postTitle: notificationData.postTitle,
              answer: "decline",
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getOfferList = async (userId, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "personal") {
        await PersonalUser.findOne({ _id: userId })
          .populate({
            path: "offers",
            model: "offer",
            populate: [
              {
                path: "postID",
                model: "post",
              },
              {
                path: "serviceUserID",
                model: "serviceUser",
                select: "avatar comments firm firmImages name offers surname",
                populate: {
                  path: "comments",
                  model: "comment",
                  select: "rate",
                },
              },
            ],
          })
          .then((res) => {
            resolve(res.offers);
          });
      }

      if (type === "service") {
        await ServiceUser.findOne({ _id: userId })
          .populate({
            path: "offers",
            model: "offer",
            populate: [
              {
                path: "postID",
                model: "post",
              },
              {
                path: "personalUserID",
                model: "personalUser",
              },
            ],
          })
          .then((res) => {
            resolve(res.offers);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getMyOfferList = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await ServiceUser.findOne({ _id: userId })
        .populate({
          path: "offers",
          model: "offer",
          populate: [
            {
              path: "postID",
              model: "post",
            },
            {
              path: "personalUserID",
              model: "personalUser",
              select: "name surname avatar status",
            },
          ],
        })
        .then((res) => {
          resolve(res.offers);
        });
    } catch (error) {
      reject(error);
    }
  });
};
