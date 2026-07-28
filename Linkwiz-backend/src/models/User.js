import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  city: {
    type: String,
    default: ""
  },

  bio: {
    type: String,
    default: ""
  },

  skills: [{
    type: String
  }],

  wantedSkills: [{
    type: String
  }],

  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  }],

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
},
{
  timestamps: true
}
);

export default mongoose.model("User", UserSchema);