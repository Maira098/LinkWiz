import User from "../models/User.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate("services");
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateProfile = async (req, res) => {
  const {
    fullName,
    city,
    bio,
    skills,
    wantedSkills
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      {
        fullName,
        city,
        bio,
        skills,
        wantedSkills
      },
      { new: true }
    );

    res.json({
      message: "Profile updated",
      user
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("services");
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
};