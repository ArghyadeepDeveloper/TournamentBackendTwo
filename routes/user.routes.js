import { Router } from "express";
import {
  authorizeUser,
  checkTournamentCreator,
} from "../middlewares/authorize.js";
import {
  getTournamentBalances,
  getUserPlayers,
  updateUserBalance,
} from "../controllers/user.controllers.js";

const userRoutes = Router();

userRoutes.put(
  "/balance/:tournamentId",
  authorizeUser(["user", "admin"]),
  checkTournamentCreator,
  updateUserBalance
);
userRoutes.get(
  "/balance/:tournamentId/all",
  authorizeUser(["user", "admin"]),
  getTournamentBalances
);
userRoutes.get(
  "/balance/:tournamentId/user/:userId",
  authorizeUser(["user", "admin"]),
  getTournamentBalances
);
userRoutes.get(
  "/players/:tournamentId",
  authorizeUser(["user"]),
  getUserPlayers
);

export default userRoutes;
