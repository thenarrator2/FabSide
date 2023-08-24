import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Order from "@/models/Order";
import mongoose from "mongoose";

import Image from "next/image";
import img from "../assets/tick1.jpg";

import { BigNumber, ethers } from "ethers";
import faucetContract from "./ethereum/faucet.js";

const Myorder = ({ order, clearCart }) => {
  const [disabled, setDisabled] = useState(true);

  const [orderid, setOrderid] = useState("");

  const [token, settoken] = useState(2);
  const products = order.products;
  const router = useRouter();
  const [date, setDate] = useState();
  useEffect(() => {
    const d = new Date(order.createdAt);
    setDate(d);
    console.log(order);
    setOrderid(order.orderId);

    if (router.query.clearCart == 1) {
      clearCart();
    }
  }, []);

  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
    // getOCTHandler();
    console.log(order.tokenval);
    if (order.tokenval === 2 && order.tokenval === 0) {
      setDisabled(true);
    } else if (order.tokenval === 1) {
      setDisabled(false);
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_requestAccounts", []);
        /* get signer */
        setSigner(provider.getSigner());
        /* local contract instance */
        setFcContract(faucetContract(provider));
        /* set active wallet address */
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          /* get signer */
          setSigner(provider.getSigner());
          /* local contract instance */
          setFcContract(faucetContract(provider));
          /* set active wallet address */
          setWalletAddress(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect Wallet button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    } else {
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getOCTHandler = async () => {
    // setWithdrawError("");
    // setWithdrawSuccess("");
    try {
      if (order.tokenval == 1) {
        const fcContractWithSigner = fcContract.connect(signer);
        const resp = await fcContractWithSigner.requestTokens();
        console.log(resp);
        settoken(2);
        // console.log("-----------");
        // console.log(token);
        // e.preventDefault();
        const data = { orderid, token };

        let res = await fetch("http://localhost:3000/api/tokenval", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let response = await res.json();
      }
      // setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
      // setTransactionData(resp.hash);
    } catch (err) {
      console.log(err.message);
      // setWithdrawError(err.message);
    }
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              FABSIDE.COM
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
              Order Id: #{order.orderId}
            </h1>

            <p className="leading-relaxed mb-4">
              Your order has been successfully placed. Your Payment Status is:
              {order.status}
            </p>
            <p className="leading-relaxed mb-4">
              Order placed on:
              {date &&
                date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
            <div class="flex mb-4">
              <a class="flex-grow text-center py-2 text-lg px-1">
                Item Description
              </a>
              <a class="flex-grow text-center  py-2 text-lg px-1">Quantity</a>
              <a class="flex-grow text-center  py-2 text-lg px-1">Item Total</a>
            </div>

            {Object.keys(products).map((key) => {
              return (
                <div key={key} className="flex border-t border-gray-200 py-2">
                  <span className="text-gray-500">
                    {products[key].name.slice(0, 30)}...({products[key].size}/
                    {products[key].variant})
                  </span>
                  <span className="m-auto text-gray-900">
                    {products[key].qty}
                  </span>
                  <span className="ms-auto text-gray-900">
                    ₹{products[key].price} X {products[key].qty} = ₹
                    {products[key].price * products[key].qty}
                  </span>
                </div>
              );
            })}

            <div className="flex flex-col">
              <span className="title-font font-medium text-2xl text-gray-900">
                SubTotal: ₹{order.amount}
              </span>
              <p className="leading-relaxed mb-4 py-2">
                Click below if you have not claimed you 50 LYT.
              </p>
              <div className="flex">
                {/* <button className="flex mx-2 my-2 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">
                  Track Order
                </button> */}
                <button
                  onClick={getOCTHandler}
                  disabled={disabled}
                  className="flex disabled:bg-pink-300 mx-2  text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded"
                >
                  Claim Tokens
                </button>
              </div>
            </div>
          </div>
          <Image
            alt="ecommerce"
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={img}
          />
        </div>
      </div>
    </section>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  let order = await Order.findById(context.query.id);

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}

export default Myorder;
