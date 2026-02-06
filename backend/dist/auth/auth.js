"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLoginToken = CreateLoginToken;
exports.JwtVerificationMiddleware = JwtVerificationMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const expireTime = "7d";
function CreateLoginToken(payload) {
    return jsonwebtoken_1.default.sign(payload, config_1.Env.JwtSecret, { expiresIn: expireTime, algorithm: "HS256" });
}
function JwtVerificationMiddleware(req, res, next) {
    let token = req.header("Authorization");
    if (!token) {
        permissionDenied(res);
        return;
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, config_1.Env.JwtSecret, { algorithms: ["HS256"] });
        res.locals.user = decoded;
    }
    catch (e) {
        console.log(e);
        permissionDenied(res);
        return;
    }
    next();
}
function permissionDenied(res) {
    res.status(401).json("permission denied");
}
