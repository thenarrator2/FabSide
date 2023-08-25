import Order from "@/models/Order";
import connectDb from "@/middleware/mongoose";
import Product from "@/models/Product";
import PaytmChecksum from "paytmchecksum";

const handler = async (req, res) => {
  let order;
  // res.status(200).json({ body: req.body });

  // if (req.body.STATUS == "TXN_SUCCESS") {
  order = await Order.findOneAndUpdate(
    { orderId: req.body.oid },
    {
      status: "Paid bitch",
      paymentInfo: JSON.stringify(req.body),
      // transactionid: req.body.TXNID,
    }
  );
  let products = order.products;
  for (let slug in products) {
    console.log(products[slug].qty);
    await Product.findOneAndUpdate(
      { slug: slug },
      { $inc: { availableQty: -products[slug].qty } }
    );
  }

  // } else if (req.body.STATUS == "PENDING") {
  //   order = await Order.findOneAndUpdate(
  //     { orderId: req.body.ORDERID },
  //     { status: "Pending", paymentInfo: JSON.stringify(req.body) }
  //   );
  // }
  // var a = order._id;
  // console.log(a);
  // var ans = JSON.stringify(a);
  // res.redirect("/order?&id=" + order._id);
  res.redirect("/order?clearCart=1&id=" + order._id, 200);

  // const redirectUrl = "/order?id=" + order._id;

  // Set the Location header for redirection
  // res.setHeader("Location", redirectUrl);
  // res.status(302).end();
};

export default connectDb(handler);
