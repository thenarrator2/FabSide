import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method == "POST") {
    let user = await User.findOne({ email: req.body.email });
    // let userwallet = await User.findOne({ wallet: req.body.wallet });

    var bytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
    var decryptpass = bytes.toString(CryptoJS.enc.Utf8);

    if (user) {
      if (
        req.body.email == user.email &&
        req.body.password == decryptpass &&
        req.body.wallet == user.wallet
      ) {
        // res
        //   .status(200)
        //   .json({ success: true, email: user.email, name: user.name });
        var token = jwt.sign(
          { email: user.email, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: "2d" }
        );
        res.status(200).json({ success: true, token, email: user.email });
      } else {
        res.status(200).json({ success: false, error: "Invalid Credentials" });
      }
    } else {
      res.status(200).json({ success: false, error: "No user found" });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
