import connectDb from "@/middleware/mongoose";
// import Order from "@/models/User";
import Order from "@/models/Order";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method == "POST") {
    let order = await Order.findOneAndUpdate(
      { orderId: req.body.orderid },
      {
        tokenval: req.body.token,
      }
    );
    // let userwallet = await User.findOne({ wallet: req.body.wallet });

    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
