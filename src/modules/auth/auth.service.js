import jwt from "jsonwebtoken";
import { ProviderEnum, roleEnum } from "../../common/enum/index.js";
import {
  ConflictException,
  encrypt,
  NotFoundException,
} from "../../common/utils/index.js";
import { UserModel, findOne } from "../../DB/index.js";
import { hash, compare } from "bcrypt";
import {
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
  SYSTEM_REFRESH_TOKEN_SECRET_KEY,
  SYSTEM_TOKEN_SECRET_KEY,
  USER_REFRESH_TOKEN_SECRET_KEY,
  USER_TOKEN_SECRET_KEY,
} from "../../../config/config.service.js";
import {
  createLoginCredentials,
  generateToken,
  getTokenSignature,
} from "../../common/utils/security/token.security.js";
import { TokenTypeEnum } from "../../common/enum/security,enum.js";
export const signup = async (inputs) => {
  const { username, email, password, phone } = inputs;
  const checkUserExist = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (checkUserExist) {
    return ConflictException({ message: "Email exist" });
  }
  const hashValue = await hash(password, 8);
  const user = await UserModel.create([
    {
      username,
      email,
      password: hashValue,
      phone: await encrypt(phone),
      provider: ProviderEnum.System,
    },
  ]);
  return user;
};
export const login = async (inputs, issuer) => {
  const { email, password } = inputs;

  const user = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.System,
    },
  });

  if (!user) {
    return NotFoundException({ message: "invalid login credentials" });
  }
  const match = await compare(password, user.password);
  if (!match) {
    return NotFoundException({ message: "invalid login credentials" });
  }
  // const { accessSignature, refreshSignature, audience } =
  //   await getTokenSignature(user.role);

  // const accessToken = jwt.sign({ sub: user._id }, signature, {
  // //   issuer,
  // //   audience,
  // //   expiresIn: 1800,
  // // });
  // // const refreshToken = jwt.sign({ sub: user._id }, refreshSignature, {
  // //   issuer,
  // //   audience: refreshAudience,
  // //   expiresIn: "1y",
  // // });

  // const accessToken = await generateToken({
  //   payload: { sub: user._id },
  //   secret: accessSignature,
  //   options: {
  //     issuer,
  //     audience: [TokenTypeEnum.access, audience],
  //     expiresIn: ACCESS_EXPIRES_IN,
  //   },
  // });
  // const refreshToken = await generateToken({
  //   payload: { sub: user._id },
  //   secret: refreshSignature,
  //   options: {
  //     issuer,
  //     audience: [TokenTypeEnum.refresh, audience],
  //     expiresIn: REFRESH_EXPIRES_IN,
  //   },
  // });
  return await createLoginCredentials(user, issuer);
};
