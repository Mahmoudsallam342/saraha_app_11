import { Router } from "express";
import { profile, rotateToken } from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";
import {
  authentication,
  authorization,
} from "../../middleware/authentication.midlleware.js";
import { TokenTypeEnum } from "../../common/enum/security,enum.js";
import { roleEnum } from "../../common/enum/user.enum.js";
const router = Router();

router.get(
  "/",
  authentication(),
  authorization([roleEnum.User, roleEnum.Admin]),
  async (req, res, next) => {
    const account = await profile(req.user);
    return successResponse({ res, data: { account } });
  },
);
router.get(
  "/rotate",
  authentication(TokenTypeEnum.refresh),
  async (req, res, next) => {
    const account = await rotateToken(
      req.user,
      `${req.protocol}://${req.host}`,
    );
    return successResponse({ res, data: { account } });
  },
);
export default router;
