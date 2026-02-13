export type ChatRole = "user" | "assistant" | "system";

export interface JwtUserPayload {
  id: string;
  email: string;
}

export interface DBUser {
  id: string;
  name: string;
  email: string;
}

export interface Message {
  id: string;
  role: string;
  content: string;
  assets: string[];
  createdAt: Date;
}

export interface Chat {
    id: string,
    name: string,
    user: string
}
