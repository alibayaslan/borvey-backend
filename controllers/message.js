import { getMessageList } from "../services/message.js";

export const getMessageListController = async (req, res) => {
  const { userId, type } = req.body;

  try {
    let message = await getMessageList(userId, type);
    res.send(message);
  } catch (error) {
    res.status(400).send(error);
  }
};
