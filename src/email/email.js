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

//Reset du mot de passe
export const sendResetPasswordEmail = async (email, token) => {
  try {
    const resetUrl = `${process.env.CLIENT_URL}/ChangePass?token=${token}`;
    console.log("Lien reset généré :", resetUrl);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Réinitialisation de mot de passe",
      html: `
        <p>Bonjour,</p>
        <p>Tu as demandé à réinitialiser ton mot de passe.</p>
        <p><a href="${resetUrl}">Changer mon mot de passe</a></p>
        <p>⚠️ Ce lien est valide pendant 15 minutes.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Erreur lors de l'envoi de l'email reset :", error);
    throw error;
  }
};
