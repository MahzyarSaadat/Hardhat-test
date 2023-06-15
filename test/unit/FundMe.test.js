const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundME", function () {
    let fundme, mock
    let deployer
    let sendEther = ethers.utils.parseEther("1")
    beforeEach(async () => {
        await deployments.fixture(["all"])

        deployer = (await getNamedAccounts()).deployer

        const myContract = await deployments.get("FundMe")
        const myMockContract = await deployments.get("MockV3Aggregator")
        fundme = await ethers.getContractAt(myContract.abi, myContract.address)
        mock = await ethers.getContractAt(
            myMockContract.abi,
            myMockContract.address
        )
    })

    describe("Constructor", function () {
        it("MockAggregator address should be the priceFeed address", async () => {
            const response = await fundme.priceFeed()
            assert.equal(response, mock.address)
        })
    })

    describe("fund", function () {
        it("Send enough ether to contract", async () => {
            expect(fundme.fund()).to.be.revertedWith("Didn't send enough")
        })

        it("funder is deployer", async () => {
            await fundme.fund({ value: sendEther })
            const response = fundme.funders(0)
            assert(response, deployer)
        })

        it("msg.sender could represent a value", async () => {
            await fundme.fund({ value: sendEther })
            const response = fundme.funderToAmount(deployer)
            assert(response.toString(), sendEther.toString())
        })
    })

    describe("withdraw", function () {
        it("work with single account", async () => {
            const startingFundBalance = await ethers.provider.getBalance(
                fundme.address
            )

            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //act
            const transactionResponse = await fundme.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            //ending
            const endingFundBalance = await ethers.provider.getBalance(
                fundme.address
            )

            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            assert(endingFundBalance, 0)
            assert.equal(
                startingFundBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })

        it("woke by multiple accounts", async () => {
            const siners = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const connectedFundMeContract = await fundme.connect(siners[i])
                await connectedFundMeContract.fund({ value: sendEther })
            }

            const startingFundBalance = await ethers.provider.getBalance(
                fundme.address
            )

            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //act
            const transactionResponse = await fundme.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            //ending
            const endingFundBalance = await ethers.provider.getBalance(
                fundme.address
            )

            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            assert(endingFundBalance, 0)
            assert.equal(
                startingFundBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )

            //after ending withdraw all of funders and addressToFunders reset
            await expect(fundme.funders(0)).to.be.reverted
        })
    })
})
