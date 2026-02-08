import express from "express";
import { Env } from "../config/config";
import { spawn } from "child_process";

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

function RenderVideoFromCodeAndStoreInCloudinary(
  manimCode: string,
  id: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const docker = spawn("docker", [
      "run",
      `-e CLOUDINARY_CLOUD_NAME=${Env.CloudinaryCloudName}`,
      `-e CLOUDINARY_API_KEY=${Env.GoogleApiKey}`,
      `-e CLOUDINARY_API_SECRET=${Env.CloudinaryApiSecret}`,
      "-i",
      "python-gen2d:latest",
      "bash",
      "-c",
      `cat > video.py && python main.py ${id}`,
    ]);

    let stdout = "";
    let stderr = "";

    docker.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    docker.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    docker.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`Exit code ${code}\n${stderr}`));
      }
    });

    docker.stdin.write(manimCode);
    docker.stdin.end();
  });
}

export {
  SendJsonResponse,
  SendJsonError,
  SetStreamHeaders,
  RenderVideoFromCodeAndStoreInCloudinary,
};
