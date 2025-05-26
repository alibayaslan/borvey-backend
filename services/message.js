import { Message } from "../models/message.js";
import { PersonalUser } from "../models/personalUser.js";
import { ServiceUser } from "../models/serviceUser.js";

export const getMessageList = async (userId, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "personal") {
        await PersonalUser.findOne({ _id: userId })
          .populate({
            path: "message",
            model: "message",
            populate: [
              {
                path: "serviceUserID",
                model: "serviceUser",
                select: "firm",
              },
            ],
          })
          .then((res) => {
            resolve(res.message);
          });
      }

      if (type === "service") {
        await ServiceUser.findOne({ _id: userId })
          .populate({
            path: "message",
            model: "message",
            populate: [
              {
                path: "personalUserID",
                model: "personalUser",
                select: "name surname avatar",
              },
            ],
          })
          .then((res) => {
            resolve(res.message);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};
