import mongoose, { Schema } from "mongoose";

// Définition du schéma utilisateur avec Mongoose
const userSchema = new mongoose.Schema(
  {
    // Nom complet de l'utilisateur
    nom: { type: String, required: true },

    // Pseudo unique (identifiant choisi par l'utilisateur)
    pseudo: { type: String, required: true, unique: true },

    // Niveau de l'utilisateur avec valeurs limitées (enum)
    niveau: {
      type: String,
      enum: ["Débutant", "Intermédiaire", "Expert"],
      default: "Débutant", // Valeur par défaut
    },

    // Email unique et obligatoire
    email: { type: String, required: true, unique: true },

    // Mot de passe (hashé avant sauvegarde)
    password: { type: String, required: true },
  },
  {
    // Ajout automatique des champs createdAt et updatedAt
    timestamps: true,
  }
);

// Création du modèle basé sur le schéma
const User = mongoose.model("User", userSchema);

export default User;
