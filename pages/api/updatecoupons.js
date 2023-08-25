import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method == "POST") {
    const token = req.body.token;
    const data = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ email: data.email });
    // const { name, c20, c40, c50, c60 } = user;
    if (user) {
      if (req.body.ch20 == 1) {
        await User.findOneAndUpdate({ email: data.email }, { c20: 0 });
      }
      if (req.body.ch40 == 1) {
        await User.findOneAndUpdate({ email: data.email }, { c40: 0 });
      }
      if (req.body.ch50 == 1) {
        await User.findOneAndUpdate({ email: data.email }, { c50: 0 });
      }
      if (req.body.ch50 == 1) {
        await User.findOneAndUpdate({ email: data.email }, { c50: 0 });
      }
    }
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: "error" });
  }
};

export default connectDb(handler);
