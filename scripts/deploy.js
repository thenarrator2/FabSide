const hre = require("hardhat");

async function main() {
  const LytToken = await hre.ethers.getContractFactory("LYTToken");
  const lyttoken = await LytToken.deploy(100000000, 50);

  await lyttoken.deployed();

  console.log("LYTToken deployed: ", lyttoken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
