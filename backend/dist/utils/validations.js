"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreMessageRequest = exports.UserLoginRequest = exports.CreateUserRequest = void 0;
const zod_1 = __importDefault(require("zod"));
const CreateUserRequest = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.email(),
    password: zod_1.default.string().min(8),
});
exports.CreateUserRequest = CreateUserRequest;
const UserLoginRequest = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string().min(8),
});
exports.UserLoginRequest = UserLoginRequest;
const StoreMessageRequest = zod_1.default.object({
    content: zod_1.default.string().nonempty(),
    newChat: zod_1.default.boolean().optional(),
    chatId: zod_1.default.string().optional()
});
exports.StoreMessageRequest = StoreMessageRequest;
