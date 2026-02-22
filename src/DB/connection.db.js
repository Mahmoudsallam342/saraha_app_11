import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";
import { UserModel } from "./model/user.model.js";
export const DBConnection = async () => {
  try {
    const result = await mongoose.connect(DB_URI);
    await UserModel.syncIndexes();
    console.log("db connected successfully🚀");
  } catch (error) {
    console.log("db connected failed❌");
  }
};
