import express from "express"
import { Env } from "./config/config"
import { userRouter } from "./services/user"
import { chatRouter } from "./services/chat"

const app = express()

const subrouterV1 = express.Router()
subrouterV1.use("/user", userRouter)
subrouterV1.use("/chat", chatRouter)

app.use("/api/v1", subrouterV1)

app.listen(Env.PORT, (err) => {
    if (err) {
        console.error("error while starting the server: ", err)
    } else {
        console.error("server started on port: ", Env.PORT)
    }
})
