import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getBlob,
} from "firebase/storage";
import { firebaseConfig } from "./firebaseConfig.js";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
initializeApp(firebaseConfig);
const storage = getStorage();

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

export const uploadImage = async (file, type, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateTime = giveCurrentDateTime();

      const storageRef = ref(
        storage,
        `${type}/${name}/${file.originalname + "_" + dateTime}`
      );

      // Create file metadata including the content type
      const metadata = {
        contentType: file.mimetype,
      };

      // Görseli sharp ile 300x300px'e yeniden boyutlandır
      let processedBuffer = file.buffer;
      if (file.mimetype.startsWith("image/")) {
        processedBuffer = await sharp(file.buffer)
          .resize(300, 300, { fit: "cover" })
          .toBuffer();
      }

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        processedBuffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);

      return resolve({
        message: "file uploaded to firebase storage",
        name: file.originalname,
        type: file.mimetype,
        downloadURL: downloadURL,
      });
    } catch (error) {
      reject(error);
    }
  });
};
