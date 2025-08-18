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

export const addUserToTournament = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    const { email } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (tournament.participants.includes(user._id)) {
      return res.status(400).json({ message: "User already in tournament" });
    }

    tournament.participants.push(user._id);
    await tournament.save();

    // Initialize balance for this tournament if not already
    if (
      !user.tournaments.some((t) => t.tournamentId.toString() === tournamentId)
    ) {
      user.tournaments.push({ tournamentId: tournament._id, balance: 0 });
      await user.save();
    }

    res
      .status(200)
      .json({
        message: "User added to tournament",
        userId: user._id,
        tournamentId,
      });
  } catch (err) {
    next(err);
  }
};
