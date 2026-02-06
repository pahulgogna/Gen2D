"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = exports.ChatModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
mongoose_1.default
    .connect(config_1.Env.MongoDB_URL)
    .then((t) => {
    console.log("connected to mongodb");
})
    .catch((err) => {
    console.log("error while connecting to mongodb: ", err);
});
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;
const chatSchema = new mongoose_1.default.Schema({
    name: { type: String, default: "new chat" },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});
const ChatModel = mongoose_1.default.model("Chat", chatSchema);
exports.ChatModel = ChatModel;
const messageSchema = new mongoose_1.default.Schema({
    content: { type: String },
    assets: [{ type: String, default: [] }],
    role: { type: String, required: true },
    chat: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Chat", required: true },
    createdAt: { type: Date, default: Date.now },
});
const MessageModel = mongoose_1.default.model("Message", messageSchema);
exports.MessageModel = MessageModel;
