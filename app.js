import express from "express";
import expressWs from "express-ws";
import db from "./db.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

import { verifyToken } from "./helpers/userAuth.js";
import { verifyAdmin } from "./helpers/adminAuth.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import userRoutes from "./routes/user.js";
import offerRoutes from "./routes/offer.js";
import adminRoutes from "./routes/admin.js";
import websiteRoutes from "./routes/website.js";
import messageRoutes from "./routes/message.js";
import { comparePassword } from "./helpers/hashPassword.js";
import { fileURLToPath, parse } from "url";
import { Message } from "./models/message.js";
import moment from "moment";
import { sendMailUpdate } from "./helpers/sendEmail.js";
import { hashedPassword } from "./helpers/hashPassword.js";

import { SiteSetting } from "./models/siteSetting.js";
import blogRoutes from "./routes/blog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

comparePassword(
  "12345678",
  "$2b$12$ewvpBZ9RGrMQzMYIudj40uK5ZCrTpVkWrb9lcNnsxi86JYD7lK5z."
)
  .then((res) => {
    console.log("res", res);
  })
  .catch((err) => {
    console.log("err", err);
  });

const app = express();
expressWs(app);
const PORT = 5050;

app.use(
  cors({
    origin: [
      "https://borvey.com",
      "https://www.borvey.com",
      "https://borvey-admin-panel.vercel.app",
      "https://borvey-backend-13d056a7e6c7.herokuapp.com",
      "https://borvey-frontend-445a9cc91c1d.herokuapp.com",
      "http://localhost:5050",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.set('trust proxy', 1);

app.use(express.static("public"));
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    parameterLimit: 100000,
    extended: true,
  })
);

app.use("/auth", authRoutes);
app.use("/website", websiteRoutes);
app.use("/post", verifyToken, postRoutes);
app.use("/user", verifyToken, userRoutes);
app.use("/offer", verifyToken, offerRoutes);
app.use("/message", verifyToken, messageRoutes);
app.use("/admin", verifyAdmin, adminRoutes);
app.use("/blog", blogRoutes);

const wsClients = new Map();
let changeStream;

app.ws("/connect", function (ws, req) {
  const queryParams = parse(req.url, true).query;
  const userId = queryParams.userId;

  if (userId) {
    wsClients.set(userId, ws);
    console.log(`User ${userId} connected`);

    // İlk bağlantı olduğunda watchMessages'i başlat
    if (!changeStream) {
      watchMessages();
    }

    ws.on("close", () => {
      wsClients.delete(userId);
      console.log(`User ${userId} disconnected`);

      // Eğer tüm kullanıcılar bağlantıyı kapattıysa changeStream'i durdur
      if (wsClients.size === 0 && changeStream) {
        stopWatchingMessages();
      }
    });
  }

  ws.on("message", async function (msg) {
    const currentMessage = JSON.parse(msg);

    const messageDoc = await Message.findById(currentMessage.messageId)
      .populate(
        currentMessage.receiver.type === "personal"
          ? "personalUserID"
          : "serviceUserID"
      )
      .lean();

    const isFirstMessage = messageDoc.messageData.length === 0;

    if (isFirstMessage) {
      // Mail gönderilecek kullanıcıyı belirle
      const receiverDoc =
        currentMessage.receiver.type === "personal"
          ? messageDoc.personalUserID
          : messageDoc.serviceUserID;

      const receiverEmail = receiverDoc?.email;

      if (receiverEmail) {
        await sendMailUpdate(receiverEmail, "mesaj", "newMessage");
      }
    }

    await Message.updateOne(
      { _id: currentMessage.messageId },
      {
        $push: {
          messageData: {
            text: currentMessage.text,
            type: currentMessage.type,
            sendDate: moment().format(),
          },
        },
      }
    );
  });
});

async function watchMessages() {
  try {
    changeStream = Message.watch();
    console.log("Change Stream started");

    changeStream.on("change", (change) => {
      if (
        (change.operationType === "update" &&
          change.updateDescription?.updatedFields) ||
        change.operationType === "insert"
      ) {
        const updatedMessage = Object.values(
          change.updateDescription?.updatedFields
        )
          .flat()
          .map((message) => message);

        wsClients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            const messageToSend = JSON.stringify({
              ...updatedMessage,
              messageId: change.documentKey._id,
            });
            client.send(messageToSend);
          }
        });
      }
    });
  } catch (err) {
    console.error("Error watching message changes:", err);
  }
}

function stopWatchingMessages() {
  if (changeStream) {
    changeStream.close();
    changeStream = null;
    console.log("Change Stream stopped as no clients are connected.");
  }
}

app.listen(PORT, () => {
  console.log(`Borvey Backend v0.1 Listening on ${PORT}`);
});
