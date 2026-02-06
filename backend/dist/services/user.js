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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils/utils");
const database_1 = require("../database/database");
const validations_1 = require("../utils/validations");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config/config");
const auth_1 = require("../auth/auth");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.get("/", auth_1.JwtVerificationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let jwtUser = res.locals.user;
    try {
        let dbuser = yield database_1.UserModel.findById(jwtUser.id, {
            _id: true,
            name: true,
            email: true,
        });
        if (!dbuser) {
            (0, utils_1.SendJsonError)(res, 404, "user not found");
            return;
        }
        (0, utils_1.SendJsonResponse)(res, 200, dbuser);
    }
    catch (_a) {
        (0, utils_1.SendJsonError)(res, 500, "");
    }
}));
userRouter.use(express_1.default.json());
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let reqUser = validations_1.CreateUserRequest.safeParse(req.body);
    if (!reqUser.success) {
        (0, utils_1.SendJsonError)(res, 400, reqUser.error.message);
        return;
    }
    try {
        let salt = yield bcrypt_1.default.genSalt(config_1.Env.SaltRounds);
        let hashedPassword = yield bcrypt_1.default.hash(reqUser.data.password, salt);
        reqUser.data.password = hashedPassword;
        yield database_1.UserModel.insertOne(reqUser.data);
    }
    catch (e) {
        (0, utils_1.SendJsonError)(res, 400, e);
        return;
    }
    (0, utils_1.SendJsonResponse)(res, 200, { message: "user created successfully" });
}));
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let reqUser = validations_1.UserLoginRequest.safeParse(req.body);
    if (reqUser.success == false) {
        (0, utils_1.SendJsonError)(res, 400, "invalid credentials");
        return;
    }
    try {
        let dbUser = yield database_1.UserModel.findOne({
            email: reqUser.data.email,
        });
        if (!dbUser) {
            (0, utils_1.SendJsonError)(res, 404, "user not found");
            return;
        }
        let passwordCheck = yield bcrypt_1.default.compare(reqUser.data.password, dbUser.password);
        if (!passwordCheck) {
            (0, utils_1.SendJsonError)(res, 400, "invalid credentials");
            return;
        }
        let token = (0, auth_1.CreateLoginToken)({
            id: dbUser._id.toString(),
            email: dbUser.email,
        });
        (0, utils_1.SendJsonResponse)(res, 200, { token: token });
    }
    catch (e) {
        console.error(e);
        (0, utils_1.SendJsonError)(res, 500, e);
    }
}));
