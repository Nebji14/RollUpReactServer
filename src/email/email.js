import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Création du transporteur Nodemailer avec Gmail
// Ce transporteur sera utilisé pour envoyer les emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Adresse email expéditrice
    pass: process.env.EMAIL_PASS, // Mot de passe ou token d'application
  },
});

// Fonction pour envoyer un email de confirmation
export const sendConfirmationEmail = async (email, token) => {
  // Configuration de l'email
  const mailOption = {
    from: process.env.EMAIL_USER, // Expéditeur
    to: email, // Destinataire
    subject: "Confirmation d'inscription", // Sujet de l'email
    html: `<p>Bienvenue sur notre site! Cliquez sur le lien suivant pour valider votre inscription : <a href=${process.env.API_URL}/user/verifyMail/${token}>Confirmer</a></p>`, // Corps du mail en HTML
  };

  // Envoi de l'email via le transporteur configuré
  await transporter.sendMail(mailOption);
};
