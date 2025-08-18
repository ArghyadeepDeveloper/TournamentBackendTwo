import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    tournaments: [
      {
        tournamentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tournament",
        },
        balance: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
