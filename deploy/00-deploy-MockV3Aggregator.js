//imports

const { network } = require("hardhat")
const {
    deploymentsChians,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (deploymentsChians.includes(network.name)) {
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        })
        log("mock deployed")
        log("------------------------------------------------")
    }
}

module.exports.tags = ["all", "mock"]
