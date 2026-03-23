import {
  createLoginCredentials,
  decodeToken,
} from "../../common/utils/security/token.security.js";
export const logout = async (user) => {
  user.changeCredentialsTime = new Date();
  await user.save();
  return user;
};
export const profileImage = async (file, user) => {
  user.profilepicture = file.finalPath;
  await user.save();
  return user;
};
export const coverProfileImages = async (files, user) => {
  user.coverProfilePictures = files.map((file) => file.finalPath);
  await user.save();
  return user;
};
export const profile = async (user) => {
  return user;
};
export const rotateToken = async (user, issuer) => {
  return await createLoginCredentials(user, issuer);
};
