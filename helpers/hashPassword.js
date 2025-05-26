import bcrypt from "bcryptjs";

const salt = 12;

export const hashedPassword = (pass) => {
  return new Promise(async (resolve, reject) => {
    try {
      await bcrypt.hash(pass, salt, (err, hash) => {
        if (err) {
          // Handle error
          return;
        }
        // Hashing successful, 'hash' contains the hashed password
        resolve(hash);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const comparePassword = (userPass, storedPass) => {
  return new Promise(async (resolve, reject) => {
    try {
      await bcrypt.compare(userPass, storedPass, (err, result) => {
        if (err) {
          // Handle error
          reject(err);
          return;
        }

        if (result) {
          // Passwords match, authentication successful
          resolve("correct password");
        } else {
          // Passwords don't match, authentication failed
          reject("incorrect password");
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
