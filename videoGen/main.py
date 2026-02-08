import subprocess
import glob
import os
import sys
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

VIDEO_PY = "video.py"     # Manim source file
MEDIA_DIR = "./out"       # Custom Manim output dir
QUALITY_FLAG = "-ql"

if len(sys.argv) != 2:
    print("Usage: python render_and_upload_all.py <id>")
    sys.exit(1)

MESSAGE_ID = sys.argv[1]

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

render_cmd = [
    "manim",
    QUALITY_FLAG,
    "--media_dir", MEDIA_DIR,
    "--format", "mp4",
    "--disable_caching",
    VIDEO_PY,
]

subprocess.run(render_cmd, check=True)

video_pattern = os.path.join(
    MEDIA_DIR, "videos", "video", "*", "*.mp4"
)

videos = sorted(glob.glob(video_pattern))

if not videos:
    print("ERROR: No rendered videos found.")
    sys.exit(1)

uploaded_urls = []

for index, video_path in enumerate(videos):
    new_name = f"{index}=={MESSAGE_ID}.mp4"
    new_path = os.path.join(os.path.dirname(video_path), new_name)

    os.rename(video_path, new_path)

    result = cloudinary.uploader.upload(
        new_path,
        resource_type="video",
        public_id=new_name.replace(".mp4", ""),
    )

    uploaded_urls.append(result["secure_url"])


DELETE_OUTPUT_CMD = [
    "rm",
    "-rf",
    MEDIA_DIR
]

subprocess.run(DELETE_OUTPUT_CMD, check=True)

print("="*13)
for url in uploaded_urls:
    print(url, ",")
