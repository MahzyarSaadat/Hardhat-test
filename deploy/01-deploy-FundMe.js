//imports

const { network } = require("hardhat")
const { networkConfig, deploymentsChians } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const networkChainId = network.config.chainId

    let ethUsdPriceFeed
    if (deploymentsChians.includes(network.name)) {
        const getMock = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeed = await getMock.address
    } else {
        ethUsdPriceFeed = networkConfig[networkChainId]["ethUsdPriceFeed"]
    }

    const FundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        log: true,
        args: [ethUsdPriceFeed],
        waitConfirmations: (await network.config.blockConfirmations) || 1,
    })
    log("-------------------------------------")

    if (!deploymentsChians.includes(network.name)) {
        console.log("verifing ...")
        await verify(FundMe.address, [ethUsdPriceFeed])
    }
}

module.exports.tags = ["all", "fund"]
