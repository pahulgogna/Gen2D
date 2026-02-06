"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendJsonResponse = SendJsonResponse;
exports.SendJsonError = SendJsonError;
function SendJsonResponse(res, status, data) {
    res.status(status).json(data);
    res.end();
}
function SendJsonError(res, status, data) {
    res.status(status).json({
        error: data,
    });
    res.end();
}
