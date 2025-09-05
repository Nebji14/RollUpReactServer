import bcrypt from "bcrypt";
import User from "../models/user.schema.js";
import TempUser from "../models/tempuser.schema.js";
import jwt from "jsonwebtoken";
import { sendConfirmationEmail } from "../email/email.js";
import dotenv from "dotenv";

dotenv.config();

// Génère un token JWT temporaire pour confirmer l'email
const createTokenEmail = (email) => {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "15min" });
};

// Contrôleur d'inscription
export const register = async (req, res) => {
  try {
    const { nom, pseudo, niveau, email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà dans User ou TempUser
    const existingUserMail = await User.findOne({ email });
    const existingUserPseudo = await User.findOne({ pseudo });
    const existingTempUserMail = await TempUser.findOne({ email });
    const existingTempUserPseudo = await TempUser.findOne({ pseudo });

    if (existingUserMail || existingUserPseudo) {
      return res.status(400).json({ message: "Déjà inscrit" });
    } else if (existingTempUserMail || existingTempUserPseudo) {
      return res.status(400).json({ message: "Vérifiez vos email" });
    }

    // Création d'un token temporaire et envoi de l'email de confirmation
    const token = createTokenEmail(email);
    await sendConfirmationEmail(email, token);

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création et sauvegarde d'un utilisateur temporaire
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

  let user;

  // Détecte si l'identifiant est un email
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  // Recherche de l'utilisateur par email ou pseudo
  if (emailRegex.test(pseudo)) {
    user = await User.findOne({ email: pseudo });
  } else {
    user = await User.findOne({ pseudo: pseudo });
  }

  // Vérifie l'existence de l'utilisateur
  if (!user) {
    return res
      .status(400)
      .json({ message: "Email ou nom d'utilisateur incorrect" });
  }

  // Vérifie le mot de passe avec bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Mot de passe incorrect" });
  }

  // Génère un JWT pour l'utilisateur connecté
  const token = jwt.sign({}, process.env.SECRET_KEY, {
    subject: user._id.toString(),
    expiresIn: "7d",
    algorithm: "HS256",
  });

  // Stocke le token en cookie HTTP-only
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ user, message: "Connexion réussie" });
};

// Vérification du mail via token
export const verifyMail = async (req, res) => {
  const { token } = req.params;

  try {
    // Décodage du token pour retrouver l'email
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Recherche de l'utilisateur temporaire correspondant au token
    const tempUser = await TempUser.findOne({ email: decoded.email, token });

    if (!tempUser) {
      return res.redirect(`${process.env.CLIENT_URL}/?message=error`);
    }

    // Création d'un utilisateur définitif à partir du TempUser
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

// Récupération de l'utilisateur courant via token
export const currentUser = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    try {
      // Décodage du token pour obtenir l'ID de l'utilisateur
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      // Récupération de l'utilisateur via son ID
      const currentUser = await User.findById(decodedToken.sub);

      if (currentUser) {
        res.status(200).json(currentUser);
      } else {
        res.status(400).json(null);
      }
    } catch (error) {
      res.status(400).json(null);
    }
  } else {
    res.status(400).json(null);
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    // sameSite: "None",
  });
  res.status(200).json({ message: "Déconnexion réussie" });
};
