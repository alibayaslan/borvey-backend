import {
  register,
  login,
  emailSentResetPassword,
  passwordReset,
  sendEmailAgain,
  checkEmail,
  loginAdmin,
  sendEmailForActive,
} from "../services/auth.js";

export const registerController = async (req, res) => {
  const {
    name,
    surname,
    email,
    password,
    type,
    firmName,
    firmAddress,
    website,
    firmPhone,
    description,
    works,
    isPost,
    postTitle,
    postInfo,
    postType,
    postQuestions,
    postAdressFromCity,
    postAdressFromDistrict,
    postAdressFromStreet,
    postAdressToCity,
    postAdressToDistrict,
    postAdressToStreet,
  } = req.body;

  try {
    let user = await register(type, {
      name,
      surname,
      email,
      password,
      files: req.files,
      firmName,
      firmAddress,
      website,
      firmPhone,
      description,
      works,
      isPost,
      postTitle,
      postInfo,
      postType,
      postQuestions,
      postAdressFromCity,
      postAdressFromDistrict,
      postAdressFromStreet,
      postAdressToCity,
      postAdressToDistrict,
      postAdressToStreet,
    });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await login({ email, password });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const emailSentResetPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await emailSentResetPassword({ email });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const passwordResetController = async (req, res) => {
  const { email, code, password } = req.body;

  try {
    let user = await passwordReset({ email, code, password });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const checkEmailController = async (req, res) => {
  const { email, code } = req.body;

  try {
    let user = await checkEmail({ email, code });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const sendEmailAgainController = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await sendEmailAgain({ email });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const sendEmailForActiveController = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await sendEmailForActive({ email, password });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const loginAdminController = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await loginAdmin({ email, password });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
