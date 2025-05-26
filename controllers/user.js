import {
  createWork,
  editWork,
  getUser,
  editUser,
  getComments,
  getWorks,
  deleteWork,
  editFirm,
  createMessage,
  changePassword,
  deleteUser,
  getNotifications,
  readNotification,
  reportMessage,
} from "../services/user.js";

export const getUserController = async (req, res) => {
  const { userId } = req.body;

  try {
    let user = await getUser(userId);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getNotificationsController = async (req, res) => {
  const { userId, type } = req.body;

  try {
    let user = await getNotifications(userId, type);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createWorkController = async (req, res) => {
  const { works, userId } = req.body;

  try {
    let work = await createWork(works, userId);
    res.send(work);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const reportMessageController = async (req, res) => {
  const { personalUserId, serviceUserId, messageId, reason, type } = req.body;

  try {
    let work = await reportMessage({
      personalUserId,
      serviceUserId,
      messageId,
      reason,
      type,
    });
    res.send(work);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const editWorkController = async (req, res) => {
  const { type, city, district, street, address, userId, workId } = req.body;

  try {
    let work = await editWork(
      {
        type,
        city,
        district,
        street,
        address,
      },
      userId,
      workId
    );
    res.send(work);
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

export const getCommentsController = async (req, res) => {
  const { userId, type } = req.body;

  try {
    let user = await getComments(userId, type);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getWorksController = async (req, res) => {
  const { userId } = req.body;

  try {
    let user = await getWorks(userId);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteWorkController = async (req, res) => {
  const { userId, workId } = req.body;

  try {
    let work = await deleteWork(userId, workId);
    res.send(work);
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

export const createMessageController = async (req, res) => {
  const { serviceId, personalId, type } = req.body;

  try {
    let work = await createMessage(serviceId, personalId, type);
    res.send(work);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const changePasswordController = async (req, res) => {
  const { password, type, userId } = req.body;

  try {
    let work = await changePassword(
      {
        password: password,
        type: type,
      },
      userId
    );
    res.send(work);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteUserController = async (req, res) => {
  const { userId, type, password, reason } = req.body;
  try {
    let work = await deleteUser({
      userId,
      type,
      password,
      reason,
    });
    res.send(work);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const readNotificationController = async (req, res) => {
  const { notificationId } = req.body;

  try {
    let work = await readNotification({
      notificationId,
    });
    res.send(work);
  } catch (error) {
    res.status(400).send(error);
  }
};
