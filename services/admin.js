import { ServiceUser } from "../models/serviceUser.js";
import { PersonalUser } from "../models/personalUser.js";
import { Post } from "../models/post.js";
import { Offer } from "../models/offer.js";
import { Contact } from "../models/contact.js";
import { Report } from "../models/report.js";
import { SiteSetting } from "../models/siteSetting.js";
import moment from "moment";
import { uploadImage } from "../helpers/uploadImage.js";

export const getUserList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const PersonalUserData = await PersonalUser.find();
      const ServiceUserData = await ServiceUser.find();

      await resolve([
        ...PersonalUserData.map((i) => {
          return {
            ...i._doc,
            type: "personal",
          };
        }),
        ...ServiceUserData.map((i) => {
          return {
            ...i._doc,
            type: "service",
          };
        }),
      ]);
    } catch (error) {
      reject(error);
    }
  });
};

export const getPostList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const postData = await Post.find().populate({
        path: "userId",
        model: "personalUser",
      });

      await resolve(postData);
    } catch (error) {
      reject(error);
    }
  });
};

export const getOfferList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const offerData = await Offer.find().populate([
        {
          path: "personalUserID",
          model: "personalUser",
        },
        {
          path: "serviceUserID",
          model: "serviceUser",
        },
        {
          path: "postID",
          model: "post",
        },
      ]);

      await resolve(offerData);
    } catch (error) {
      reject(error);
    }
  });
};

export const getContactList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const contactData = await Contact.find();

      await resolve(contactData);
    } catch (error) {
      reject(error);
    }
  });
};

export const getReportList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const reportData = await Report.find().populate([
        {
          path: "personalUserId",
          model: "personalUser",
        },
        {
          path: "serviceUserId",
          model: "serviceUser",
        },
        {
          path: "messageId",
          model: "message",
        },
      ]);

      await resolve(reportData);
    } catch (error) {
      reject(error);
    }
  });
};

export const getDashboard = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const personalUser = await PersonalUser.countDocuments({
        status: "online",
      });
      const serviceUser = await ServiceUser.countDocuments({
        status: "online",
      });
      const post = await Post.countDocuments();
      const offer = await Offer.countDocuments();

      const deletedPersonal = await PersonalUser.countDocuments({
        status: "deleted",
      });
      const deletedService = await ServiceUser.countDocuments({
        status: "deleted",
      });

      await resolve({
        user: personalUser,
        serviceUser: serviceUser,
        post: post,
        offer: offer,
        deleted: deletedPersonal + deletedService,
      });

      await resolve(reportData);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateSiteSetting = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await SiteSetting.updateOne(
        {
          _id: "6740459cb0691ec5738f75f2",
        },
        {
          posts: data.posts,
          firms: data.firms,
          update: moment().format(),
          SEO: {
            homepage: data.homepage,
            about: data.about,
            faq: data.faq,
            contact: data.contact,
          },
        }
      )
        .then((res) => {
          resolve("success");
        })
        .catch((err) => {
          reject(err);
        });

      await resolve(reportData);
    } catch (error) {
      reject(error);
    }
  });
};

export const getSiteSetting = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await SiteSetting.findOne({
        _id: "6740459cb0691ec5738f75f2",
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });

      await resolve(reportData);
    } catch (error) {
      reject(error);
    }
  });
};

export const getPostDetail = async (postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Post.findOne({ _id: postId })
        .populate({
          path: "userId",
          model: "personalUser",
        })
        .then((res) => {
          resolve(res);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const editPost = async (data, postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Post.findOneAndUpdate(
        { _id: postId },
        {
          title: data.title,
          type: data.type,
          questions: data.questions,
          additionalInfo: data.additionalInfo,
          address: data.address,
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

export const changeStatusPost = async (data, postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Post.findOneAndUpdate(
        { _id: postId },
        {
          status: data.status,
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

export const changeUserStatus = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.type === "personal") {
        await PersonalUser.findOneAndUpdate(
          { _id: data.userId },
          {
            status: data.status,
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
        await ServiceUser.findOneAndUpdate(
          { _id: data.userId },
          {
            status: data.status,
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
