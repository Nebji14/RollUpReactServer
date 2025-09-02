import mongoose from "mongoose";

// Schéma pour les utilisateurs temporaires (avant validation de l'email)
const tempUserSchema = new mongoose.Schema(
  {
    // Nom complet de l'utilisateur
    nom: { type: String, required: true },

    // Pseudo unique choisi par l'utilisateur
    pseudo: { type: String, required: true, unique: true },

    // Niveau de compétence de l'utilisateur (enum limité)
    niveau: {
      type: String,
      enum: ["Débutant", "Intermédiaire", "Expert"],
      default: "Débutant", // Valeur par défaut si non renseignée
    },

    // Email unique et obligatoire
    email: { type: String, required: true, unique: true },

    // Mot de passe hashé avant sauvegarde
    password: { type: String, required: true },

    // Token de validation envoyé par email
    token: String,
  },
  {
    // Ajoute automatiquement createdAt et updatedAt
    timestamps: true,
  }
);

// Index pour faire expirer automatiquement les documents après 15 minutes (900 secondes)
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

// Modèle Mongoose pour les utilisateurs temporaires
const TempUser = mongoose.model("TempUser", tempUserSchema);

export default TempUser;
