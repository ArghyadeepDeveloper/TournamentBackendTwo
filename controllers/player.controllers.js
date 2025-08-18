import Player from "../models/player.model.js";
import Tournament from "../models/tournament.model.js";

export const uploadTournamentPlayers = async (req, res) => {
  try {
    if (!req.excelData || req.excelData.length === 0) {
      return res
        .status(400)
        .json({ message: "No data found in uploaded Excel" });
    }

    const { tournamentId } = req.body;
    if (!tournamentId) {
      return res.status(400).json({ message: "TournamentId is required" });
    }

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const playersToInsert = req.excelData
      .filter((row) => parseInt(row["Overall"]) > 77)
      .map((row) => ({
        playerName: row["Player Name"],
        nationality: row["Nationality"],
        position: row["Position 1"],
        overall: row["Overall"],
        value: row["Value"],
        tournamentId,
        ownerId: null,
        price: null,
      }));

    const insertedPlayers = await Player.insertMany(playersToInsert);

    return res.status(201).json({
      message: "Players uploaded successfully",
      insertedCount: insertedPlayers.length,
    });
  } catch (err) {
    console.error("Error in uploadTournamentPlayers:", err);
    return res
      .status(500)
      .json({ message: "Failed to upload players", error: err.message });
  }
};

export const searchPlayersByName = async (req, res) => {
  try {
    const { query, position } = req.query; // e.g., /api/players/search?query=thib&position=GK

    const allowedPositions = [
      "GK",
      "LB",
      "CB",
      "RB",
      "LM",
      "RM",
      "CDM",
      "CM",
      "CAM",
      "RW",
      "ST",
      "LW",
    ];

    if (
      (!query || query.trim() === "") &&
      (!position || position.trim() === "")
    ) {
      return res.status(400).json({
        message:
          "At least one search parameter (query or position) is required",
      });
    }

    const filter = {};
    if (query && query.trim() !== "") {
      filter.playerName = { $regex: query, $options: "i" }; // partial name match
    }

    if (position && position.trim() !== "") {
      if (!allowedPositions.includes(position)) {
        return res.status(400).json({ message: "Invalid position value" });
      }
      filter.position = position; // exact match
    }

    const players = await Player.find(filter);
    res.status(200).json(players);
  } catch (error) {
    console.error("Error searching players:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePlayerOwnership = async (req, res) => {
  try {
    const { playerId } = req.params; // get from route param
    const { ownerId, price } = req.body;

    if (!ownerId || !price) {
      return res
        .status(400)
        .json({ message: "OwnerId and Price are required" });
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      { ownerId, price },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    return res.status(200).json({
      message: "Player updated successfully",
      player: updatedPlayer,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const { playerId } = req.params;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player);
  } catch (error) {
    next(error);
  }
};
