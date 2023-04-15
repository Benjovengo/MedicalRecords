require('@nomicfoundation/hardhat-toolbox')
require("hardhat-gas-reporter")
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    goerli: {
      chainId: 5,
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      blockExplorerUrl: "https://goerli.etherscan.io/",
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  },
  /* gasReporter: {
    currency: 'ETH',
    enabled: true
  }, */
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  }
}
