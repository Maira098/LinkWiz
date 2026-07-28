import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Service from "../models/Service.js";

export const register = async (req, res) => {
  const { fullName, email, password, city, skills, wantedSkills } = req.body;

  try {
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Email already used",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
  fullName,
  email,
  password: hashed,
  city,
  skills,
  wantedSkills
});

// Automatically create first service
if (skills && skills.length > 0) {
  const service = await Service.create({
    user: user._id,
    title: `${skills[0]} Skill Exchange`,
    description: `Offering ${skills[0]} skills`,
    price: 0,
    tags: [skills[0]]
  });

  user.services.push(service._id);
  await user.save();
}
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const populatedUser = await User.findById(user._id)
    .populate("services");
    res.json({
      message: "Registered successfully",
      token,
      user: populatedUser,
    });
  } catch (err) {
  console.error("REGISTER ERROR:");
  console.error(err);

  res.status(500).json({
    message: err.message
  });
}
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate("services");

    if (!user) return res.status(404).json({ message: "No user found" });

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ message: "Logged in", token, user });
  } catch (err) {
    res.status(500).json(err);
  }
};
