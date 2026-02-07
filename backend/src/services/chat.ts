import express from "express";
import {
  SendJsonError,
  SendJsonResponse,
  SetStreamHeaders,
} from "../utils/utils";
import { ChatModel, MessageModel } from "../database/database";
import { Env } from "../config/config";
import { JwtUserPayload, Message } from "../types";
import { JwtVerificationMiddleware } from "../auth/auth";
import { StoreMessageRequest } from "../utils/validations";
import { sendRequestGemini } from "../llm/GoogleGemini";

const chatRouter = express.Router();

chatRouter.use(JwtVerificationMiddleware);

chatRouter.get("/", async (_, res) => {
  let jwtUser: JwtUserPayload = res.locals.user;

  try {
    let userChats = await ChatModel.find({
      user: jwtUser.id,
    });
    if (!userChats) {
      SendJsonError(res, 404, "not found");
    }

    SendJsonResponse(res, 200, userChats);
  } catch (e) {
    console.log(e);
    SendJsonError(res, 500, e);
  }
});

chatRouter.use(express.json());

chatRouter.post("/message", async (req, res) => {
  let jwtUser: JwtUserPayload = res.locals.user;

  let storeMessageRequest = StoreMessageRequest.safeParse(req.body);
  if (!storeMessageRequest.success) {
    SendJsonError(res, 400, "invalid body");
    return;
  }
  try {
    const { content, chatId, newChat } = storeMessageRequest.data;

    let chat;

    if (newChat) {
      chat = await ChatModel.create({
        user: jwtUser.id,
        name: content.slice(0, content.length <= 10 ? content.length : 10),
      });
    } else {
      if (!chatId) {
        SendJsonError(res, 400, "chatId is required");
        return;
      }

      chat = await ChatModel.findOne({
        _id: chatId,
        user: jwtUser.id,
      });

      if (!chat) {
        SendJsonError(res, 404, "chat not found");
        return;
      }
    }

    const message = await MessageModel.create({
      content: content,
      role: "user",
      chat: chat._id,
    });

    SendJsonResponse(res, 201, {
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
  } catch (err) {
    console.error(err);
    SendJsonError(res, 500, "internal server error");
  }
});

chatRouter.get("/stream/{*chatId}", async (req, res) => {
  let chatId = req.params.chatId;
  let user: JwtUserPayload = res.locals.user;

  if (!chatId) {
    SendJsonError(res, 400, "chat id not found");
    return;
  }

  try {
    let chat = await ChatModel.findOne({
      user: user.id,
      _id: chatId,
    });
    if (!chat) {
      SendJsonError(res, 404, "chat not found");
      return;
    }

    let messages = await MessageModel.find({
      chat: chatId,
    });

    SetStreamHeaders(res);

    let sendMessages: Message[] = messages
      .filter((m) => {
        return m.content && (m.role == "user" || m.role == "assistant");
      })
      .map((m) => {
        return {
          content: m.content || "",
          role: m.role,
        };
      });

    let generator = sendRequestGemini(sendMessages);

    let llmResponse = ""

    for await (let chunk of generator) {
      llmResponse += chunk
      res.write(`data: ${chunk}\n\n`);
    }

    await MessageModel.create({
      content: llmResponse,
      role: "assistant",
      chat: chatId
    })

  } catch (e) {
    SendJsonError(res, 500, "Internal server error");
  } finally {
    res.end();
  }
});

chatRouter.get("/{*chatId}", async (req, res) => {
  let chatId = req.params.chatId;
  let user: JwtUserPayload = res.locals.user;

  if (!chatId) {
    SendJsonError(res, 400, "chat id not found");
    return;
  }

  try {
    let chat = await ChatModel.findOne({
      user: user.id,
      _id: chatId,
    });
    if (!chat) {
      SendJsonError(res, 404, "chat not found");
      return;
    }

    let messages = await MessageModel.find({
      chat: chatId,
    });

    SendJsonResponse(res, 200, messages);
  } catch (e) {
    SendJsonError(res, 400, "Bad request");
  }
});

export { chatRouter };
