const express = require("express");
const app = express();
require("dotenv").config();
const authRouter = require("./routers/auth");
const postsRouter = require("./routers/posts");
const userRouter = require("./routers/users");
const cors = require("cors");

const PORT = 8000;

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
