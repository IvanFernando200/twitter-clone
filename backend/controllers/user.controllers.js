import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.find({}).sort({ followers: -1 }).limit(5);
    if (!user) return res.status(404).json({ message: "No users found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    console.log(userToModify);
    console.log(currentUser);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow users" });
    }
    if (!userToModify || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.followings.includes(id);

    if (isFollowing) {
      // unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: id },
      });
      // Send notification to the user
      const newNotification = await Notification.create({
        from: req.user._id,
        to: id,
        type: "follow",
      });
      await newNotification.save();

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // follow the user
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      // Send notification to the user
      const newNotification = await Notification.create({
        from: req.user._id,
        to: id,
        type: "follow",
      });
      await newNotification.save();

      // TODO return the id of the user as a response
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const currentUser = req.user;
  const { username, lastName, email, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const id = req.user._id;
  try {
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!newPassword && !currentPassword) {
      return res
        .status(400)
        .json({ message: "Please provide both current and new password" });
    }
    if (user._id.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const result = await cloudinary.uploader.upload(profileImg);
      profileImg = result.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const result = await cloudinary.uploader.upload(coverImg);
      coverImg = result.secure_url;
    }

    user.username = username || user.username;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    const updatedUser = await user.save();
    updatedUser.password = null;

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("followings");

    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
