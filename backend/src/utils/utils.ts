import express from "express";

function SendJsonResponse(res: express.Response, status: number, data: any) {
  res.status(status).json(data);
  res.end()
}

function SendJsonError(res: express.Response, status: number, data: any) {
  res.status(status).json({
    error: data,
  });
  res.end()
}

export { SendJsonResponse, SendJsonError };
