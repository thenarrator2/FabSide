import connectDb from "@/middleware/mongoose";
// import Order from "@/models/User";
// import Order from "@/models/Order";
import User from "@/models/User";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method == "POST") {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      if (req.body.c20) {
        if (user.c20 == 0 || user.c20 == null) {
          await User.findOneAndUpdate(
            { email: req.body.email },
            { c20: req.body.c20 }
          );
        }
        if (user.c20 == 1) {
          res.status(200).json({
            success: false,
            error: "You already have one 20% off coupon.",
          });
        }
      }
      if (req.body.c40) {
        if (user.c40 == 0 || user.c40 == null) {
          await User.findOneAndUpdate(
            { email: req.body.email },
            { c40: req.body.c40 }
          );
        }
        if (user.c40 == 1) {
          res.status(200).json({
            success: false,
            error: "You already have one 40% off coupon.",
          });
        }
      }
      if (req.body.c50) {
        if (user.c50 == 0 || user.c50 == null) {
          await User.findOneAndUpdate(
            { email: req.body.email },
            { c50: req.body.c50 }
          );
        }
        if (user.c50 == 1) {
          res.status(200).json({
            success: false,
            error: "You already have one 50% off coupon.",
          });
        }
      }
      if (req.body.c60) {
        if (user.c60 == 0 || user.c60 == null) {
          await User.findOneAndUpdate(
            { email: req.body.email },
            { c60: req.body.c60 }
          );
        }
        if (user.c60 == 1) {
          res.status(200).json({
            success: false,
            error: "You already have one 60% off coupon.",
          });
        }
      }
    }
    await user.save();
    // let userwallet = await User.findOne({ wallet: req.body.wallet });

    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
