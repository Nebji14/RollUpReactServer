import Table from "../models/Table.js";

//Lister toutes les tables
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: -1 });
    res.status(200).json(tables);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer une table par ID
export const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table non trouvée" });
    res.status(200).json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Créer une nouvelle table
export const createTable = async (req, res) => {
  try {
    const {
      titre,
      discord,
      roll20,
      image,
      nbJoueurs,
      niveau,
      systeme,
      frequence,
      synopsis,
    } = req.body;

    const table = await Table.create({
      titre,
      discord,
      roll20,
      image,
      nbJoueurs,
      niveau,
      systeme,
      frequence,
      synopsis,
    });

    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une table
export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!table) return res.status(404).json({ message: "Table non trouvée" });
    res.status(200).json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une table
export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ message: "Table non trouvée" });
    res.status(200).json({ message: "Table supprimée avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
