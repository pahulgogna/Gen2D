import VideoMarquee from "@/components/VideoMarquee";
import { verifyJWT } from "./actions/auth/auth";
import { redirect } from "next/navigation";

let exampleVideos: string[] = [
  "https://res.cloudinary.com/dnv3vywqy/video/upload/v1771088355/0%3D%3D6990a9dc4b95bf05bb7927ab.mp4",
  "https://res.cloudinary.com/dnv3vywqy/video/upload/v1771014186/0%3D%3D698f882666b3e87818e84b0b.mp4",
  "https://res.cloudinary.com/dnv3vywqy/video/upload/v1771092824/0%3D%3D6990bb54e78ad09c9cc12774.mp4",
  "https://res.cloudinary.com/dnv3vywqy/video/upload/v1771144218/0%3D%3D6991841104f9fd1c119a0cd5.mp4",
  "https://res.cloudinary.com/dnv3vywqy/video/upload/v1770640552/0%3D%3D6989d41dde64a7afbf1cfe25.mp4",
  "https://res.cloudinary.com/dnv3vywqy/video/upload/v1771084290/0%3D%3D699099fe95efd29a57f28d61.mp4",
]


export default async function Home() {

  let user = await verifyJWT()

  if (user) {
    redirect("/c")
  }

  return <div className="w-full">
    <div className="pt-20 text-center text-8xl">
      Gen2D
    </div>
    <div className="text-2xl text-center pt-5">
      Generate high quality 2D animations using AI
    </div>
    <div className="border-y py-5 mt-30 border-slate-800">
      <VideoMarquee exampleVideos={exampleVideos}/>
    </div>
  </div>
}
