import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

import { ethers } from "ethers";
import faucetContract from "./ethereum/faucet";
// import { ethers } from "./ethereum/ethers-5.6.esm.min.js";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  const [Total20, setTotal20] = useState(0);
  const [Total40, setTotal40] = useState(0);
  const [Total50, setTotal50] = useState(0);
  const [Total60, setTotal60] = useState(0);

  const [llyt, setlyt] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState(0);

  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
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
      const fcContractWithSigner = fcContract.connect(signer);
      const resp = await fcContractWithSigner.requestTokens();
      console.log(resp);
      // setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
      // setTransactionData(resp.hash);
    } catch (err) {
      console.log(err.message);
      // setWithdrawError(err.message);
    }
  };

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
    const myuser = JSON.parse(localStorage.getItem("myuser"));
    if (myuser) {
      setUser({ value: myuser.token, email: myuser.email });
    }
    setKey(Math.random());
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem("myuser");
    setUser({ value: null });
    setKey(Math.random());
    router.push("/");
  };

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    let lytt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
      lytt += myCart[keys[i]].lyt * myCart[keys[i]].qty;
    }
    setSubTotal(subt);
    setTotal20(subt - 0.2 * subt);
    setTotal40(subt - 0.4 * subt);
    setTotal50(subt - 0.5 * subt);
    setTotal60(subt - 0.6 * subt);

    setlyt(lytt);
  };

  const addtoCart = (itemCode, qty, price, name, size, variant, lyt) => {
    if (Object.keys(cart).length == 0) {
      setKey(Math.random());
    }
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    } else {
      newCart[itemCode] = { qty: 1, price, name, size, variant, lyt };
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (itemCode, qty, price, name, size, variant, lyt) => {
    let newCart = JSON.parse(JSON.stringify(cart));
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty - qty;
    }
    if (newCart[itemCode]["qty"] <= 0) {
      delete newCart[itemCode];
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const Buynow = (itemCode, qty, price, name, size, variant, lyt) => {
    let newCart = {};
    newCart[itemCode] = { qty: 1, price, name, size, variant, lyt };

    setCart(newCart);
    saveCart(newCart);
    router.push("/checkout");
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };
  return (
    <>
      <LoadingBar
        color="#ff2d55"
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />

      {key && (
        <Navbar
          // sticky="top"
          getOCTHandler={getOCTHandler}
          connectWallet={connectWallet}
          logout={logout}
          user={user}
          key={key}
          cart={cart}
          addtoCart={addtoCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subTotal={subTotal}
          llyt={llyt}
        />
      )}
      <Component
        // getOCTHandler={getOCTHandler}
        Buynow={Buynow}
        cart={cart}
        addtoCart={addtoCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        llyt={llyt}
        Total20={Total20}
        Total40={Total40}
        Total50={Total50}
        Total60={Total60}
        {...pageProps}
      />

      <Footer />
    </>
  );
}
