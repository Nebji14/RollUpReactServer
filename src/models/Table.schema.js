import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true, minLength: 3 },
    discord: { type: String, required: true, minLength: 3 },
    roll20: { type: String, required: true, minLength: 3 },
    image: { type: String, default: null },

    nbJoueurs: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      required: true,
    },

    niveau: {
      type: String,
      enum: ["Débutant", "Intermédiaire", "Expert"],
      required: true,
    },

    systeme: {
      type: String,
      enum: [
        "D&D 5e",
        "Pathfinder",
        "Call of Cthulhu",
        "Shadowrun",
        "Vampire: La Mascarade",
      ],
      required: true,
    },

    frequence: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7],
      required: true,
    },

    synopsis: { type: String, required: true, minLength: 25 },
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;
