import Tournament from "../models/tournament.model.js";
import User from "../models/user.model.js";

export const createTournament = async (req, res) => {
  try {
    const { name, participants = [] } = req.body;

    const userId = req.user.id;
    console.log("user id is ", req.user);

    // const alluser = await User.find();

    // console.log("all user is ", alluser);

    const user = await User.findById(userId);
    console.log("user found is ", user);
    if (!user) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const allParticipants = new Set([...participants, userId.toString()]);

    const tournament = new Tournament({
      name,
      participants: Array.from(allParticipants),
      createdBy: userId,
    });

    await tournament.save();

    res.status(201).json({
      message: "Tournament created successfully",
      tournament,
    });
  } catch (err) {
    console.error("Error creating tournament:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const uploadTournamentPlayers = (req, res, next) => {
  try {
  } catch (err) {}
};
