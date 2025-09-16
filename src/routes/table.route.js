import express from "express";
import {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from "../controllers/table.controller.js";
import { protect } from "../middlewares/authMiddleware.js"; // middleware pour vérifier l'utilisateur

const router = express.Router();

// Toutes les routes sont protégées : l'utilisateur doit être connecté
router.use(protect);

router.get("/", getAllTables); // Lister toutes les tables
router.get("/:id", getTableById); // Récupérer une table par ID
router.post("/", createTable); // Créer une nouvelle table
router.put("/:id", updateTable); // Mettre à jour une table (complet)
router.patch("/:id", updateTable); // Mettre à jour une table (partiel)
router.delete("/:id", deleteTable); // Supprimer une table

export default router;
