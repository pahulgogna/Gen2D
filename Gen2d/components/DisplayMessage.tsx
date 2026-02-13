import MarkdownRenderer from "./MarkdownRenderer";
import { Message } from "@/lib/types";

function DisplayMessage({ message }: { message: Message }) {

    if (message.role === "assistant") {
        return (
            <div className="flex justify-start">
                <div className="flex flex-col gap-5">
                    <MarkdownRenderer content={message.content} />
                    {/* {message.content} */}

                    {message.assets.length != 0 ?
                        <div>
                            <p className="font-bold text-lg">Generated videos:</p>
                            {message.assets.map((a, i) => {
                                return <video key={i} className="w-4/5 rounded-xl" autoPlay controls>
                                    <source src={a} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            })}

                        </div>
                        :
                        null
                    }
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-end">
            <div className="w-fit shadow-md bg-neutral-700 p-3 rounded-xl">
                {message.content}
            </div>
        </div>
    );
}

export default DisplayMessage;
