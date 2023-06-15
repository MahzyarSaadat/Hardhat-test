require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-ethers")
require("hardhat-deploy")
require("dotenv").config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRAIVATE_KEY_0 = process.env.PRAIVATE_KEY_0
const ETHERSCAN_API = process.env.ETHERSCAN_API

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.18",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRAIVATE_KEY_0],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API,
    },
    gasReporter: {
        enabled: false,
        noColors: true,
        currency: "USD",
        // coinmarketcap: COINMARKETCAP_API,
        token: "MATIC",
    },
}
