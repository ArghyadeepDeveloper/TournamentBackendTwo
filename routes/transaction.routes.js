import { Router } from "express";
import { upsertTransaction } from "../controllers/transaction.controllers.js";
import {
  authorizeUser,
  checkTournamentCreator,
} from "../middlewares/authorize.js";

const transactionRoutes = Router();

transactionRoutes.post(
  "/upsert/:tournamentId",
  authorizeUser(["user"]),
  checkTournamentCreator,
  upsertTransaction
);

export default transactionRoutes;
