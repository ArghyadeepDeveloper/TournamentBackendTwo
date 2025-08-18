import User from "../models/user.model.js";
import Tournament from "../models/tournament.model.js";
import Player from "../models/player.model.js";
import Transaction from "../models/transaction.model.js";

export const updateUserBalance = async (req, res) => {
  try {
    const { userId, amount, type } = req.body;
    const { tournamentId } = req.params;

    if (
      !userId ||
      typeof amount !== "number" ||
      !["add", "subtract"].includes(type)
    ) {
      return res
        .status(400)
        .json({ message: "userId, amount, and valid type are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let tournamentEntry = user.tournaments.find(
      (t) => t.tournamentId.toString() === tournamentId
    );
    if (!tournamentEntry) {
      const balance = type === "add" ? amount : -amount;
      user.tournaments.push({ tournamentId, balance });
    } else {
      tournamentEntry.balance += type === "add" ? amount : -amount;
    }

    await user.save();
    res.status(200).json({ message: "Balance updated successfully", user });
  } catch (err) {
    next(err);
  }
};

export const getUserBalance = async (req, res, next) => {
  try {
    const { userId, tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    if (!tournament.participants.includes(userId)) {
      return res
        .status(403)
        .json({ message: "User is not a participant in this tournament" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const tournamentData = user.tournaments.find(
      (t) => t.tournamentId.toString() === tournamentId
    );

    const balance = tournamentData ? tournamentData.balance : 0;
    res.status(200).json({ userId, tournamentId, balance });
  } catch (err) {
    next(err);
  }
};

export const getTournamentBalances = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    const users = await User.find({ _id: { $in: tournament.participants } });

    const balances = users.map((user) => {
      const tournamentData = user.tournaments.find(
        (t) => t.tournamentId.toString() === tournamentId
      );
      return {
        userId: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        balance: tournamentData ? tournamentData.balance : 0,
      };
    });

    res.status(200).json({ tournamentId, balances });
  } catch (err) {
    next(err);
  }
};

export const getUserPlayers = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;

    const userId = req.user.id;

    const transactions = await Transaction.find({ userId, tournamentId });

    const detailedTransactions = await Promise.all(
      transactions.map(async (t) => {
        const player = await Player.findById(t.playerId);
        return {
          playerId: player?._id,
          playerName: player?.playerName,
          overall: player?.overall,
          price: t.price,
        };
      })
    );

    res
      .status(200)
      .json({ userId, tournamentId, transactions: detailedTransactions });
  } catch (err) {
    next(err);
  }
};
