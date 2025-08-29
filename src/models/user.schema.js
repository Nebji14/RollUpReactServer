import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    pseudo: { type: String, required: true, unique: true },
    niveau: {
      type: String,
      enum: ["Débutant", "Intermédiaire", "Expert"],
      default: "Débutant",
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
