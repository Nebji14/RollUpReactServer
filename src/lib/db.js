import mongoose from "mongoose";

// Fonction de connexion à MongoDB
export const connectDB = async () => {
  try {
    // Connexion à la base MongoDB via l'URI défini dans les variables d'environnement
    const connect = await mongoose.connect(process.env.MONGO_URI);

    // Log en cas de succès avec affichage de l'hôte
    console.log(`MongoDB connected : ${connect.connection.host}`);
  } catch (error) {
    // Log en cas d'échec de connexion
    console.log("MongoDB connection error", error);
  }
};
