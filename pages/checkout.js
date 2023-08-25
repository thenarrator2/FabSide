import React, { useEffect, useState } from "react";
import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import Link from "next/link";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

import { BigNumber, ethers } from "ethers";
import faucetContract from "./ethereum/faucet.js";

const checkout = ({
  Total20,
  Total40,
  Total50,
  Total60,
  cart,
  clearCart,
  addtoCart,
  removeFromCart,
  subTotal,
  llyt,
}) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tokenval, setTokenval] = useState(0);

  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState({ value: null });

  const [c20, setc20] = useState(0);
  const [c40, setc40] = useState(0);
  const [c50, setc50] = useState(0);
  const [c60, setc60] = useState(0);

  //////////
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

  // const [clcpay, setclcpay] = useState(false);

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
    ////
    const fetchuser = async () => {
      const myuser = JSON.parse(localStorage.getItem("myuser"));

      let data = { token: myuser.token };
      let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/couponsapi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let res = await a.json();
      // console.log(res.c20);
      // setname(res.name);
      setc20(res.c20);
      setc40(res.c40);
      setc50(res.c50);
      setc60(res.c60);
    };
    if (!localStorage.getItem("myuser")) {
      router.push("/");
    } else {
      fetchuser();
      // console.log(c20);
    }
    ////
    console.log(llyt);
    console.log(subTotal);
  }, [walletAddress]);

  const init = async () => {
    setTokenval(1);
    console.log(tokenval);
    initiatePayment();

    ///////
    const myuser = JSON.parse(localStorage.getItem("myuser"));

    let data = { token: myuser.token, ch20, ch40, ch50, ch60 };
    // let oid = Math.floor(Math.random() * Date.now());
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatecoupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let txnRes = await a.json();
    console.log(txnRes);
    ///////
  };

  const initget = async () => {
    setTokenval(2);
    console.log(tokenval);
    getpay();
  };

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

  // const initgetpayc = () => {
  //   setTokenval(2);
  //   getpay();
  // };
  async function getpay() {
    // e.preventDefault();

    // setWithdrawError("");
    // setWithdrawSuccess("");
    setTokenval(2);
    try {
      const fcContractWithSigner = fcContract.connect(signer);
      const resp = await fcContractWithSigner.depositTokens(
        BigInt(llyt * 1000000000000000000)
      );
      console.log(resp);

      // if (resp) {
      let oid = Math.floor(Math.random() * Date.now());
      const data = {
        tokenval,
        cart,
        subTotal,
        oid,
        email: email,
        name,
        address,
        pincode,
        phone,
        city,
      };
      let a = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/prelyttransaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      let txnRes = await a.json();
      console.log(txnRes);
      toast.success("Your Order has been placed!", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        router.push("http://localhost:3000");
      }, 1000);
    } catch (err) {
      console.log(err.code);
      if (err.code == "ACTION_REJECTED") {
        toast.error("You have rejected the transaction!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else if (err.code == "INSUFFICIENT_FUNDS") {
        toast.error("You have insufficiant tokens!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else if (err.code == "UNPREDICTABLE_GAS_LIMIT") {
        toast.error("Something went wrong!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      // setWithdrawError(err.message);
    }

    // if (txnRes.success) {
    //   // Payment success, perform redirection
    //   window.location.href = `/order?clearCart=1&id=${txnRes.orderId}`;
    // } else {
    //   console.log(txnRes.error);
    //   // Handle error cases
    // }

    // res.redirect(`${process.env.NEXT_PUBLIC_HOST}/order`);
    // }
    // var a = product.lyt;

    // setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
    // setTransactionData(resp.hash);
  }
  //////////

  useEffect(() => {
    // change20();
    const myuser = JSON.parse(localStorage.getItem("myuser"));

    if (myuser && myuser.token) {
      setUser(myuser);
      setEmail(myuser.email);
      fetchData(myuser.token);
    }
    // console.log(subTotal);
  }, []);

  useEffect(() => {
    if (
      name.length > 3 &&
      email.length > 3 &&
      phone.length > 3 &&
      address.length > 3 &&
      pincode.length > 3
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, phone, pincode, address]);

  const fetchData = async (token) => {
    let data = { token: token };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await a.json();
    console.log(res);
    setName(res.name);
    setAddress(res.address);
    setPincode(res.pincode);
    setPhone(res.phone);
    getPinCode(res.pincode);
  };

  const getPinCode = async (pin) => {
    let pins = await fetch("http://localhost:3000/api/pincode");
    let pinJson = await pins.json();
    if (Object.keys(pinJson).includes(pin)) {
      setState(pinJson[pin][1]);
      setCity(pinJson[pin][0]);
    } else {
      setState("");
      setCity("");
    }
  };

  const handleChange = async (e) => {
    if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "phone") {
      setPhone(e.target.value);
    } else if (e.target.name == "address") {
      setAddress(e.target.value);
    } else if (e.target.name == "pincode") {
      setPincode(e.target.value);
      if (e.target.value.length == 6) {
        getPinCode(e.target.value);
      } else {
        setState("");
        setCity("");
      }
    }
  };

  async function initiatePayment() {
    setTokenval(1);
    console.log(tokenval);

    let oid = Math.floor(Math.random() * Date.now());
    const data = {
      tokenval: 1,
      cart,
      subTotal,
      oid,
      email: email,
      name,
      address,
      pincode,
      phone,
      city,
    };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let txnRes = await a.json();
    // console.log(JSON.parse(JSON.stringify(txnRes)));
    if (txnRes.success) {
      toast.success("Your Order has been placed!", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        router.push("http://localhost:3000");
      }, 1000);
      //   let txnToken = txnRes.txnToken;
      //   var config = {
      //     root: "",
      //     flow: "DEFAULT",
      //     data: {
      //       orderId: oid /* update order id */,
      //       token: txnToken /* update token value */,
      //       tokenType: "TXN_TOKEN",
      //       amount: subTotal /* update amount */,
      //     },
      //     handler: {
      //       notifyMerchant: function (eventName, data) {
      //         console.log("notifyMerchant handler function called");
      //         console.log("eventName => ", eventName);
      //         console.log("data => ", data);
      //       },
      //     },
      //   };
      //   // initialze configuration using init method
      //   window.Paytm.CheckoutJS.init(config)
      //     .then(function onSuccess() {
      //       // after successfully updating configuration, invoke JS Checkout
      //       window.Paytm.CheckoutJS.invoke();
      //     })
      //     .catch(function onError(error) {
      //       console.log("error => ", error);
      //     });
    } else {
      //   console.log(txnRes.error);
      if (txnRes.cartClear) {
        clearCart();
      }
      toast.error(txnRes.error, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
  // useEffect(()=>{
  //   if(ch20 ==1){

  //   }
  // },[])

  const [ch20, setch20] = useState(0);
  const [ch40, setch40] = useState(0);
  const [ch50, setch50] = useState(0);
  const [ch60, setch60] = useState(0);

  const change20 = async () => {
    setch20(1);
    setch40(0);
    setch50(0);
    setch60(0);
    // subTotal = Total20;
    // console.log(subTotal);
  };

  const change40 = async () => {
    setch20(0);
    setch40(1);
    setch50(0);
    setch60(0);
    // subTotal = Total40;
    // console.log(subTotal);
  };

  const change50 = async () => {
    setch20(0);
    setch40(0);
    setch50(1);
    setch60(0);
    // subTotal = Total50;
    // console.log(subTotal);
  };
  const change60 = async () => {
    setch20(0);
    setch40(0);
    setch50(0);
    setch60(1);
    // subTotal = Total60;
    // console.log(subTotal);
  };

  return (
    <div className="container px-2 m-auto">
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <Script
        type="application/javascript"
        crossOrigin="anonymous"
        src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}
      />

      <h1 className="font-bold text-3x1 my-8 text-center">Checkout</h1>
      <h2 className="font-semibold text-xl">1. Delivery Details</h2>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div class=" mb-4">
            <label for="name" class="leading-7 text-sm text-gray-600">
              Name
            </label>
            <input
              onChange={handleChange}
              value={name}
              type="text"
              id="name"
              name="name"
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div class=" mb-4">
            <label for="email" class="leading-7 text-sm text-gray-600">
              Email
            </label>
            {user && user.token ? (
              <input
                onChange={handleChange}
                value={user.email}
                type="email"
                id="email"
                name="email"
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                readOnly
              />
            ) : (
              <input
                onChange={handleChange}
                value={email}
                type="email"
                id="email"
                name="email"
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            )}
          </div>
        </div>
      </div>
      <div className="px-2 w-full">
        <div class=" mb-4">
          <label for="address" class="leading-7 text-sm text-gray-600">
            Address
          </label>
          <textarea
            onChange={handleChange}
            value={address}
            cols="30"
            rows="2"
            type="text"
            id="address"
            name="address"
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          ></textarea>
        </div>
      </div>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div class=" mb-4">
            <label for="phone" class="leading-7 text-sm text-gray-600">
              Phone
            </label>
            <input
              onChange={handleChange}
              value={phone}
              type="phone"
              id="phone"
              name="phone"
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div class=" mb-4">
            <label for="city" class="leading-7 text-sm text-gray-600">
              District
            </label>
            <input
              onChange={handleChange}
              value={city}
              type="text"
              id="city"
              name="city"
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div class=" mb-4">
            <label for="state" class="leading-7 text-sm text-gray-600">
              State
            </label>
            <input
              onChange={handleChange}
              value={state}
              type="text"
              id="state"
              name="state"
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div class=" mb-4">
            <label for="pincode" class="leading-7 text-sm text-gray-600">
              PinCode
            </label>
            <input
              onChange={handleChange}
              value={pincode}
              type="text"
              id="pincode"
              name="pincode"
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
      </div>
      <h2 className="font-semibold text-xl">2. Review Cart Items</h2>
      <div className="z-10 sidecart  bg-pink-100 p-6 m-2 ">
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length == 0 && (
            <div className="my-4 font-semibold">Your Cart is Empty.</div>
          )}
          {Object.keys(cart).map((k) => {
            return (
              <li key={k}>
                <div className="item flex my-5">
                  <div className=" font-semibold">
                    {cart[k].name}({cart[k].size}/{cart[k].variant})
                  </div>
                  <div className="flex font-semibold items-center justify-center w-1/3 text-lg">
                    <AiFillMinusCircle
                      onClick={() => {
                        removeFromCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant,
                          cart[k].lyt
                        );
                      }}
                      className="cursor-pointer text-pink-500"
                    />
                    <span className="mx-2 text-sm">{cart[k].qty}</span>
                    <AiFillPlusCircle
                      onClick={() => {
                        addtoCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant,
                          cart[k].lyt
                        );
                      }}
                      className="cursor-pointer text-pink-500"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {/* {c20 ? <p>Welcome, User!</p> : <p>Please log in to continue.</p>} */}
        <div class="lg:w-2/3 w-full mx-auto overflow-auto">
          <table class="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr>
                <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                  Coupons
                </th>

                <th class="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br"></th>
              </tr>
            </thead>
            <tbody>
              {c20 == 1 ? (
                <tr>
                  <td class="px-4 py-3">Use 20% OFF Coupon</td>
                  <td class="w-10 text-center">
                    <input name="plan" type="radio" onClick={change20} />
                  </td>
                </tr>
              ) : (
                <tr></tr>
              )}
              {c40 == 1 ? (
                <tr>
                  <td class="px-4 py-3">Use 40% OFF Coupon</td>
                  <td class="w-10 text-center">
                    <input name="plan" type="radio" onClick={change40} />
                  </td>
                </tr>
              ) : (
                <tr></tr>
              )}
              {c50 == 1 ? (
                <tr>
                  <td class="px-4 py-3">Use 50% OFF Coupon</td>
                  <td class="w-10 text-center">
                    <input name="plan" type="radio" onClick={change50} />
                  </td>
                </tr>
              ) : (
                <tr></tr>
              )}
              {c60 == 1 ? (
                <tr>
                  <td class="px-4 py-3">Use 60% OFF Coupon</td>
                  <td class="w-10 text-center">
                    <input name="plan" type="radio" onClick={change60} />
                  </td>
                </tr>
              ) : (
                <tr></tr>
              )}
            </tbody>
          </table>
        </div>
        {/*end */}
        {ch20 == 1 ? (
          <span className="font-bold">New SubTotal : ₹{Total20}</span>
        ) : (
          <p></p>
        )}
        {ch40 == 1 ? (
          <span className="font-bold">New SubTotal : ₹{Total40}</span>
        ) : (
          <p></p>
        )}
        {ch50 == 1 ? (
          <span className="font-bold">New SubTotal : ₹{Total50}</span>
        ) : (
          <p></p>
        )}
        {ch60 == 1 ? (
          <div>
            <span className="font-bold">New SubTotal : ₹{Total60}</span>
          </div>
        ) : (
          <p></p>
        )}
        <span className="font-bold">SubTotal : ₹{subTotal}</span>
      </div>

      {/** */}
      {ch20 == 1 ? (
        <div className="mx-4">
          <Link href={"/checkout"}>
            {/* <Link href={"/order?clearCart=1&id=" + oid}> */}
            <button
              disabled={disabled}
              // onClick={initiatePayment}
              onClick={init}
              className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm"
            >
              <BsFillBagCheckFill className="m-1" /> Pay ₹{Total20}
            </button>
          </Link>
        </div>
      ) : (
        <p></p>
      )}
      {ch40 == 1 ? (
        <div className="mx-4">
          <Link href={"/checkout"}>
            {/* <Link href={"/order?clearCart=1&id=" + oid}> */}
            <button
              disabled={disabled}
              // onClick={initiatePayment}
              onClick={init}
              className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm"
            >
              <BsFillBagCheckFill className="m-1" /> Pay ₹{Total40}
            </button>
          </Link>
        </div>
      ) : (
        <p></p>
      )}
      {ch50 == 1 ? (
        <div className="mx-4">
          <Link href={"/checkout"}>
            {/* <Link href={"/order?clearCart=1&id=" + oid}> */}
            <button
              disabled={disabled}
              // onClick={initiatePayment}
              onClick={init}
              className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm"
            >
              <BsFillBagCheckFill className="m-1" /> Pay ₹{Total50}
            </button>
          </Link>
        </div>
      ) : (
        <p></p>
      )}
      {ch60 == 1 ? (
        <div>
          <div className="mx-4">
            <Link href={"/checkout"}>
              {/* <Link href={"/order?clearCart=1&id=" + oid}> */}
              <button
                disabled={disabled}
                // onClick={initiatePayment}
                onClick={init}
                className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm"
              >
                <BsFillBagCheckFill className="m-1" /> Pay ₹{Total60}
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <p></p>
      )}
      {ch20 == 0 && ch40 == 0 && ch50 == 0 && ch60 == 0 ? (
        <div className="mx-4">
          <Link href={"/checkout"}>
            {/* <Link href={"/order?clearCart=1&id=" + oid}> */}
            <button
              disabled={disabled}
              // onClick={initiatePayment}
              onClick={init}
              className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm"
            >
              <BsFillBagCheckFill className="m-1" /> Pay ₹{subTotal}
            </button>
          </Link>
        </div>
      ) : (
        <p></p>
      )}

      <div className="flex my-2 ">
        <button
          disabled={disabled}
          onClick={initget}
          className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm"
        >
          Buy With Token: {llyt}
        </button>
      </div>
    </div>
  );
};

export default checkout;
