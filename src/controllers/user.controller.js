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

export const login = async (req, res) => {
  const { pseudo, password } = req.body;
  console.log(req.body);

  let user;

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (emailRegex.test(pseudo)) {
    user = await User.findOne({ email: pseudo });
    console.log(user);
  } else {
    user = await User.findOne({ pseudo: pseudo });
    console.log(user);
  }

  if (!user) {
    return res
      .status(400)
      .json({ message: "Email ou nom d'utilisateur incorrect" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Mot de passe incorrect" });
  }

  // Si tout est bon
  res.status(200).json({ user, message: "Connexion réussie" });
};
