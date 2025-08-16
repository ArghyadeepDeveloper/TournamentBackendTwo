import express from "express";
import {
  authorizeUser,
  checkTournamentCreator,
} from "../middlewares/authorize.js";
import { uploadTournamentPlayers } from "../controllers/tournament.controllers.js";

const playerRoutes = express.Router();

playerRoutes.post(
  "/",
  authorizeUser(["user"]),
  checkTournamentCreator,
  uploadTournamentPlayers
);

export default playerRoutes;
