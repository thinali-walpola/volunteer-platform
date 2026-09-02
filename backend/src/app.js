import express from "express";

const app =express();
import userRouter from "./routes/user_router.js";
import postRouter from "./routes/post_router.js";

app.use(express.json());
app.use("/api/v1/users",userRouter);
app.use("/api/v1posts",postRouter);
export default app;