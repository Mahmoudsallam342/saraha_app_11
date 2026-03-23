import jwt from "jsonwebtoken";
import {
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
  SYSTEM_REFRESH_TOKEN_SECRET_KEY,
  SYSTEM_TOKEN_SECRET_KEY,
  USER_REFRESH_TOKEN_SECRET_KEY,
  USER_TOKEN_SECRET_KEY,
} from "../../../../config/config.service.js";
import { AudienceEnum, TokenTypeEnum } from "../../enum/security,enum.js";
import { roleEnum } from "../../enum/user.enum.js";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../response/error.response.js";
import { findOne } from "../../../DB/database.service.js";

import { UserModel } from "../../../DB/index.js";
import { randomUUID } from "node:crypto";
export const generateToken = async ({
  payload = {},
  secret = USER_TOKEN_SECRET_KEY,
  options = {},
} = {}) => {
  return jwt.sign(payload, secret, options);
};
export const verifyToken = async ({
  token,
  secret = USER_TOKEN_SECRET_KEY,
} = {}) => {
  return jwt.verify(token, secret);
};

export const getTokenSignature = async (role) => {
  let accessSignature = undefined;
  let refreshSignature = undefined;
  let audience = AudienceEnum.User;
  //   let refreshAudience = "User";
  switch (role) {
    case roleEnum.Admin:
      accessSignature = SYSTEM_TOKEN_SECRET_KEY;
      refreshSignature = SYSTEM_REFRESH_TOKEN_SECRET_KEY;
      audience = AudienceEnum.System;
      //   refreshAudience = "Refresh_System";
      break;

    default:
      accessSignature = USER_TOKEN_SECRET_KEY;
      refreshSignature = USER_REFRESH_TOKEN_SECRET_KEY;
      audience = AudienceEnum.User;
      //   refreshAudience = "Refresh_User";

      break;
  }
  return { accessSignature, refreshSignature, audience };
};
export const getSignatureLevel = async (audienceType) => {
  let signatureLevel;
  switch (audienceType) {
    case AudienceEnum.System:
      signatureLevel = roleEnum.Admin;
      break;

    default:
      signatureLevel = roleEnum.User;

      break;
  }
  return signatureLevel;
};

export const createLoginCredentials = async (user, issuer) => {
  const { accessSignature, refreshSignature, audience } =
    await getTokenSignature(user.role);
  const jwtid = randomUUID();
  const accessToken = await generateToken({
    payload: { sub: user._id },
    secret: accessSignature,
    options: {
      issuer,
      audience: [TokenTypeEnum.access, audience],
      expiresIn: ACCESS_EXPIRES_IN,
      jwtid,
    },
  });
  const refreshToken = await generateToken({
    payload: { sub: user._id },
    secret: refreshSignature,
    options: {
      issuer,
      audience: [TokenTypeEnum.refresh, audience],
      expiresIn: REFRESH_EXPIRES_IN,
      jwtid,
    },
  });
  return { accessToken, refreshToken };
};

export const decodeToken = async ({
  token,
  tokenType = TokenTypeEnum.access,
} = {}) => {
  const decode = jwt.decode(token);
  console.log({ decode });
  if (!decode?.aud?.length) {
    throw new BadRequestException({ message: "fail to decode token" });
  }
  const [decodeTokenType, audienceType] = decode.aud;
  if (decodeTokenType !== tokenType) {
    throw new BadRequestException({ message: "invalid token type" });
  }
  const signatureLevel = await getSignatureLevel(audienceType);
  console.log({ signatureLevel });

  const { accessSignature, refreshSignature } =
    await getTokenSignature(signatureLevel);
  console.log({ accessSignature, refreshSignature });
  const verifiedData = await verifyToken({
    token,
    secret:
      tokenType == TokenTypeEnum.refresh ? refreshSignature : accessSignature,
  });
  const user = await findOne({
    model: UserModel,
    filter: { _id: verifiedData.sub },
  });
  if (!user) {
    throw new UnauthorizedException({ message: "Not Register account" });
  }
  if (
    user.changeCredentialsTime &&
    user.changeCredentialsTime?.getTime() >= decode.iat * 1000
  ) {
    throw NotFoundException({ message: "invalid login session" });
  }
  return user;
};
