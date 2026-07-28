import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../src/models/User.js";
import Service from "../src/models/Service.js";
import Review from "../src/models/Review.js";
import Exchange from "../src/models/Exchange.js";
import Message from "../src/models/Message.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("Connected to MongoDB");

/* CLEAN DATABASE */

await Message.deleteMany();
await Exchange.deleteMany();
await Review.deleteMany();
await Service.deleteMany();
await User.deleteMany();

/* USERS */

const password = await bcrypt.hash("123456", 10);

const users = await User.insertMany([
{
fullName: "Ahmed Raza",
email: "ahmed@linkwiz.com",
password,
city: "Lahore",
bio: "Digital marketer helping businesses grow online.",
skills: ["SEO","Digital Marketing","Copywriting"],
wantedSkills: ["React","UI Design"]
},
{
fullName: "Fatima Khan",
email: "fatima@linkwiz.com",
password,
city: "Islamabad",
bio: "Frontend developer and UI enthusiast.",
skills: ["React","JavaScript","HTML","CSS"],
wantedSkills: ["Marketing","SEO"]
},
{
fullName: "Ali Hassan",
email: "ali@linkwiz.com",
password,
city: "Karachi",
bio: "Python developer and AI learner.",
skills: ["Python","Machine Learning"],
wantedSkills: ["Public Speaking"]
},
{
fullName: "Sara Ahmed",
email: "sara@linkwiz.com",
password,
city: "Rawalpindi",
bio: "Graphic designer specializing in branding.",
skills: ["Figma","Branding","Photoshop"],
wantedSkills: ["Web Development"]
},
{
fullName: "Usman Tariq",
email: "usman@linkwiz.com",
password,
city: "Faisalabad",
bio: "Professional photographer.",
skills: ["Photography","Lightroom"],
wantedSkills: ["Digital Marketing"]
}
]);

/* SERVICES */

const services = await Service.insertMany([
{
user: users[0]._id,
title: "SEO Mentorship",
description: "Learn SEO from beginner to advanced.",
price: 0,
tags: ["SEO","Marketing"]
},
{
user: users[1]._id,
title: "React Development",
description: "React fundamentals and projects.",
price: 0,
tags: ["React","Frontend"]
},
{
user: users[2]._id,
title: "Python Coaching",
description: "Python programming for beginners.",
price: 0,
tags: ["Python"]
},
{
user: users[3]._id,
title: "Figma Design",
description: "UI/UX design using Figma.",
price: 0,
tags: ["Figma","Design"]
},
{
user: users[4]._id,
title: "Photography Basics",
description: "Camera handling and composition.",
price: 0,
tags: ["Photography"]
}
]);

/* ATTACH SERVICES TO USERS */

users[0].services.push(services[0]._id);
users[1].services.push(services[1]._id);
users[2].services.push(services[2]._id);
users[3].services.push(services[3]._id);
users[4].services.push(services[4]._id);

for (const user of users) {
await user.save();
}

/* REVIEWS */

await Review.insertMany([
{
reviewer: users[1]._id,
service: services[0]._id,
rating: 5,
comment: "Excellent mentor."
},
{
reviewer: users[2]._id,
service: services[1]._id,
rating: 5,
comment: "Very clear explanations."
},
{
reviewer: users[3]._id,
service: services[2]._id,
rating: 4,
comment: "Helpful sessions."
},
{
reviewer: users[4]._id,
service: services[3]._id,
rating: 5,
comment: "Amazing design guidance."
}
]);

/* EXCHANGES */

await Exchange.insertMany([
{
requester: users[1]._id,
provider: users[0]._id,
serviceOffered: services[1]._id,
serviceRequested: services[0]._id,
status: "accepted",
message: "Let's exchange React for SEO."
},
{
requester: users[2]._id,
provider: users[3]._id,
serviceOffered: services[2]._id,
serviceRequested: services[3]._id,
status: "completed",
message: "Python for Figma."
}
]);

/* MESSAGES */

await Message.insertMany([
{
sender: users[1]._id,
receiver: users[0]._id,
text: "Hi Ahmed, interested in exchanging skills?"
},
{
sender: users[0]._id,
receiver: users[1]._id,
text: "Sure, let's schedule a session."
},
{
sender: users[2]._id,
receiver: users[3]._id,
text: "Can you teach me Figma?"
},
{
sender: users[3]._id,
receiver: users[2]._id,
text: "Absolutely."
}
]);

console.log("Database seeded successfully");
process.exit();