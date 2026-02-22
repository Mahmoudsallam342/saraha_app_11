import { Router } from "express";
import { login, signup } from "./auth.service.js";
import { successResponse } from "../../common/utils/index.js";

const router = Router();
router.post("/signup", async (req, res, next) => {
  const account = await signup(req.body);
  return successResponse({ res, status: 201, data: { account } });
});
router.post("/login", async (req, res, next) => {
  // console.log(`${req.protocol}://${req.host}`);

  const account = await login(req.body, `${req.protocol}://${req.host}`);
  return successResponse({ res, data: { account } });
});

export default router;
