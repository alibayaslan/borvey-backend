import { Comment } from "../models/comment.js";
import { PersonalUser } from "../models/personalUser.js";
import { ServiceUser } from "../models/serviceUser.js";
import { Post } from "../models/post.js";
import moment from "moment";
import { SiteSetting } from "../models/siteSetting.js";

export const createPost = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Post.create({
        userId: data.userId,
        title: data.title,
        date: moment().format(),
        type: data.type,
        questions: data.questions,
        additionalInfo: data.additionalInfo,
        address: data.address,
      })
        .then(async (res) => {
          const currentId = await res._id;
          const updateUser = await PersonalUser.updateOne(
            { _id: data.userId },
            {
              $push: {
                posts: currentId,
              },
            }
          );
          await resolve(updateUser);
        })
        .catch((err) => {
          reject(err);
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

export const createComment = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Comment.create({
        personalUserID: data.personalUserID,
        serviceUserID: data.serviceUserID,
        postID: data.postID,
        rate: data.rate,
        description: data.description,
        date: moment().format(),
      })
        .then(async (res) => {
          const currentId = await res._id;
          const updatePersonalUser = await PersonalUser.updateOne(
            { _id: data.personalUserID },
            {
              $push: {
                comments: currentId,
              },
            }
          );
          const updateServiceUser = await ServiceUser.updateOne(
            { _id: data.serviceUserID },
            {
              $push: {
                comments: currentId,
              },
            }
          );

          const updatePost = await Post.updateOne(
            { _id: data.postID },
            {
              comment: currentId,
              status: "completed",
            }
          );

          if (updatePersonalUser && updateServiceUser && updatePost) {
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

export const getPostList = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await PersonalUser.findOne({ _id: userId })
        .populate({
          path: "posts",
          model: "post",
          populate: {
            path: "offers",
            model: "offer",
            populate: {
              path: "serviceUserID",
              model: "serviceUser",
              select: "firm.name firm.logo",
            },
          },
        })
        .then((res) => {
          resolve(res.posts);
        });
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
          select: "name surname avatar status",
        })
        .then((res) => {
          resolve(res);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getPostForService = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findPosts = await Post.find().populate({
        path: "userId",
        model: "personalUser",
        select: "name surname avatar status",
      });

      if (findPosts && findPosts.length) {
        resolve(
          findPosts
            .filter((i) => i.status === "online")
            .filter((i) => i.userId.status === "online")
        );
      } else {
        resolve("ilan bulunamadı");
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const setPostStatus = async (postId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (status !== "online") {
        const userPostIds = [postId];
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

      await Post.findOneAndUpdate(
        { _id: postId },
        {
          status: status,
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

export const canSendMessage = async (postId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentPost = await Post.findOne({ _id: postId }).populate({
        path: "offers",
        model: "offer",
      });

      if (currentPost.offers.length) {
        const currentOffers = currentPost.offers.filter(
          (i) => i.serviceUserID.toString() === userId && i.status === "accept"
        );

        if (currentOffers.length) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
