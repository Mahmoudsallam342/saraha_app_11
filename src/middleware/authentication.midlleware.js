import { TokenTypeEnum } from "../common/enum/security,enum.js";
import {
  BadRequestException,
  decodeToken,
  ForbiddenException,
} from "../common/utils/index.js";

export const authentication = (tokenType = TokenTypeEnum.access) => {
  return async (req, res, next) => {
    if (!req?.headers?.authorization) {
      throw BadRequestException({ message: "missing authorization key" });
    }
    req.user = await decodeToken({
      token: req.headers?.authorization,
      tokenType,
    });
    next();
  };
};
export const authorization = (
  accessRoles = [],
  tokenType = TokenTypeEnum.access,
) => {
  return async (req, res, next) => {
    if (!req?.headers?.authorization) {
      throw BadRequestException({ message: "missing authorization key" });
    }
    req.user = await decodeToken({
      token: req.headers?.authorization,
      tokenType,
    });
    next();
  };

  console.log(req.user.role);
  if (!accessRoles.includes(req.user.role)) {
    throw ForbiddenException({ message: "not allowed account" });
  }

  next();
};
