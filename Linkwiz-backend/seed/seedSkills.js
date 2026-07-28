import mongoose from "mongoose";
import Skill from "../src/models/Skill.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const data = JSON.parse(
  fs.readFileSync("../Data-Scraper/skills_seed.json", "utf8")
);

await Skill.deleteMany();
await Skill.insertMany(data);

console.log("Skills seeded successfully.");
process.exit();