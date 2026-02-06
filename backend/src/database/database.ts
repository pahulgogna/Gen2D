import mongoose from "mongoose";
import { Env } from "../config/config";

mongoose
  .connect(Env.MongoDB_URL)
  .then((t) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("error while connecting to mongodb: ", err);
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("User", userSchema);

const chatSchema = new mongoose.Schema({
  name: { type: String, default: "new chat" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const ChatModel = mongoose.model("Chat", chatSchema);

const messageSchema = new mongoose.Schema({
  content: { type: String },
  assets: [{ type: String , default: []}],
  role: { type: String, required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  createdAt: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model("Message", messageSchema);

export { UserModel, ChatModel, MessageModel };
