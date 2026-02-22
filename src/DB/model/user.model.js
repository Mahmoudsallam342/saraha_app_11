import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, roleEnum } from "../../common/enum/index.js";
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    DOB: Date,
    phone: String,
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },
    role: {
      type: Number,
      enum: Object.values(roleEnum),
      default: roleEnum.User,
    },
    confirmEmail: Date,
    profilePic: String,
  },
  {
    collection: "Route_users",
    timestamps: true,
    strict: true,
    strictQuery: true,
  },
);

userSchema
  .virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });
export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
