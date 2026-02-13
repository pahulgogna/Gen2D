import mongoose, { Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChat extends Document {
  name: string;
  user: Types.ObjectId;
  createdAt: Date;
}

export interface IMessage extends Document {
  content: string;
  assets: string[];
  role: string;
  chat: Types.ObjectId;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

const chatSchema = new mongoose.Schema<IChat>({
  name: { type: String, default: "new chat" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const ChatModel: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);

const messageSchema = new mongoose.Schema<IMessage>({
  content: { type: String },
  assets: [{ type: String }],
  role: { type: String, required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const MessageModel: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export { UserModel, ChatModel, MessageModel };
