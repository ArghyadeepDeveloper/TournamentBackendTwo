import express from "express";
import {
  addUserToTournament,
  createTournament,
} from "../controllers/tournament.controllers.js";
import {
  authorizeUser,
  checkTournamentCreator,
} from "../middlewares/authorize.js";

const tournamentRoutes = express.Router();

tournamentRoutes.post("/", authorizeUser(["admin", "user"]), createTournament);
tournamentRoutes.post(
  "/user/:tournamentId",
  authorizeUser(["admin", "user"]),
  checkTournamentCreator,
  addUserToTournament
);

export default tournamentRoutes;
