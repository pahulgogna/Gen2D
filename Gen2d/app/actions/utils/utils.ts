import { Env } from "@/lib/config";
import { spawn } from "child_process";

export function RenderVideoFromCodeAndStoreInCloudinary(
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

    docker.stdin.write(extractRawPythonCode(manimCode));
    docker.stdin.end();
  });
}

export function extractRawPythonCode(input: string): string {
  const text = input.trim();

  if (!text.startsWith("```")) {
    return text;
  }

  const lines = text.split(/\r?\n/);

  lines.shift();

  if (lines.length && lines[lines.length - 1].trim() === "```") {
    lines.pop();
  }

  return lines.join("\n").trim();
}
