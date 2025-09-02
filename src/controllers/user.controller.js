import bcrypt from "bcrypt";
import User from "../models/user.schema.js";
import TempUser from "../models/tempuser.schema.js";
import jwt from "jsonwebtoken";
import { sendConfirmationEmail } from "../email/email.js";
import dotenv from "dotenv";

dotenv.config();

const createTokenEmail = (email) => {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "15min" });
};

// Contrôleur d'inscription
export const register = async (req, res) => {
  try {
    const { nom, pseudo, niveau, email, password } = req.body;

    // Vérification si l'utilisateur existe déjà par email ou pseudo
    const existingUserMail = await User.findOne({ email });
    const existingUserPseudo = await User.findOne({ pseudo });
    const existingTempUserMail = await TempUser.findOne({ email });
    const existingTempUserPseudo = await TempUser.findOne({ pseudo });

    if (existingUserMail || existingUserPseudo) {
      return res.status(400).json({ message: "Déjà inscrit" });
    } else if (existingTempUserMail || existingTempUserPseudo) {
      return res.status(400).json({ message: "Vérifiez vos email" });
    }

    const token = createTokenEmail(email);
    await sendConfirmationEmail(email, token);

    // Hachage du mot de passe pour sécuriser le stockage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const tempUser = new TempUser({
      nom,
      pseudo,
      niveau,
      email,
      password: hashedPassword,
      token,
    });

    await tempUser.save();
    res.status(200).json({
      message:
        "Un email de validation a été envoyé sur votre boite mail. (Pensez à verifier vos courriers indésirable)",
    });
  } catch (error) {
    console.log(error);
  }
};

// Contrôleur de connexion
export const login = async (req, res) => {
  const { pseudo, password } = req.body;
  console.log(req.body);

  let user;

  // Expression régulière pour détecter si l'identifiant est un email
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  // Recherche de l'utilisateur par email ou pseudo
  if (emailRegex.test(pseudo)) {
    user = await User.findOne({ email: pseudo });
    console.log(user);
  } else {
    user = await User.findOne({ pseudo: pseudo });
    console.log(user);
  }

  // Vérification de l'existence de l'utilisateur
  if (!user) {
    return res
      .status(400)
      .json({ message: "Email ou nom d'utilisateur incorrect" });
  }

  // Vérification du mot de passe via bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Mot de passe incorrect" });
  }

  // Authentification réussie
  res.status(200).json({ user, message: "Connexion réussie" });
};

export const verifyMail = async (req, res) => {
  const { token } = req.params;
  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const tempUser = await TempUser.findOne({ email: decoded.email, token });
    console.log(tempUser);

    if (!tempUser) {
      return res.redirect(`${process.env.CLIENT_URL}/?message=error`);
    }

    const newUser = new User({
      nom: tempUser.nom,
      pseudo: tempUser.pseudo,
      niveau: tempUser.niveau,
      email: tempUser.email,
      password: tempUser.password,
    });

    await newUser.save();
    await TempUser.deleteOne({ email: tempUser.email });
    res.redirect(`${process.env.CLIENT_URL}/?message=success`);
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.redirect(`${process.env.CLIENT_URL}/?message=error`);
    }
  }
};
