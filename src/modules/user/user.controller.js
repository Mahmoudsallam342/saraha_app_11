import { Router } from "express";
import {
  coverProfileImages,
  logout,
  profile,
  profileImage,
  rotateToken,
} from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";
import {
  authentication,
  authorization,
} from "../../middleware/authentication.midlleware.js";
import { TokenTypeEnum } from "../../common/enum/security,enum.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import {
  fileFieldValidation,
  localFileUpload,
} from "../../common/utils/multer/index.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js";
const router = Router();
router.post("/logout", authentication(), async (req, res, next) => {
  const account = await logout(req.user);
  return successResponse(res);
});
router.patch(
  "/profile-image",
  authentication(),
  localFileUpload({
    customPath: "user/profile",
    validation: fileFieldValidation.image,
  }).single("attachment"),
  validation(validators.profileImage),
  async (req, res, next) => {
    const account = await profileImage(req.file, req.user);
    return successResponse({ res, data: { account } });
  },
);
router.patch(
  "/profile-cover-image",
  authentication(),
  localFileUpload({
    customPath: "user/profile/cover",
    validation: [...fileFieldValidation.image, fileFieldValidation.video],
  }).any(),
  validation(validators.profileCoverImage),
  async (req, res, next) => {
    const account = await coverProfileImages(req.files, req.user);
    return successResponse({ res, data: { account } });
  },
);

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
