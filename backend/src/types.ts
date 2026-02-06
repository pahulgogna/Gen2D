type ChatRole = "user" | "assistant" | "system";

interface JwtUserPayload {
    id: string,
    email: string
}


export { ChatRole, JwtUserPayload };
