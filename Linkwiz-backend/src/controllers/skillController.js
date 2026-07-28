import Skill from "../models/Skill.js";

export const getSkills = async (req, res) => {
  const skills = await Skill.find().sort({ name: 1 });
  res.json(skills);
};