import jwt from "jsonwebtoken";
import Tournament from "../models/tournament.model.js";
import User from "../models/user.model.js";

export const authorizeUser = () => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "User not found or deleted" });
      }

      console.log("user from auth is ", user._id);

      req.user = { id: user._id, role: user.role };
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
  };
};

export const checkTournamentCreator = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    const userId = req.user.id;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    if (tournament.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied: Not the creator" });
    }

    next();
  } catch (error) {
    handleError(res, error);
  }
};
