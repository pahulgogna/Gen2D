"use server";

import { redirect } from "next/navigation";
import { verifyJWT } from "./auth/auth";
import { ChatModel, IChat, IMessage, MessageModel } from "@/lib/models/models";
import dbConnect from "@/lib/db";
import { Chat, Message } from "@/lib/types";
import {
  sendRequestGemini,
  sendRequestGeminiFallback,
  sendRequestGeminiFallback2,
} from "@/lib/utils/GoogleGemini";
import { RenderVideoFromCodeAndStoreInCloudinary } from "./utils/utils";

export async function GetAllChats(): Promise<Chat[]> {
  let user = await verifyJWT();
  if (!user) {
    redirect("/auth/signin");
  }

  let chats: IChat[] = [];

  try {
    await dbConnect();

    chats = await ChatModel.find({
      user: user.id,
    });
  } catch (e) {
    console.log(e);
    redirect("/error");
  }

  return chats.map(c => {
    return {
      id: c._id.toString(),
      user: c.user.toString(),
      name: c.name
    }
  })
}

export async function GetMessages(chatId: string): Promise<IMessage[]> {
  let user = await verifyJWT();
  if (!user) {
    redirect("/auth/signin");
  }

  if (!chatId) {
    redirect("/auth/signin");
  }

  let messages: IMessage[];
  await dbConnect();

  try {
    let chat = await ChatModel.findOne({
      user: user.id,
      _id: chatId,
    });
    if (!chat) {
      console.error("chat not found");
      redirect("/c");
    }

    messages = await MessageModel.find({
      chat: chatId,
    });
  } catch (e) {
    console.error(e);
    redirect("/c");
  }
  return messages;
}

export async function SendMessage(
  message: string,
  chatId: string | undefined,
  newChat: boolean,
): Promise<{ chat: string; message: string }> {
  if (!newChat && !chatId) {
    redirect("/c");
  }

  let user = await verifyJWT();
  if (!user) {
    redirect("/auth/signin");
  }

  let chat;
  await dbConnect();

  if (newChat) {
    chat = await ChatModel.create({
      user: user.id,
      name: message.slice(0, message.length <= 10 ? message.length : 10),
    });
  } else {
    if (!chatId) {
      redirect("/c");
    }

    chat = await ChatModel.findOne({
      _id: chatId,
      user: user.id,
    });

    if (!chat) {
      redirect("/c");
    }
  }

  const dbMessage = await MessageModel.create({
    content: message,
    role: "user",
    chat: chat._id,
  });

  return {
    chat: JSON.stringify({
      id: chat._id.toString(),
      user: chat.user.toString(),
      name: chat.name,
    }),
    message: JSON.stringify({
      id: dbMessage._id.toString(),
      role: dbMessage.role,
      content: dbMessage.content,
      assets: dbMessage.assets,
      createdAt: dbMessage.createdAt,
    }),
  };
}

export async function GenerateLLMResponse(chatId: string) {
  console.log("from GenerateLLMResponse Action: chatId: " + chatId);

  if (!chatId) {
    return { error: "no chat id found" };
  }

  let messages = await GetMessages(chatId);

  if (messages.length && messages[messages.length - 1].role != "user") {
    return { error: "no message to stream" };
  }

  let sendMessages: Message[] = messages
    .filter((m) => {
      return m.content && (m.role == "user" || m.role == "assistant");
    })
    .map((m) => {
      return {
        id: m._id.toString(),
        role: m.role,
        content: m.content || "",
        assets: m.assets,
        createdAt: m.createdAt,
      };
    });

  let llmResponse = "";
  let newMessage: Message;

  try {
    llmResponse = await sendRequestGemini(sendMessages);
  } catch {
    console.log("falling back to another AI model 1");
    try {
      llmResponse = await sendRequestGeminiFallback(sendMessages);
    } catch {
      console.log("falling back to another AI model 2");
      try {
        llmResponse = await sendRequestGeminiFallback2(sendMessages);
      } catch {
        return { error: "error while generating content" };
      }
    }
  } finally {
    if (llmResponse) {
      try {
        await dbConnect();
        newMessage = await MessageModel.create({
          content: llmResponse,
          role: "assistant",
          chat: chatId,
        });
      } catch {
        return { error: "error while storing content" };
      }
    } else {
      return { error: "no content could be generated" };
    }
  }

  return {
    response: llmResponse,
    messageId: newMessage.id,
    error: null,
  };
}

export async function GenerateVideo(messageId: string) {
  if (!messageId) {
    return { error: "bad request" };
  }

  let message = await MessageModel.findById(messageId);

  if (!message) {
    return { error: "not found" };
  }

  if (message?.role != "assistant") {
    return { error: "bad request" };
  }

  let code = message?.content?.trim() || "";
  if (!code || !code.includes("from manim import *")) {
    return { error: "bad request" };
  }

  if (message.assets.length != 0) {
    return { error: "assets already generated" };
  }

  let videoIds = [];

  try {
    let cmdRes = await RenderVideoFromCodeAndStoreInCloudinary(code, messageId);

    if (!cmdRes) {
      return { error: "internal server error" };
    }

    let outputSplit = cmdRes.split("=============");

    videoIds = outputSplit[outputSplit.length - 1]
      .split(",")
      .filter((m) => {
        if (m) return true;
        return false;
      })
      .map((v) => {
        return v.trim();
      });
  } catch (e) {
    console.error(e);
    return { error: "error while generating video" };
  }

  try {
    let newMessage = await MessageModel.findByIdAndUpdate(messageId, {
      assets: videoIds.map((v) => {
        return v.trim();
      }),
    });
    if (!newMessage) {
      return { error: "unexpected error while storing video urls" };
    }
    return { assets: videoIds };
  } catch (e) {
    return { error: "error while storing video urls: " + e };
  }
}
