import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbLink = process.env.MONGODB_LINK;

mongoose.connect(dbLink).then((r) => console.log("Mongoose connected"));

const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});

export default db;
