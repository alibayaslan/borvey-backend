import { PersonalUser } from "../models/personalUser.js";
import { ServiceUser } from "../models/serviceUser.js";
import { comparePassword, hashedPassword } from "../helpers/hashPassword.js";
import { generateRandomCode } from "../helpers/generateRandomCode.js";
import { generateJwt } from "../helpers/generateToken.js";
import moment from "moment";
import { uploadImage } from "../helpers/uploadImage.js";
import { createPost } from "./post.js";
import { sendMail } from "../helpers/sendEmail.js";
import { Admin } from "../models/admin.js";

export const register = async (type, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPersonalRegistered = await PersonalUser.findOne({
        email: data.email,
      });
      const isServiceRegistered = await ServiceUser.findOne({
        email: data.email,
      });

      if (isPersonalRegistered || isServiceRegistered) {
        reject("Bu kullanıcı zaten mevcut");
        return;
      }

      if (type === "personal" && data.email) {
        const currentCode = generateRandomCode;
        await PersonalUser.create({
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: await hashedPassword(data.password),
          code: {
            code: currentCode,
            date: moment().format(),
            isUsed: false,
          },
        })
          .then(async (res) => {
            if (data.isPost) {
              await createPost({
                userId: res._id,
                title: data.postTitle,
                type: data.postType,
                questions: [JSON.parse(data.postQuestions)],
                additionalInfo: data.postInfo,
                address: {
                  from: {
                    city: data.postAdressFromCity,
                    district: data.postAdressFromDistrict,
                    street: data.postAdressFromStreet,
                  },
                  to: {
                    city: data.postAdressToCity,
                    district: data.postAdressToDistrict,
                    street: data.postAdressToStreet,
                  },
                },
              })
                .then(async (i) => {
                  await resolve("success");
                  await sendMail(data.email, currentCode, "newUser");
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              await resolve("success");
              await sendMail(data.email, currentCode, "newUser");
            }
          })
          .catch((err) => {
            reject(err);
          });
      } else if (type === "service" && data.email) {
        let firmLogo;
        let firmImages = [];

        if (data.files) {
          if (data.files["firm-logo"]) {
            for (
              let index = 0;
              index < data.files["firm-logo"].length;
              index++
            ) {
              await uploadImage(
                data.files["firm-logo"][index],
                "serviceUser",
                data.firmName
              )
                .then((res) => {
                  firmLogo = res.downloadURL;
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }

          if (data.files["firm-image"]) {
            for (
              let index = 0;
              index < data.files["firm-image"].length;
              index++
            ) {
              await uploadImage(
                data.files["firm-image"][index],
                "serviceUser",
                data.firmName
              )
                .then((res) => {
                  firmImages.push(res.downloadURL);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        }
        const currentCode = generateRandomCode;
        await ServiceUser.create({
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: await hashedPassword(data.password),
          code: {
            code: currentCode,
            date: moment().format(),
            isUsed: false,
          },
          firm: {
            name: data.firmName,
            address: data.firmAddress,
            website: data.website,
            phone: data.firmPhone,
            description: data.description,
            logo: firmLogo,
          },
          firmImages: firmImages,
          works: JSON.parse(data.works),
        })
          .then(async (res) => {
            await resolve("success");
            await sendMail(data.email, currentCode, "newUser");
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const login = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPersonalRegistered = await PersonalUser.findOne({
        email: data.email,
      });
      const isServiceRegistered = await ServiceUser.findOne({
        email: data.email,
      });

      if (!isPersonalRegistered && !isServiceRegistered) {
        reject("Böyle bir kullanıcı bulunamadı");
        return;
      }

      if (isPersonalRegistered) {
        if (isPersonalRegistered.status === "waitEmail") {
          reject("emailError");
        }

        if (isPersonalRegistered.status === "blocked") {
          reject(
            "Üyeliğiniz askıya alınmıştır. Bir hata olduğunu düşünüyorsanız lütfen bizimle iletişime geçin."
          );
        }

        if (isPersonalRegistered.status === "deleted") {
          reject("deletedUser");
        }

        await comparePassword(data.password, isPersonalRegistered.password)
          .then(async (res) => {
            const token = await generateJwt(data, "personal");
            await resolve({
              data: isPersonalRegistered,
              token: token,
              type: "personal",
            });
          })
          .catch((err) => {
            reject("Hatalı giriş bilgileri.");
          });
      }

      if (isServiceRegistered) {
        if (isServiceRegistered.status === "waitEmail") {
          reject("emailError");
        }

        if (isServiceRegistered.status === "blocked") {
          reject(
            "Üyeliğiniz askıya alınmıştır. Bir hata olduğunu düşünüyorsanız lütfen bizimle iletişime geçin."
          );
        }

        if (isServiceRegistered.status === "deleted") {
          reject("deletedUser");
        }
        await comparePassword(data.password, isServiceRegistered.password)
          .then(async (res) => {
            const token = await generateJwt(data, "service");
            await resolve({
              data: isServiceRegistered,
              token: token,
              type: "service",
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

export const loginAdmin = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isAdmin = await Admin.findOne({
        email: data.email,
      });

      if (!isAdmin) {
        reject("Böyle bir kullanıcı bulunamadı");
        return;
      }

      if (isAdmin) {
        await comparePassword(data.password, isAdmin.password)
          .then(async (res) => {
            const token = await generateJwt(data, "admin");
            await resolve({
              data: isAdmin,
              token: token,
              type: "admin",
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

export const emailSentResetPassword = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPersonalRegistered = await PersonalUser.findOne({
        email: data.email,
      });
      const isServiceRegistered = await ServiceUser.findOne({
        email: data.email,
      });

      if (!isPersonalRegistered && !isServiceRegistered) {
        reject("Kayıtlı email adresi bulunamadı.");
        return;
      }

      if (isPersonalRegistered) {
        if (
          isPersonalRegistered.resetPassword &&
          isPersonalRegistered.resetPassword.sendDate &&
          moment().diff(
            moment(isPersonalRegistered.resetPassword.sendDate),
            "minutes"
          ) <= 5
        ) {
          reject(
            "5 dakika içerisinde birden fazla link gönderemezsiniz. Lütfen bir kaç dakika bekleyip tekrar deneyiniz"
          );
        } else {
          const currentCode = generateRandomCode;
          await PersonalUser.updateOne(
            { _id: isPersonalRegistered._id },
            {
              resetPassword: {
                sendDate: moment().format(),
                code: currentCode,
                codeStatus: "waiting",
              },
            }
          )
            .then((res) => {
              resolve("success");
              sendMail(data.email, currentCode, "passwordReset");
            })
            .catch((err) => {
              reject(err);
            });
        }
      }
      if (isServiceRegistered) {
        if (
          isServiceRegistered.resetPassword &&
          isServiceRegistered.resetPassword.sendDate &&
          moment().diff(
            moment(isServiceRegistered.resetPassword.sendDate),
            "minutes"
          ) <= 5
        ) {
          reject(
            "5 dakika içerisinde birden fazla link gönderemezsiniz. Lütfen bir kaç dakika bekleyip tekrar deneyiniz"
          );
        } else {
          const currentCode = generateRandomCode;
          await ServiceUser.updateOne(
            { _id: isServiceRegistered._id },
            {
              resetPassword: {
                sendDate: moment().format(),
                code: currentCode,
                codeStatus: "waiting",
              },
            }
          )
            .then((res) => {
              resolve("success");
              sendMail(data.email, currentCode, "passwordReset");
            })
            .catch((err) => {
              reject(err);
            });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const passwordReset = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPersonalRegistered = await PersonalUser.findOne({
        email: data.email,
      });
      const isServiceRegistered = await ServiceUser.findOne({
        email: data.email,
      });

      if (!isPersonalRegistered && !isServiceRegistered) {
        reject("Kayıtlı email adresi bulunamadı.");
        return;
      }

      if (isPersonalRegistered) {
        if (
          isPersonalRegistered.resetPassword &&
          isPersonalRegistered.resetPassword.code
        ) {
          if (isPersonalRegistered.resetPassword.code !== data.code) {
            reject(
              "Hatalı link, lütfen şifre sıfırlama işlemlerine baştan başlayın."
            );
          } else if (isPersonalRegistered.resetPassword.codeStatus === "used") {
            reject(
              "Bu link daha önce kullanılmış, lütfen şifre sıfırlama işlemlerine baştan başlayın."
            );
          } else if (
            moment().diff(
              moment(isPersonalRegistered.resetPassword.sendDate),
              "minutes"
            ) >= 240
          ) {
            reject(
              "Bağlantı 4 saattir kullanılmadığı için kullanılamaz. Lütfen şifre sıfırlama işlemini yeniden başlatın."
            );
          } else {
            comparePassword(data.password, isPersonalRegistered.password)
              .then((res) => {
                reject("Şifre, şu andaki şifreniz ile aynı olamaz.");
              })
              .catch(async (err) => {
                await PersonalUser.updateOne(
                  { _id: isPersonalRegistered._id },
                  {
                    password: await hashedPassword(data.password),
                    resetPassword: {
                      code: "",
                      codeStatus: "used",
                      sendDate: isPersonalRegistered.resetPassword.sendDate,
                    },
                  }
                )
                  .then((res) => {
                    resolve("success");
                  })
                  .catch((err) => {
                    reject(err);
                  });
              });
          }
        } else {
          reject("Bu link artık kullanılamaz.");
        }
      }

      if (isServiceRegistered) {
        if (
          isServiceRegistered.resetPassword &&
          isServiceRegistered.resetPassword.code
        ) {
          if (isServiceRegistered.resetPassword.code !== data.code) {
            reject(
              "Hatalı link, lütfen şifre sıfırlama işlemlerine baştan başlayın."
            );
          } else if (isServiceRegistered.resetPassword.codeStatus === "used") {
            reject(
              "Bu link daha önce kullanılmış, lütfen şifre sıfırlama işlemlerine baştan başlayın."
            );
          } else if (
            moment().diff(
              moment(isServiceRegistered.resetPassword.sendDate),
              "minutes"
            ) >= 240
          ) {
            reject(
              "Bağlantı 4 saattir kullanılmadığı için kullanılamaz. Lütfen şifre sıfırlama işlemini yeniden başlatın."
            );
          } else {
            comparePassword(data.password, isServiceRegistered.password)
              .then((res) => {
                reject("Şifre, şu andaki şifreniz ile aynı olamaz.");
              })
              .catch(async (err) => {
                await ServiceUser.updateOne(
                  { _id: isServiceRegistered._id },
                  {
                    password: await hashedPassword(data.password),
                    resetPassword: {
                      code: "",
                      codeStatus: "used",
                      sendDate: isServiceRegistered.resetPassword.sendDate,
                    },
                  }
                )
                  .then((res) => {
                    resolve("success");
                  })
                  .catch((err) => {
                    reject(err);
                  });
              });
          }
        } else {
          reject("Bu link artık kullanılamaz.");
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const checkEmail = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPersonalRegistered = await PersonalUser.findOne({
        email: data.email,
      });
      const isServiceRegistered = await ServiceUser.findOne({
        email: data.email,
      });

      if (!isPersonalRegistered && !isServiceRegistered) {
        reject("Kayıtlı email adresi bulunamadı.");
        return;
      }

      if (isPersonalRegistered) {
        if (
          isPersonalRegistered.code.code !== data.code ||
          isPersonalRegistered.code.isUsed
        ) {
          reject("error");
        } else if (
          moment().diff(moment(isPersonalRegistered.code.date), "minutes") >=
          240
        ) {
          reject("error");
        } else {
          await PersonalUser.updateOne(
            { _id: isPersonalRegistered._id },
            {
              status: "online",
              code: {
                code: isPersonalRegistered.code.code,
                date: isPersonalRegistered.code.date,
                isUsed: true,
              },
            }
          )
            .then((res) => {
              resolve("success");
            })
            .catch((err) => {
              reject(err);
            });
        }
      }

      if (isServiceRegistered) {
        if (
          isServiceRegistered.code.code !== data.code ||
          isServiceRegistered.code.isUsed
        ) {
          reject("error");
        } else if (
          moment().diff(moment(isServiceRegistered.code.date), "minutes") >= 240
        ) {
          reject("error");
        } else {
          await ServiceUser.updateOne(
            { _id: isServiceRegistered._id },
            {
              status: "online",
              code: {
                code: isServiceRegistered.code.code,
                date: isServiceRegistered.code.date,
                isUsed: true,
              },
            }
          )
            .then((res) => {
              resolve("success");
            })
            .catch((err) => {
              reject(err);
            });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const sendEmailAgain = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPersonalRegistered = await PersonalUser.findOne({
        email: data.email,
      });
      const isServiceRegistered = await ServiceUser.findOne({
        email: data.email,
      });

      if (!isPersonalRegistered && !isServiceRegistered) {
        reject("Kayıtlı email adresi bulunamadı.");
        return;
      }

      if (isPersonalRegistered) {
        if (
          moment().diff(moment(isPersonalRegistered.code.date), "minutes") >= 5
        ) {
          const currentCode = generateRandomCode;
          console.log(currentCode);
          await PersonalUser.updateOne(
            { _id: isPersonalRegistered._id },
            {
              code: {
                code: currentCode,
                date: moment().format(),
                isUsed: false,
              },
            }
          )
            .then(async (res) => {
              await sendMail(data.email, currentCode, "newUser");
              await resolve("success");
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(
            "5 Dakika içerisinde bir link iletilmiş. Tekrar göndermek için lütfen bir kaç dakika bekleyin."
          );
        }
      }

      if (isServiceRegistered) {
        if (
          moment().diff(moment(isServiceRegistered.code.date), "minutes") >= 5
        ) {
          const currentCode = generateRandomCode;
          await ServiceUser.updateOne(
            { _id: isServiceRegistered._id },
            {
              code: {
                code: currentCode,
                date: moment().format(),
                isUsed: false,
              },
            }
          )
            .then(async (res) => {
              await sendMail(data.email, currentCode, "newUser");
              await resolve("success");
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(
            "5 Dakika içerisinde bir link iletilmiş. Tekrar göndermek için lütfen bir kaç dakika bekleyin."
          );
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const sendEmailForActive = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPersonalRegistered = await PersonalUser.findOne({
        email: data.email,
      });
      const isServiceRegistered = await ServiceUser.findOne({
        email: data.email,
      });

      if (!isPersonalRegistered && !isServiceRegistered) {
        reject("Kayıtlı email adresi bulunamadı.");
        return;
      }

      if (isPersonalRegistered) {
        await comparePassword(data.password, isPersonalRegistered.password)
          .then(async (res) => {})
          .catch((err) => {
            reject("Hatalı giriş bilgileri.");
          });

        if (
          moment().diff(moment(isPersonalRegistered.code.date), "minutes") >= 5
        ) {
          const currentCode = generateRandomCode;
          console.log(currentCode);
          await PersonalUser.updateOne(
            { _id: isPersonalRegistered._id },
            {
              code: {
                code: currentCode,
                date: moment().format(),
                isUsed: false,
              },
            }
          )
            .then(async (res) => {
              await sendMail(data.email, currentCode, "newUser");
              await resolve("success");
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(
            "5 Dakika içerisinde bir link iletilmiş. Tekrar göndermek için lütfen bir kaç dakika bekleyin."
          );
        }
      }

      if (isServiceRegistered) {
        await comparePassword(data.password, isServiceRegistered.password)
          .then(async (res) => {})
          .catch((err) => {
            reject("Hatalı giriş bilgileri.");
          });

        if (
          moment().diff(moment(isServiceRegistered.code.date), "minutes") >= 5
        ) {
          const currentCode = generateRandomCode;
          await ServiceUser.updateOne(
            { _id: isServiceRegistered._id },
            {
              code: {
                code: currentCode,
                date: moment().format(),
                isUsed: false,
              },
            }
          )
            .then(async (res) => {
              await sendMail(data.email, currentCode, "newUser");
              await resolve("success");
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(
            "5 Dakika içerisinde bir link iletilmiş. Tekrar göndermek için lütfen bir kaç dakika bekleyin."
          );
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
