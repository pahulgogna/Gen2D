"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const user_1 = require("./services/user");
const chat_1 = require("./services/chat");
const app = (0, express_1.default)();
const subrouterV1 = express_1.default.Router();
subrouterV1.use("/user", user_1.userRouter);
subrouterV1.use("/chat", chat_1.chatRouter);
app.use("/api/v1", subrouterV1);
app.listen(config_1.Env.PORT, (err) => {
    if (err) {
        console.error("error while starting the server: ", err);
    }
    else {
        console.error("server started on port: ", config_1.Env.PORT);
    }
});
