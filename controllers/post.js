import {
  createComment,
  createPost,
  editPost,
  getPostList,
  getPostDetail,
  getPostForService,
  setPostStatus,
  canSendMessage,
} from "../services/post.js";

export const createPostController = async (req, res) => {
  const { userId, title, type, questions, additionalInfo, address } = req.body;

  try {
    let post = await createPost({
      userId,
      title,
      type,
      questions,
      additionalInfo,
      address,
    });
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const editPostController = async (req, res) => {
  const { postId, title, type, questions, additionalInfo, address } = req.body;

  try {
    let post = await editPost(
      {
        title,
        type,
        questions,
        additionalInfo,
        address,
      },
      postId
    );
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createCommentController = async (req, res) => {
  const { personalUserID, serviceUserID, postID, rate, description } = req.body;

  try {
    let comment = await createComment({
      personalUserID,
      serviceUserID,
      postID,
      rate,
      description,
    });
    res.send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getPostListController = async (req, res) => {
  const { userId } = req.body;

  try {
    let post = await getPostList(userId);
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getPostDetailController = async (req, res) => {
  const { postId } = req.body;
  try {
    let post = await getPostDetail(postId);
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getPostForServiceController = async (req, res) => {
  const { userId } = req.body;
  try {
    let post = await getPostForService(userId);
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const setPostStatusController = async (req, res) => {
  const { postId, status } = req.body;
  try {
    let post = await setPostStatus(postId, status);
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const canSendMessageController = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    let post = await canSendMessage(postId, userId);
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};
