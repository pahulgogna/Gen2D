import express from "express";

function SendJsonResponse(res: express.Response, status: number, data: any) {
  res.status(status).json(data);
  res.end();
}

function SendJsonError(res: express.Response, status: number, data: any) {
  res.status(status).json({
    error: data,
  });
  res.end();
}

function SetStreamHeaders(res: express.Response) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
}

export { SendJsonResponse, SendJsonError, SetStreamHeaders };
