require("dotenv").config()
const { API_URL, PUBLIC_KEY, PRIVATE_KEY } = process.env
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

// myNFT.address 0x1b519679980580022E6D828bb0a65565381F1ddB
// myToken.address 0xAd2ec0cF18EaCEd1566F9C5A0D203a9da4812440
// deposit.address 0xbDCbBC9e9A20BFc0c8d0A0E36caAAb6C81943aB2

const myTokenContractJSON = require("./artifacts/contracts/MyToken.sol/MyToken.json")
const myTokenContractAddress = "0xAd2ec0cF18EaCEd1566F9C5A0D203a9da4812440"
const myTokenContract = new web3.eth.Contract(
  myTokenContractJSON.abi,
  myTokenContractAddress
)

const depositContractJSON = require("./artifacts/contracts/Deposit.sol/Deposit.json")
const depositContractAddress = "0xBd5D22DDdF8Ea958F8c381E8EFD1fBAcae556C75"
const depositContract = new web3.eth.Contract(
  depositContractJSON.abi,
  depositContractAddress
)

const transferMyTokenToFarmToken = async () => {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: depositContractAddress,
    nonce: nonce,
    gas: 500000,
    data: depositContract.methods.balance().encodeABI(),
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)

  console.log(await depositContract.methods.balance().call())
  // console.log(await myTokenContract.methods.balance().call())
  // console.log(await depositContract.methods.deposit(Math.pow(10, 10)).call())

  web3.eth
    .sendSignedTransaction(signPromise.rawTransaction)
    .once("transactionHash", (hash) => {
      console.info("transactionHash", hash)
    })
    .once("receipt", (receipt) => {
      console.info("receipt", receipt)
      depositContract.methods
        .balance()
        .call()
        .then((result) => console.log("SmartContract Call: " + result))
    })
    .on("error", console.error)
}

transferMyTokenToFarmToken()
