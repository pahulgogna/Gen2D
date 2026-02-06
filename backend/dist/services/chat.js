"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils/utils");
const database_1 = require("../database/database");
const auth_1 = require("../auth/auth");
const validations_1 = require("../utils/validations");
const chatRouter = express_1.default.Router();
exports.chatRouter = chatRouter;
chatRouter.use(auth_1.JwtVerificationMiddleware);
chatRouter.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    let jwtUser = res.locals.user;
    try {
        let userChats = yield database_1.ChatModel.find({
            user: jwtUser.id,
        });
        if (!userChats) {
            (0, utils_1.SendJsonError)(res, 404, "not found");
        }
        (0, utils_1.SendJsonResponse)(res, 200, userChats);
    }
    catch (e) {
        console.log(e);
        (0, utils_1.SendJsonError)(res, 500, e);
    }
}));
chatRouter.use(express_1.default.json());
chatRouter.post("/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let jwtUser = res.locals.user;
    let storeMessageRequest = validations_1.StoreMessageRequest.safeParse(req.body);
    if (!storeMessageRequest.success) {
        (0, utils_1.SendJsonError)(res, 400, "invalid body");
        return;
    }
    try {
        const { content, chatId, newChat } = storeMessageRequest.data;
        let chat;
        if (newChat) {
            chat = yield database_1.ChatModel.create({
                user: jwtUser.id,
                name: content.slice(0, content.length <= 10 ? content.length : 10),
            });
        }
        else {
            if (!chatId) {
                (0, utils_1.SendJsonError)(res, 400, "chatId is required");
                return;
            }
            chat = yield database_1.ChatModel.findOne({
                _id: chatId,
                user: jwtUser.id,
            });
            if (!chat) {
                (0, utils_1.SendJsonError)(res, 404, "chat not found");
                return;
            }
        }
        const message = yield database_1.MessageModel.create({
            content: content,
            role: "user",
            chat: chat._id,
        });
        (0, utils_1.SendJsonResponse)(res, 201, {
            chat: {
                id: chat._id,
                name: chat.name,
                createdAt: chat.createdAt,
            },
            message: {
                id: message._id,
                content: message.content,
                role: message.role,
                createdAt: message.createdAt,
            },
        });
    }
    catch (err) {
        console.error(err);
        (0, utils_1.SendJsonError)(res, 500, "internal server error");
    }
}));
