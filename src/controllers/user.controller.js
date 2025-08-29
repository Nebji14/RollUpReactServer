import bcrypt from "bcrypt";
import User from "../models/user.schema.js";

export const register = async (req, res) => {
  try {
    const { nom, pseudo, niveau, email, password } = req.body;
    const user = await User.findOne({ email });
    const thirdUser = await User.findOne({ pseudo });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user || thirdUser) {
      return res.status(400).json({ message: "Déjà inscrit" });
    }

    const newUser = new User({
      nom,
      pseudo,
      niveau,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "Inscription validée" });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {};
