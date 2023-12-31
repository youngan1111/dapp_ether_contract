import { ethers } from "hardhat"

const main = async () => {
  // const MyNFT = await ethers.getContractFactory("MyNFT")
  // const Tether = await ethers.getContractFactory("MyTether")
  // const Ethereum = await ethers.getContractFactory("MyEthereum")
  // const Deposit = await ethers.getContractFactory("Deposit")

  // const myNFT = await MyNFT.deploy()
  // await myNFT.deployed()
  // const deployedTether = await Tether.deploy()
  // await deployedTether.deployed()
  // const deployedEthereum = await Ethereum.deploy()
  // await deployedEthereum.deployed()
  // const deposit = await Deposit.deploy(deployedTether.address, myNFT.address)
  // await deposit.deployed()

  //   console.log(`
  // NEXT_PUBLIC_TETHER_TOKEN_ADDRESS=${deployedTether.address}
  // NEXT_PUBLIC_ETHEREUM_TOKEN_ADDRESS=${deployedEthereum.address}
  // NEXT_PUBLIC_NFT_MINTING_CONTRACT_ADDRESS=${myNFT.address}
  // NEXT_PUBLIC_DEPOSIT_CONTRACT_ADDRESS=${deposit.address}
  //   `)

  // const TokenFactory = await ethers.getContractFactory("TokenFactory")
  // const tokenFactory = await TokenFactory.deploy()
  // await tokenFactory.deployed()
  // console.log(`NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=${tokenFactory.address}`)

  const DynamicSwap = await ethers.getContractFactory("DynamicSwap")
  const dynamicSwap = await DynamicSwap.deploy()
  await dynamicSwap.deployed()
  console.log(`NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS=${dynamicSwap.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
