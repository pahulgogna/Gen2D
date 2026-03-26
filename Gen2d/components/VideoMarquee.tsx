"use client";

import Marquee from "react-fast-marquee";

export default function VideoMarquee({ exampleVideos }: { exampleVideos: string[] }) {
    return (
        <Marquee speed={100} gradient={false} className="overflow-y-hidden">
            {exampleVideos.map((video, i) => (
                <div key={i} className="w-fit h-fit border-x border-slate-800">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="rounded-xl"
                    >
                        <source src={video} />
                    </video>
                </div>
            ))}
        </Marquee >
    );
}
