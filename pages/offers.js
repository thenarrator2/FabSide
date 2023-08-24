import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { BigNumber, ethers } from "ethers";
import faucetContract from "./ethereum/faucet.js";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import myImage20 from "../assets/cou20.jgp.jpg";
import myImage40 from "../assets/c40.jpg";
import myImage50 from "../assets/c50.jpg";
import myImage60 from "../assets/c60.jpg";

const offers = () => {
  const [isHovered20, setHovered20] = useState(false);
  const [isHovered40, setHovered40] = useState(false);
  const [isHovered50, setHovered50] = useState(false);
  const [isHovered60, setHovered60] = useState(false);

  const [c20, setc20] = useState(1);
  const [c40, setc40] = useState(1);
  const [c50, setc50] = useState(1);
  const [c60, setc60] = useState(1);

  // const [i50, seti50] = useState(false);

  const [itr, setitr] = useState(0);

  /////
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
    // localStorage.setItem("cart", JSON.stringify(myCart));

    // console.log(llyt);
    // console.log(subTotal);
    setitr(0);
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

  const [email, setEmail] = useState("");
  const [user, setUser] = useState({ value: null });

  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem("myuser"));

    if (myuser && myuser.token) {
      setUser(myuser);
      setEmail(myuser.email);
      // fetchData(myuser.token);
      console.log(myuser.email);
    }
  }, []);

  async function getpay() {
    // e.preventDefault();

    // setWithdrawError("");
    // setWithdrawSuccess("");
    // setTokenval(2);
    // if (itr == 1) {
    //   setc20(1);
    // } else if (itr == 2) {
    //   setc40(1);
    // } else if (itr == 3) {
    //   setc50(1);
    // } else if (itr == 4) {
    //   setc60(1);
    // }

    console.log(itr);
    try {
      if (itr == 1) {
        setc20(1);
        const data = { c20, email };

        let res = await fetch("http://localhost:3000/api/offerapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let response = await res.json();
        if (response.success) {
          const fcContractWithSigner = fcContract.connect(signer);
          const resp = await fcContractWithSigner.depositTokens(
            BigInt(20 * 1000000000000000000)
          );
          toast.success("You have successfully purchased the 20% off coupon.", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          console.log(response);
          toast.error(response.error, {
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

        console.log(c20);
        setitr(0);
        console.log(itr);
      } else if (itr == 2) {
        setc40(1);

        console.log(c40);
        const data = { c40, email };

        let res = await fetch("http://localhost:3000/api/offerapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let response = await res.json();
        if (response.success) {
          const fcContractWithSigner = fcContract.connect(signer);
          const resp = await fcContractWithSigner.depositTokens(
            BigInt(40 * 1000000000000000000)
          );
          toast.success("You have successfully purchased the 40% off coupon.", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          console.log(response);
          toast.error(response.error, {
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
        setitr(0);
        console.log(itr);
      } else if (itr == 3) {
        setc50(1);
        console.log(email);

        console.log(c50);
        const data = { c50, email };

        let res = await fetch("http://localhost:3000/api/offerapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let response = await res.json();
        if (response.success) {
          const fcContractWithSigner = fcContract.connect(signer);
          const resp = await fcContractWithSigner.depositTokens(
            BigInt(10 * 1000000000000000000)
          );
          toast.success("You have successfully purchased the 50% off coupon.", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          console.log(response);
          toast.error(response.error, {
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
        setitr(0);
        console.log(itr);

        // console.log(c50);
      } else if (itr == 4) {
        setc60(1);

        // setc60(1);

        console.log(c60);

        const data = { c60, email };

        let res = await fetch("http://localhost:3000/api/offerapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let response = await res.json();
        if (response.success) {
          const fcContractWithSigner = fcContract.connect(signer);
          const resp = await fcContractWithSigner.depositTokens(
            BigInt(60 * 1000000000000000000)
          );
          toast.success("You have successfully purchased the 60% off coupon.", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          console.log(response);
          toast.error(response.error, {
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
        setitr(0);
        console.log(itr);
      }
      // const data = { c20, c40, c50, c60, email };

      // let res = await fetch("http://localhost:3000/api/offerapi", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      // let response = await res.json();
    } catch (err) {
      console.log(err);
      // setWithdrawError(err.message);
    }
  }

  useEffect(() => {
    if (itr == 3) {
      setc50(1);
      // seti50(false);
    }
  }, []);

  // const initiate50 = async () => {
  //   seti50(true);
  // };
  /////

  return (
    <section class="text-gray-600 body-font">
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
      <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-col text-center w-full mb-20">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Available Offers
          </h1>
          <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
            Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
            gentrify, subway tile poke farm-to-table. Franzen you probably
            haven't heard of them man bun deep jianbing selfies heirloom.
          </p>
        </div>

        <div class="container px-5 py-18 mx-auto flex flex-wrap">
          <div class="lg:w-2/3 mx-auto">
            <div
              class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4 "
              onMouseOver={() => setHovered20(true)}
              onMouseLeave={() => setHovered20(false)}
            >
              {isHovered20 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block opacity-25 absolute inset-0"
                  src={myImage20}
                />
                // <Image width={100} height={10} src={logo} alt="" />
              )}
              {!isHovered20 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block  absolute inset-0"
                  src={myImage20}
                />
              )}

              <div
                class="text-center relative z-10 w-full"
                onMouseOver={() => setHovered20(true)}
                onMouseLeave={() => setHovered20(false)}
              >
                {isHovered20 && (
                  <div class="text-center relative z-10 w-full">
                    <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">
                      20% Off
                    </h2>
                    <p class="leading-relaxed">
                      Get the 20% OFF coupon and use it in your next purchase.
                    </p>
                    {/* <Link legacyBehavior href={"/mugs"}> */}
                    <a
                      class="mt-3 text-indigo-500 inline-flex items-center"
                      onClick={() => {
                        setitr(1);
                        getpay();
                      }}
                    >
                      Redeem Now!
                      <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        class="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </a>
                    {/* </Link> */}
                  </div>
                )}
              </div>
            </div>
            {/* <img alt="" src={myImage} /> */}

            <div class="py-5 ">
              <div
                class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4"
                onMouseOver={() => setHovered40(true)}
                onMouseLeave={() => setHovered40(false)}
              >
                {isHovered40 && (
                  <Image
                    alt="gallery"
                    // height={60}
                    class="w-full object-cover h-full object-center block opacity-25 absolute inset-0"
                    src={myImage40}
                  />
                  // <Image width={100} height={10} src={logo} alt="" />
                )}
                {!isHovered40 && (
                  <Image
                    alt="gallery"
                    // height={60}
                    class="w-full object-cover h-full object-center block  absolute inset-0"
                    src={myImage40}
                  />
                )}

                <div
                  class="text-center relative w-full "
                  onMouseOver={() => setHovered40(true)}
                  onMouseLeave={() => setHovered40(false)}
                >
                  {isHovered40 && (
                    <div class="text-center relative w-full z-10">
                      <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">
                        40% Off
                      </h2>
                      <p class="leading-relaxed">
                        Get the 40% OFF coupon and use it in your next purchase.
                      </p>
                      {/* <Link legacyBehavior href={"/stickers"}> */}
                      <a
                        class="mt-3 text-indigo-500 inline-flex items-center"
                        onClick={() => {
                          setitr(2);
                          getpay();
                        }}
                      >
                        Redeem Now!
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          class="w-4 h-4 ml-2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                      {/* </Link> */}
                    </div>
                  )}
                </div>
              </div>

              <div class="py-5 ">
                <div
                  class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4"
                  onMouseOver={() => setHovered50(true)}
                  onMouseLeave={() => setHovered50(false)}
                >
                  {isHovered50 && (
                    <Image
                      alt="gallery"
                      // height={60}
                      class="w-full object-cover h-full object-center block opacity-25 absolute inset-0"
                      src={myImage50}
                    />
                    // <Image width={100} height={10} src={logo} alt="" />
                  )}
                  {!isHovered50 && (
                    <Image
                      alt="gallery"
                      // height={60}
                      class="w-full object-cover h-full object-center block  absolute inset-0"
                      src={myImage50}
                    />
                  )}

                  <div
                    class="text-center relative w-full "
                    onMouseOver={() => setHovered50(true)}
                    onMouseLeave={() => setHovered50(false)}
                  >
                    {isHovered50 && (
                      <div class="text-center relative w-full z-10">
                        <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">
                          50% Off
                        </h2>
                        <p class="leading-relaxed">
                          Get the 50% OFF coupon and use it in your next
                          purchase.
                        </p>
                        {/* <Link legacyBehavior href={"/stickers"}> */}
                        <a
                          class="mt-3 text-indigo-500 inline-flex items-center"
                          onClick={() => {
                            setitr(3);
                            getpay();
                          }}
                          // onClick={initiate50}
                        >
                          Redeem Now!
                          <svg
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            class="w-4 h-4 ml-2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                          </svg>
                        </a>
                        {/* </Link> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div class="py-5 ">
                <div
                  class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4"
                  onMouseOver={() => setHovered60(true)}
                  onMouseLeave={() => setHovered60(false)}
                >
                  {isHovered60 && (
                    <Image
                      alt="gallery"
                      // height={60}
                      class="w-full object-cover h-full object-center block opacity-25 absolute inset-0"
                      src={myImage60}
                    />
                    // <Image width={100} height={10} src={logo} alt="" />
                  )}
                  {!isHovered60 && (
                    <Image
                      alt="gallery"
                      // height={60}
                      class="w-full object-cover h-full object-center block  absolute inset-0"
                      src={myImage60}
                    />
                  )}

                  <div
                    class="text-center relative w-full "
                    onMouseOver={() => setHovered60(true)}
                    onMouseLeave={() => setHovered60(false)}
                  >
                    {isHovered60 && (
                      <div class="text-center relative w-full z-10">
                        <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">
                          60% Off
                        </h2>
                        <p class="leading-relaxed">
                          Get the 60% OFF coupon and use it in your next
                          purchase.
                        </p>
                        {/* <Link legacyBehavior href={"/stickers"}> */}
                        <a
                          class="mt-3 text-indigo-500 inline-flex items-center"
                          onClick={() => {
                            setitr(4);
                            getpay();
                          }}
                        >
                          Redeem Now!
                          <svg
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            class="w-4 h-4 ml-2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                          </svg>
                        </a>
                        {/* </Link> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default offers;
