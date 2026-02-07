type ChatRole = "user" | "assistant" | "system";

interface JwtUserPayload {
    id: string,
    email: string
}

export interface Message {
    role: string,
    content: string
}

export { ChatRole, JwtUserPayload };
