import Transaction from "../models/transaction.model.js";

export const upsertTransaction = async (req, res, next) => {
  try {
    const { playerId, userId, price } = req.body;
    const { tournamentId } = req.params;

    if (!playerId || !userId || !tournamentId || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTransaction = await Transaction.findOne({
      playerId,
      tournamentId,
    });

    if (!existingTransaction) {
      const newTransaction = new Transaction({
        userId,
        playerId,
        tournamentId,
        price,
      });
      await newTransaction.save();
      return res
        .status(201)
        .json({ message: "Transaction created", transaction: newTransaction });
    }

    if (existingTransaction.userId.toString() === userId.toString()) {
      existingTransaction.price = price;
      await existingTransaction.save();
      return res
        .status(200)
        .json({
          message: "Transaction updated",
          transaction: existingTransaction,
        });
    } else {
      existingTransaction.userId = userId;
      existingTransaction.price = price;
      await existingTransaction.save();
      return res.status(200).json({
        message: "Transaction reassigned to new user",
        transaction: existingTransaction,
      });
    }
  } catch (err) {
    next(err);
  }
};
