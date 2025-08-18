import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    playerName: { type: String, required: true },
    nationality: { type: String, required: true },
    position: { type: String, required: true },
    overall: { type: Number, required: true },
    value: { type: String, required: true },
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    price: { type: Number },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Player", playerSchema);
