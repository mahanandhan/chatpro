import express from "express";
import { sendMessage, getMessages, deleteMessage, getAllChatUsers } from "../controller/privateChat.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const PrivateRouter = express.Router();

PrivateRouter.get("/user", protectRoute, getAllChatUsers);

PrivateRouter.post("/send", protectRoute, sendMessage);

PrivateRouter.get("/:userId", protectRoute, getMessages);

PrivateRouter.delete("/message/:messageId", protectRoute, deleteMessage);


export default PrivateRouter;
