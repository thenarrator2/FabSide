import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import faucetContract from "./ethereum/faucet";
const ERC20ABI = require("./ethereum/abi.json");
import { Alchemy, Network } from "alchemy-sdk";
import Link from "next/link";
import Image from "next/image";
import img from "../assets/token.jpg";

const loyality = () => {
  const [lyt, setlyt] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();

    // transaction();
  }, [walletAddress]);

  // useEffect(() => {
  //   displayTransactions();
  // }, []);

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

        let lytt;
        const lyttcontact = await new ethers.Contract(
          "0xB7A72616ddA74E4E900C589667fC58A42eE811c4",
          ERC20ABI,
          provider
        );
        lytt = await lyttcontact.balanceOf(walletAddress);
        lytt = ethers.utils.formatEther(lytt, 18);
        setlyt(lytt);
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

          let lytt;
          const lyttcontact = await new ethers.Contract(
            "0xB7A72616ddA74E4E900C589667fC58A42eE811c4",
            ERC20ABI,
            provider
          );
          lytt = await lyttcontact.balanceOf(walletAddress);
          lytt = ethers.utils.formatEther(lytt, 18);
          setlyt(lytt);
          displayTransactions();
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

  async function fetchTransactions() {
    const apiKey = "TF42EYG5JM9C7KQQ2WA786H5KX9M2WYA73";
    // let c = walletAddress;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    /* get accounts */
    const accounts = await provider.send("eth_accounts", []);
    // console.log(accounts[0]);
    let contractAddress = accounts[0];

    // const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&apikey=${apiKey}`;
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=tokentx&address=${contractAddress}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.result;
  }
  async function displayTransactions() {
    const transactions = await fetchTransactions();

    var tablebody = document.querySelector("#mytable tbody");

    transactions.forEach((transaction) => {
      var newRow = document.createElement("tr");
      var statuscell = document.createElement("td");
      var methodcell = document.createElement("td");
      var agecell = document.createElement("td");
      var fromcell = document.createElement("td");
      var tocell = document.createElement("td");
      var amountcell = document.createElement("td");

      if (transaction.tokenSymbol == "LYT") {
        // var ind;

        // if (transaction.txreceipt_status == "0") {
        //   ind = "Failed";
        // } else if (transaction.txreceipt_status == "1") {
        //   ind = "Passed";
        // }
        const unixTimestamp = transaction.timeStamp;
        const date = new Date(unixTimestamp * 1000);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.toLocaleTimeString()}`;
        console.log(dateString);

        var met;
        if (transaction.from == walletAddress) {
          met = "Transfer";
        } else if (transaction.to == walletAddress) {
          met = "Recieved";
        } else {
          met = "Transfer";
        }

        // statuscell.textContent = ind;
        methodcell.textContent = met;
        agecell.textContent = dateString;
        fromcell.textContent = `${transaction.from}`;
        tocell.textContent = `${transaction.to}`;
        amountcell.textContent = `${transaction.value / 1e18} LYT`;

        // newRow.appendChild(statuscell);
        newRow.appendChild(methodcell);
        newRow.appendChild(agecell);
        newRow.appendChild(fromcell);
        newRow.appendChild(tocell);
        newRow.appendChild(amountcell);

        tablebody.appendChild(newRow);
        // if (ind == "Passed" && (met == "Funded" || met == "Transfer")) {
        //     amt = amt + transaction.value / 1e18
        // }
        // console.log(transaction.value / 1e18)

        // amountwithdraw.innerHTML = amt + "ETH"

        console.log(transaction);
      }
    });
  }

  return (
    <section class="text-gray-600 body-font">
      <div class="container mx-auto flex  py-24 items-center justify-center flex-col">
        <Image
          class="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
          alt="hero"
          src={img}
        />
        <div class="text-center lg:w-2/3 w-full">
          <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            Your Loyalty Token: {lyt}
          </h1>
          <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            Your Wallet Address: {walletAddress}
          </h1>
          <p class="mb-8 leading-relaxed">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex eaque
            nulla quia, sit vitae tempora voluptate nihil eius molestias
            asperiores!
          </p>

          <div class="container px-5 py-24 mx-auto">
            <div class="-my-8 divide-y-2 divide-gray-100">
              <div class="py-8 flex flex-wrap md:flex-nowrap">
                <div class="md:flex-grow">
                  <h2 class="text-2xl font-medium text-gray-900 title-font mb-2">
                    Keep Shopping and Earn Loyality Tokens
                  </h2>
                  <p class="leading-relaxed">
                    Shop more and earn LYT tokens. You can spend the tokens to
                    purchase items.
                  </p>
                  <Link legacyBehavior href={"/"}>
                    <a class="text-pink-500 inline-flex items-center mt-4">
                      Keep Shopping
                      <svg
                        class="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div class=" py-24 ">
            <div class="flex flex-col text-center w-full mb-20">
              <h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
                Your Token Logs
              </h1>
              <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
                Your Token Transaction log is safe with us.
              </p>
            </div>
            <div>
              <table id="mytable" class="table table-striped container-fluid">
                <thead>
                  <tr>
                    <th class=" py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      Method
                    </th>
                    <th class=" py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      Time
                    </th>
                    <th class=" py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      From
                    </th>
                    <th class=" py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      To
                    </th>
                    <th class=" py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      Token
                    </th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
            {/* <div class="flex pl-4 mt-4 lg:w-2/3 w-full mx-auto">
              <a class="text-pink-500 inline-flex items-center md:mb-2 lg:mb-0">
                Learn More
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
              <button class="flex ml-auto text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">
                Button
              </button> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default loyality;
