import { PersonalUser } from "../models/personalUser.js";
import { ServiceUser } from "../models/serviceUser.js";
import moment from "moment";
import { uploadImage } from "../helpers/uploadImage.js";
import { Message } from "../models/message.js";
import { hashedPassword } from "../helpers/hashPassword.js";
import { generateJwt } from "../helpers/generateToken.js";
import { comparePassword } from "../helpers/hashPassword.js";
import { Notification } from "../models/notifications.js";
import { Report } from "../models/report.js";
import { SiteSetting } from "../models/siteSetting.js";
import { Post } from "../models/post.js";

export const getUser = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const PersonalUserData = await PersonalUser.findOne({ _id: userId });
      const ServiceUserData = await ServiceUser.findOne({ _id: userId });

      if (PersonalUserData) {
        resolve(PersonalUserData);
        return;
      }

      if (ServiceUserData) {
        resolve(ServiceUserData);
        return;
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getNotifications = async (userId, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "personal") {
        await PersonalUser.findOne({ _id: userId })
          .populate({
            path: "notifications",
            model: "notification",
            populate: [
              {
                path: "offerId",
                model: "offer",
              },
              {
                path: "serviceUserId",
                model: "serviceUser",
              },
              {
                path: "postId",
                model: "post",
              },
              {
                path: "postId",
                model: "post",
              },
            ],
          })
          .then((res) => {
            resolve(res.notifications);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (type === "service") {
        await ServiceUser.findOne({ _id: userId })
          .populate({
            path: "notifications",
            model: "notification",
            populate: [
              {
                path: "offerId",
                model: "offer",
              },
              {
                path: "serviceUserId",
                model: "serviceUser",
              },
              {
                path: "postId",
                model: "post",
              },
              {
                path: "postId",
                model: "post",
              },
            ],
          })
          .then((res) => {
            resolve(res.notifications);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const createWork = async (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await ServiceUser.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            works: data,
          },
        }
      )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const editWork = async (data, userId, workId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await ServiceUser.updateOne(
        {
          _id: userId,
          "works._id": workId,
        },
        {
          $set: {
            "works.$.type": data.type,
            "works.$.city": data.city,
            "works.$.district": data.district,
            "works.$.street": data.street,
            "works.$.address": data.address,
          },
        }
      )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteWork = async (userId, workId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await ServiceUser.updateOne(
        {
          _id: userId,
          "works._id": workId,
        },
        {
          $pull: {
            works: { _id: workId },
          },
        }
      )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const editUser = async (data, userId, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      let avatar;
      if (data.type === "personal") {
        if (file && file["image"]) {
          await uploadImage(file["image"][0], "personalUser", userId)
            .then((res) => {
              avatar = res.downloadURL;
            })
            .catch((err) => {
              console.log(err);
            });
        }

        if (!avatar && !data.avatar) {
          await PersonalUser.findOneAndUpdate(
            { _id: userId },
            { $set: { avatar: null } }
          );
        }
        await PersonalUser.findOneAndUpdate(
          { _id: userId },
          {
            name: data.name,
            surname: data.surname,
            phone: data.phone,
            city: data.city,
            district: data.district,
            avatar: file ? avatar : data.avatar,
          },
          { new: true }
        )
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }

      if (data.type === "service") {
        if (file && file["image"]) {
          await uploadImage(file["image"][0], "serviceUser", userId)
            .then((res) => {
              avatar = res.downloadURL;
            })
            .catch((err) => {
              console.log(err);
            });
        }

        if (!avatar && !data.avatar) {
          await ServiceUser.findOneAndUpdate(
            { _id: userId },
            { $set: { avatar: null } }
          );
        }

        await ServiceUser.findOneAndUpdate(
          { _id: userId },
          {
            name: data.name,
            surname: data.surname,
            phone: data.phone,
            city: data.city,
            district: data.district,
            avatar: file ? avatar : data.avatar,
          },
          { new: true }
        )
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getComments = async (userId, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "service") {
        await ServiceUser.findOne({ _id: userId })
          .populate({
            path: "comments",
            model: "comment",
            populate: [
              {
                path: "personalUserID",
                model: "personalUser",
                select: "avatar",
              },
              {
                path: "postID",
                model: "post",
                select: "title",
              },
            ],
          })
          .then((res) => {
            resolve(res.comments);
          })
          .catch((err) => {
            reject(err);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getWorks = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await ServiceUser.findOne({ _id: userId })
        .then((res) => {
          resolve(res.works);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const editFirm = async (data, userId, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      let logo;
      let firmImages = [];
      if (file && file["firm-logo"]) {
        await uploadImage(file["firm-logo"][0], "serviceUser", userId)
          .then((res) => {
            logo = res.downloadURL;
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (file && file["firm-image"]) {
        for (let index = 0; index < file["firm-image"].length; index++) {
          await uploadImage(file["firm-image"][index], "serviceUser", userId)
            .then((res) => {
              firmImages.push(res.downloadURL);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      await ServiceUser.findOneAndUpdate(
        { _id: userId },
        {
          firm: {
            name: data.name,
            address: data.address,
            phone: data.phone,
            website: data.website,
            description: data.description,
            logo: file && file["firm-logo"] ? logo : data.logo,
          },
          firmImages: [...firmImages, ...JSON.parse(data.firmImages)],
        },
        { new: true }
      )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const createMessage = async (serviceId, personalId, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findService = await ServiceUser.findOne({ _id: serviceId });
      const findPersonal = await PersonalUser.findOne({ _id: personalId });

      if (findService && findPersonal) {
        const hasCommonElement = findService.message.some((item) =>
          findPersonal.message.includes(item)
        );

        if (hasCommonElement) {
          resolve("alreadyHas");
        } else {
          await Message.create({
            personalUserID: personalId,
            serviceUserID: serviceId,
            createDate: moment().format(),
          }).then(async (res) => {
            await ServiceUser.findOneAndUpdate(
              { _id: serviceId },
              { $push: { message: res._id } }
            );

            await PersonalUser.findOneAndUpdate(
              { _id: personalId },
              { $push: { message: res._id } }
            );

            createNotification({
              type: "message",
              name:
                type === "personal"
                  ? `${findPersonal.name} ${findPersonal.surname}`
                  : `${findService.firm.name}`,
              personalUserId: personalId,
              serviceUserId: serviceId,
              userType: type,
            });

            resolve("success");
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const reportMessage = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Report.create({
        personalUserId: data.personalUserId,
        serviceUserId: data.serviceUserId,
        messageId: data.messageId,
        reason: data.reason,
        type: data.type,
        createDate: moment().format(),
      })
        .then((res) => {
          resolve("success");
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const changePassword = async (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.type === "personal") {
        await PersonalUser.findOneAndUpdate(
          { _id: userId },
          {
            password: await hashedPassword(data.password),
          },
          { new: true }
        )
          .then(async (res) => {
            const token = await generateJwt(
              {
                email: res.email,
                password: data.password,
              },
              "personal"
            );
            await resolve({
              data: res,
              token: token,
              type: "personal",
            });
          })
          .catch((err) => {
            reject(err);
          });
      }

      if (data.type === "service") {
        await ServiceUser.findOneAndUpdate(
          { _id: userId },
          {
            password: await hashedPassword(data.password),
          },
          { new: true }
        )
          .then(async (res) => {
            const token = await generateJwt(
              {
                email: res.email,
                password: data.password,
              },
              "service"
            );
            await resolve({
              data: res,
              token: token,
              type: "service",
            });
          })
          .catch((err) => {
            reject(err);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.type === "personal") {
        const isPersonalRegistered = await PersonalUser.findOne({
          _id: data.userId,
        });

        await comparePassword(data.password, isPersonalRegistered.password)
          .then(async (res) => {
            if (isPersonalRegistered.posts.length) {
              const userPostIds = isPersonalRegistered.posts.map((id) =>
                id.toString()
              );

              const siteSettings = await SiteSetting.findById(
                "6740459cb0691ec5738f75f2"
              );

              const sitePostIds = siteSettings.posts.map((id) => id.toString());
              const intersection = sitePostIds.filter((id) =>
                userPostIds.includes(id)
              );

              if (intersection.length > 0) {
                let updatedSitePosts = sitePostIds.filter(
                  (id) => !intersection.includes(id)
                );

                const numberToAdd = 3 - updatedSitePosts.length;

                const additionalPosts = await Post.find({
                  status: "online",
                  _id: { $nin: [...sitePostIds, ...userPostIds] },
                })
                  .sort({ _id: -1 })
                  .limit(numberToAdd)
                  .select("_id");

                const additionalPostIds = additionalPosts.map((p) =>
                  p._id.toString()
                );

                updatedSitePosts = [...updatedSitePosts, ...additionalPostIds];

                // SiteSetting güncelle
                await SiteSetting.findByIdAndUpdate(siteSettings._id, {
                  posts: updatedSitePosts,
                });
              }
            }

            await PersonalUser.findOneAndUpdate(
              { _id: data.userId },
              {
                status: "deleted",
                deleteReason: data.reason,
              }
            )
              .then((res) => {
                resolve("success");
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject("Hatalı giriş bilgileri.");
          });
      }

      if (data.type === "service") {
        const isServiceRegistered = await ServiceUser.findOne({
          _id: data.userId,
        });

        await comparePassword(data.password, isServiceRegistered.password)
          .then(async (res) => {
            await ServiceUser.findOneAndUpdate(
              { _id: data.userId },
              {
                status: "deleted",
                deleteReason: data.reason,
              }
            )
              .then((res) => {
                resolve("success");
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject("Hatalı giriş bilgileri.");
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const createNotification = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatePersonal = async (messageId, userId) => {
        return new Promise(async (resolve, reject) => {
          try {
            await PersonalUser.updateOne(
              { _id: userId },
              {
                $push: {
                  notifications: messageId,
                },
              }
            ).then((item) => {
              resolve("success");
            });
          } catch (err) {
            reject(err);
          }
        });
      };

      const updateService = async (messageId, userId) => {
        return new Promise(async (resolve, reject) => {
          try {
            await ServiceUser.updateOne(
              { _id: userId },
              {
                $push: {
                  notifications: messageId,
                },
              }
            ).then((item) => {
              resolve("success");
            });
          } catch (err) {
            reject(err);
          }
        });
      };

      if (data.type === "message") {
        await Notification.create({
          status: "message",
          isRead: false,
          text: `${data.name} seninle mesajlaşma başlattı.`,
          personalUserId: data.personalUserId,
          serviceUserId: data.serviceUserId,
          createDate: moment().format(),
        }).then(async (res) => {
          if (data.userType === "service") {
            await updatePersonal(res._id, data.personalUserId);
          }

          if (data.userType === "personal") {
            await updateService(res._id, data.serviceUserId);
          }
        });
      }

      if (data.type === "offer") {
        await Notification.create({
          status: "offer",
          isRead: false,
          text: `${data.name} sana ${data.postTitle} ilanın için bir teklif gönderdi.`,
          personalUserId: data.personalUserId,
          serviceUserId: data.serviceUserId,
          offerId: data.offerId.toString(),
          postId: data.postId,
          createDate: moment().format(),
        }).then(async (res) => {
          await updatePersonal(res._id, data.personalUserId);
        });
      }

      if (data.type === "offerAnswer") {
        await Notification.create({
          status: "offerAnswer",
          isRead: false,
          text: `${data.name} senin ${
            data.postTitle
          } ilanına verdiğin teklifi ${
            data.answer === "accept" ? "kabul etti." : "redetti."
          }.`,
          personalUserId: data.personalUserId,
          serviceUserId: data.serviceUserId,
          offerId: data.offerId.toString(),
          postId: data.postId,
          createDate: moment().format(),
        }).then(async (res) => {
          await updateService(res._id, data.serviceUserId);
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const readNotification = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Notification.updateMany(
        { _id: { $in: data.notificationId } },
        { $set: { isRead: true } }
      )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};
