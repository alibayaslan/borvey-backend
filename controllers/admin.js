import {
  changeStatusPost,
  changeUserStatus,
  editFirm,
  editPost,
  editUser,
  getContactList,
  getDashboard,
  getOfferList,
  getPostDetail,
  getPostList,
  getReportList,
  getSiteSetting,
  getUser,
  getUserList,
  updateSiteSetting,
} from "../services/admin.js";

export const getUserListController = async (req, res) => {
  try {
    let user = await getUserList();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getPostListController = async (req, res) => {
  try {
    let user = await getPostList();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getOfferListController = async (req, res) => {
  try {
    let user = await getOfferList();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getContactListController = async (req, res) => {
  try {
    let user = await getContactList();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getReportListController = async (req, res) => {
  try {
    let user = await getReportList();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getDashboardController = async (req, res) => {
  try {
    let user = await getDashboard();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateSiteSettingController = async (req, res) => {
  const { firms, posts, homepage, about, faq, contact } = req.body;
  try {
    let user = await updateSiteSetting({
      firms,
      posts,
      homepage,
      about,
      faq,
      contact,
    });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getSiteSettingController = async (req, res) => {
  try {
    let user = await getSiteSetting();
    res.send(user);
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

export const changeStatusPostController = async (req, res) => {
  const { postId, status } = req.body;

  try {
    let post = await changeStatusPost(
      {
        status,
      },
      postId
    );
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUserController = async (req, res) => {
  const { userId } = req.body;

  try {
    let user = await getUser(userId);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const editUserController = async (req, res) => {
  const { userId, type, name, surname, phone, city, district, avatar } =
    req.body;
  try {
    let user = await editUser(
      {
        name,
        surname,
        phone,
        city,
        district,
        avatar,
        type,
      },
      userId,
      req.files
    );
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const editFirmController = async (req, res) => {
  const {
    userId,
    name,
    address,
    phone,
    website,
    description,
    logo,
    firmImages,
  } = req.body;
  try {
    let user = await editFirm(
      {
        name,
        address,
        phone,
        website,
        description,
        logo,
        firmImages,
      },
      userId,
      req.files
    );
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const changeUserStatusController = async (req, res) => {
  const { userId, type, status } = req.body;
  try {
    let user = await changeUserStatus({
      userId,
      type,
      status,
    });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
