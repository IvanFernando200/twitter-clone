import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  coverPicture: { type: String, default: "" },
  followers: { type: Array, default: [] },
  followings: { type: Array, default: [] },
});

const User = mongoose.model("User", userSchema);

export default User;
