import { Contact } from "../models/contact.js";
import moment from "moment";
import { SiteSetting } from "../models/siteSetting.js";

export const createContact = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Contact.create({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        message: data.message,
        createdDate: moment().format(),
      })
        .then(async (res) => {
          await resolve("success");
        })
        .catch((err) => {
          console.log("err", err);
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getHome = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await SiteSetting.findOne({
        _id: "6740459cb0691ec5738f75f2",
      })
        .populate([
          {
            path: "posts",
            model: "post",
          },
          {
            path: "firms",
            model: "serviceUser",
            select: "firm",
          },
        ])
        .then(async (res) => {
          await resolve(res);
        })
        .catch((err) => {
          console.log("err", err);
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};
