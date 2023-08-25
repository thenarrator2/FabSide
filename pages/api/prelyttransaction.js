import { rejects } from "assert";
import { resolve } from "path";
import PaytmChecksum from "paytmchecksum";
import Order from "@/models/Order";
import connectDb from "@/middleware/mongoose";
import Product from "@/models/Product";
import pincodes from "../../pincodes.json";

const https = require("https");
/*
 * import checksum generation utility
 * You can get this utility from https://developer.paytm.com/docs/checksum/
 */

const handler = async (req, res) => {
  if (req.method == "POST") {
    if (!Object.keys(pincodes).includes(req.body.pincode)) {
      res.status(200).json({
        success: false,
        error: "The pincode you have entered is not serviceable.",
        cartClear: false,
      });
      return;
    }

    let product,
      sumTotal = 0;
    let cart = req.body.cart;
    if (req.body.subTotal <= 0) {
      res.status(200).json({
        success: false,
        error: "Cart Empty! Please build your cart and try again.",
        cartClear: false,
      });
      return;
    }

    for (let item in cart) {
      console.log(item);
      sumTotal += cart[item].price * cart[item].qty;
      product = await Product.findOne({ slug: item });
      if (product.availableQty < cart[item].qty) {
        res.status(200).json({
          success: false,
          error: "Some items in your cart went out of stock. Please try again.",
          cartClear: true,
        });
        return;
      }
      if (product.price != cart[item].price) {
        res.status(200).json({
          success: false,
          error:
            "The price of some items in your cart have changed. Please try again.",
          cartClear: true,
        });
        return;
      }
    }
    if (sumTotal !== req.body.subTotal) {
      res.status(200).json({
        success: false,
        error:
          "The price of some items in your cart have changed. Please try again.",
        cartClear: true,
      });
      return;
    }

    if (
      req.body.phone.length !== 10 ||
      !Number.isInteger(Number(req.body.phone))
    ) {
      res.status(200).json({
        success: false,
        error: "Please enter your 10 digit phone number.",
        cartClear: false,
      });
      return;
    }
    if (
      req.body.pincode.length !== 6 ||
      !Number.isInteger(Number(req.body.pincode))
    ) {
      res.status(200).json({
        success: false,
        error: "Please enter your 6 digit pincode.",
        cartClear: false,
      });
      return;
    }

    let order = new Order({
      tokenval: req.body.tokenval,
      email: req.body.email,
      orderId: req.body.oid,
      address: req.body.address,
      city: req.body.city,
      name: req.body.name,
      phone: req.body.phone,
      state: req.body.state,
      amount: req.body.subTotal,
      products: req.body.cart,
      pincode: req.body.pincode,
    });
    await order.save();
    // res.redirect(`/order?clearCart=1&id=${order._id}`);
    // if (res.statusCode === 200) {
    //   return res.redirect(
    //     `${process.env.NEXT_PUBLIC_HOST}/api/postlyttransaction`
    //   );
    // }
    res.status(200).json({ success: "Success" });
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
