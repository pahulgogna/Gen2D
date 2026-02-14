"use client"

import DisplayMessage from "@/components/DisplayMessage"
import InputBox from "./InputBox"
import { useEffect, useRef, useState } from "react"
import { Message } from "@/lib/types"
import { redirect, useParams } from "next/navigation"
import { GenerateLLMResponse, GenerateVideo } from "@/app/actions/chats"

const DISPLAY_MESSAGE_WHILE_LLM_REQUEST = "Generating code for the animation"
const DISPLAY_MESSAGE_WHILE_UPDATES_LLM_REQUEST = "Generating updates..."
const DISPLAY_MESSAGE_WHILE_GENERATING_VIDEO = "Generating video..."

export default function OpenedMessages(
    {
        Messages
    }: {
        Messages: Message[]
    }) {

    const [messages, setMessages] = useState<Message[]>(Messages)
    const [sendingMessageRequest, setSendingMessageRequest] = useState(false)
    const [sendingVideoRequest, setSendingVideoRequest] = useState(false)
    const hasStarted = useRef(false);

    const { selectedChatId } = useParams<{ selectedChatId?: string }>();

    function onMessageSent(message: Message) {
        setMessages(m => m.concat(message))
    }

    async function handleTryVideoAgain(messageId: string) {
        setSendingVideoRequest(true)
        let videoResponse: {
            error: string;
            assets?: undefined;
        } | {
            assets: string[];
            error?: undefined;
        }
        try {
            videoResponse = await GenerateVideo(messageId);
            if (videoResponse.error) {
                console.log(videoResponse.error)
                setSendingVideoRequest(false)
                hasStarted.current = false
                return
            }
        } catch (e) {
            console.error(e);
            hasStarted.current = false
            setSendingVideoRequest(false)
            return;
        } finally {
            setSendingVideoRequest(false)
            setMessages(m => [...m, {
                content: "",
                role: "assistant",
                id: messageId,
                assets: videoResponse.assets ?? [],
                createdAt: new Date()
            }])
            hasStarted.current = false
        }

    }

    async function handleNewMessage() {
        if (!selectedChatId) {
            redirect("/c")
        }
        setSendingMessageRequest(true)
        let result: {
            error: string;
            response?: undefined;
            messageId?: undefined;
        } | {
            response: string;
            messageId: string;
            error: null;
        }
        try {
            result = await GenerateLLMResponse(selectedChatId)
            if (result.error) {
                console.error(result.error)
                hasStarted.current = false
                setSendingMessageRequest(false)
                return
            }
        } catch (e) {
            console.error(e)
            hasStarted.current = false
            setSendingMessageRequest(false)
            return
        } finally {
            hasStarted.current = false
            setSendingMessageRequest(false)
        }
        if (!result.messageId) {
            console.log("messageId not found!")
            return
        }

        setSendingVideoRequest(true)
        let videoResponse: {
            error: string;
            assets?: undefined;
        } | {
            assets: string[];
            error?: undefined;
        }
        try {
            videoResponse = await GenerateVideo(result.messageId);
            if (videoResponse.error) {
                console.log(videoResponse.error)
                setSendingVideoRequest(false)
                hasStarted.current = false
                return
            }
        } catch (e) {
            console.error(e);
            hasStarted.current = false
            setSendingVideoRequest(false)
            return;
        } finally {
            setSendingVideoRequest(false)
            setMessages(m => [...m, {
                content: result.response,
                role: "assistant",
                id: result.messageId,
                assets: videoResponse.assets ?? [],
                createdAt: new Date()
            }])
            hasStarted.current = false
        }
    }

    useEffect(() => {
        if (!messages.length || messages[messages.length - 1].role != "user" || sendingMessageRequest || hasStarted.current) {
            return
        }
        hasStarted.current = true

        handleNewMessage()
    }, [messages.length])


    return (
        <div>
            <div className="flex flex-col gap-5 mb-30">
                {messages.map((m, i) => {
                    return <DisplayMessage key={`${m.id}`} message={m} />
                })}
                {sendingMessageRequest
                    && <div className="animate-pulse">
                        {messages.length == 1 ? DISPLAY_MESSAGE_WHILE_LLM_REQUEST : DISPLAY_MESSAGE_WHILE_UPDATES_LLM_REQUEST}
                    </div>
                }
                {sendingVideoRequest
                    && <div className="animate-pulse">
                        {DISPLAY_MESSAGE_WHILE_GENERATING_VIDEO}
                    </div>
                }
                {
                    (sendingVideoRequest
                        ? null : messages.length
                        && (messages[messages.length - 1].assets.length == 0)
                        && messages[messages.length - 1].role == "assistant"
                        && messages[messages.length - 1].content.includes("from manim import *"))
                        ? <div>an error was encountered while generating the video.
                            <div className="text-blue-600 hover:cursor-pointer" onClick={() => handleTryVideoAgain(messages[messages.length - 1].id)}>
                                try again
                            </div>
                        </div>
                        : null
                }
            </div>
            <InputBox disabled={sendingMessageRequest || sendingVideoRequest} onMessageSent={onMessageSent} />
        </div>
    )
}
