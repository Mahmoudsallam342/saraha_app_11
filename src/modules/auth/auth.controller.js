import { Router } from "express";
import { login, signup } from "./auth.service.js";
import { successResponse } from "../../common/utils/index.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
const router = Router();

router.post(
  "/signup",
  validation(validators.signup),
  async (req, res, next) => {
    const account = await signup(req.body);
    // if (validation.error) {
    //   throw BadRequestException({ message: "validation error", extra: error });
    // }
    return successResponse({ res, status: 201, data: { account } });
  },
);
router.post("/login", validation(validators.login), async (req, res, next) => {
  // console.log(`${req.protocol}://${req.host}`);

  const account = await login(req.body, `${req.protocol}://${req.host}`);
  return successResponse({ res, data: { account } });
});

export default router;
