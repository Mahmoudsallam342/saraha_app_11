import { port } from "../config/config.service.js";
import { globalErrorHandling } from "./common/utils/index.js";
import { DBConnection } from "./DB/index.js";
import { authRouter } from "./modules/index.js";
import express from "express";
import { userRouter } from "./modules/user/index.js";

async function bootstrap() {
  //! url

  console.log("signup url (localhost:3000/auth/signup)");

  const app = express();
  //db
  await DBConnection();
  //convert buffer data
  app.use(express.json());
  //application routing
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  //invalid routing
  app.use("{/*dummy}", (req, res) => {
    return res.status(404).json({ message: "Invalid application routing" });
  });

  //error-handling
  app.use(globalErrorHandling);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
export default bootstrap;
