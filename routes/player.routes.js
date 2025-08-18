import express from "express";
import {
  authorizeUser,
  checkTournamentCreator,
} from "../middlewares/authorize.js";
import {
  getPlayerById,
  searchPlayersByName,
  updatePlayerOwnership,
  uploadTournamentPlayers,
} from "../controllers/player.controllers.js";
import { parseExcel } from "../middlewares/upload.js";

const playerRoutes = express.Router();

playerRoutes.post(
  "/upload/:tournamentId",
  authorizeUser(["user"]),
  checkTournamentCreator,
  parseExcel("file"),
  uploadTournamentPlayers
);
playerRoutes.get("/search", authorizeUser(["user"]), searchPlayersByName);
playerRoutes.put(
  "/purchase/:playerId",
  authorizeUser(["user", "admin"]),
  updatePlayerOwnership
);
playerRoutes.get("/:playerId", authorizeUser(["user", "admin"]), getPlayerById);

export default playerRoutes;
