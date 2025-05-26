import { createContact, getHome } from "../services/website.js";

export const createContactController = async (req, res) => {
  const { name, surname, email, phone, message } = req.body;

  try {
    let user = await createContact({
      name,
      surname,
      email,
      phone,
      message,
    });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getHomeController = async (req, res) => {
  try {
    let user = await getHome();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
