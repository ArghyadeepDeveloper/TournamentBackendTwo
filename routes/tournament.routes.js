import express from "express";
import { createTournament } from "../controllers/tournament.controllers.js";
import { authorizeUser } from "../middlewares/authorize.js";

const tournamentRoutes = express.Router();

tournamentRoutes.post("/", authorizeUser(["admin", "user"]), createTournament);

export default tournamentRoutes;
