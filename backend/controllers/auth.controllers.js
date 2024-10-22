import User from "../models/user.model.js";

export const signupUser = async (req, res) => {
  const { username, lastName, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    lastName,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
};

export const logoutUser = async (req, res) => {
  res.status(200).json({ message: "Logged out" });
};
