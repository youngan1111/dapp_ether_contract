require("dotenv").config()
const { API_URL, PUBLIC_KEY, PRIVATE_KEY } = process.env
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

// myNFT.address 0x1b519679980580022E6D828bb0a65565381F1ddB
// myToken.address 0xAd2ec0cF18EaCEd1566F9C5A0D203a9da4812440
// deposit.address 0xbDCbBC9e9A20BFc0c8d0A0E36caAAb6C81943aB2

const myTokenContractJSON = require("./artifacts/contracts/Staking.sol/Staking.json")
const myTokenContractAddress = "0x98bE530B2e605c0fe5D43422515199539E8c1436"
const myTokenContract = new web3.eth.Contract(
  myTokenContractJSON.abi,
  myTokenContractAddress
)

const transferMyTokenToFarmToken = async () => {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: myTokenContractAddress,
    nonce: nonce,
    gas: 500000,
    data: myTokenContract.methods.stake(100).encodeABI(),
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)

  web3.eth
    .sendSignedTransaction(signPromise.rawTransaction)
    .once("transactionHash", (hash) => {
      console.info("transactionHash", hash)
    })
    .once("receipt", (receipt) => {
      console.info("receipt", receipt)
      myTokenContract.methods
        .stake(100)
        .call()
        .then((result) => console.log("SmartContract Call: " + result))
    })
    .on("error", console.error)
}

transferMyTokenToFarmToken()
