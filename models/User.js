const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    wallet: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, default: "" },
    pincode: { type: String, default: "" },
    phone: { type: String, default: "" },
    c20: { type: Number, default: 0 },
    c40: { type: Number, default: 0 },
    c50: { type: Number, default: 0 },
    c60: { type: Number, default: 0 },
  },
  { timestamps: true }
);
mongoose.models = {};

export default mongoose.model("User", UserSchema);
