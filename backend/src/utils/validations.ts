import zod from "zod";

const CreateUserRequest = zod.object({
  name: zod.string(),
  email: zod.email(),
  password: zod.string().min(8),
});

const UserLoginRequest = zod.object({
  email: zod.email(),
  password: zod.string().min(8),
});

const StoreMessageRequest = zod.object({
  content: zod.string().nonempty(),
  newChat: zod.boolean().optional(),
  chatId: zod.string().optional()
})

export { CreateUserRequest, UserLoginRequest, StoreMessageRequest };
