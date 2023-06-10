const { ethers } = require('hardhat')
const { expect } = require('chai')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Exchange", () => {
    // Testes goes inside here : 

    let deployer, feeAccount, exchange;
    const feePersent = 10;

    beforeEach(async () => {
        // Fetch the token from blockchain :

        const Exchange = await ethers.getContractFactory("Exchange")
        const Token = await ethers.getContractFactory("Token")

        token1 = await Token.deploy('Dapp University', 'DAPP', '1000000')
        token2 = await Token.deploy('Mock Dai', 'mDai', '1000000')

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeAccount = accounts[1];
        user1 = accounts[2];

        let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100))
        await transaction.wait();

        exchange = await Exchange.deploy(feeAccount.address, feePersent)
    })


    describe('Deployment', () => {

        it("trakes fee account", async () => {
            // Check the name is correct : 
            expect(await exchange.feeAccount()).to.equal(feeAccount.address)
        })

        it("trakes feePersent", async () => {
            // Check the name is correct : 
            expect(await exchange.feePersent()).to.equal(feePersent)
        })

    })

    describe("Depositing Tokens", () => {
        let transaction, result;
        let amount = tokens(10);


        describe("Sucess", () => {
            beforeEach(async () => {
                // Approve tokens :
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait();
                // deposit tokens : 
                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait();
            })

            it('track the token deposit', async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(amount)
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(amount)
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
            })

            it("emits a Deposit events", async () => {
                const event = result.events[1] // 2 events are emitted
                expect(event.event).to.equal('Deposit')

                const args = event.args;
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(amount)
            })
        })

        describe("failure", () => {
            it('No tokens are approved', async () => {
                // don't approve any token before depositing
                await expect(exchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted
            })
        })
    })

    describe("Withdrawing Tokens", () => {
        let transaction, result;
        let amount = tokens(10);


        describe("Sucess", () => {
            beforeEach(async () => {
                //Deposit tokens before withdrawing
                // Approve tokens :
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait();
                // deposit tokens : 
                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait();

                // Now withdraw tokens: 
                transaction = await exchange.connect(user1).withdrawToken(token1.address, amount)
                result = await transaction.wait();
            })

            it('withdraw token funds', async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(0)
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(0)
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(0)
            })

            it("emits a Withdraw events", async () => {
                const event = result.events[1] // 2 events are emitted
                expect(event.event).to.equal('Withdraw')

                const args = event.args;
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(0)
            })
        })

        describe("failure", () => {
            it('fails for insufficient balance', async () => {
                // Attempt to withdraw token without depositing
                await expect(exchange.connect(user1).withdrawToken(token1.address, amount)).to.be.reverted
            })
        })
    })

    describe("Checking Balances", () => {
        let transaction, result;
        let amount = tokens(1);

        beforeEach(async () => {
            // Approve tokens :
            transaction = await token1.connect(user1).approve(exchange.address, amount)
            result = await transaction.wait();
            // deposit tokens : 
            transaction = await exchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait();
        })

        it('returns user balance', async () => {
            expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
        })

    })

    describe("Making the Order",async ()=>{
        let transaction,result ;
        let amount = tokens(1)

        describe("Sucess",async ()=>{
            beforeEach(async()=>{
                //Deposit tokens before making order
                // Approve tokens :
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait();
                // deposit tokens : 
                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait();
                // make order :
                transaction = await exchange.connect(user1).makeOrder(token2.address,amount,token1.address,amount)
                result = await transaction.wait();
            })

            it("track the newly created order",async()=>{
                expect(await exchange.orderCount()).to.equal(1)
            })

            it("emits a Order events", async () => {
                const event = result.events[0] // 2 events are emitted
                expect(event.event).to.equal('Order')

                const args = event.args;
                expect(args.id).to.equal(1)
                expect(args.user).to.equal(user1.address)
                expect(args.tokenGet).to.equal(token2.address)
                expect(args.amountGet).to.equal(tokens(1))
                expect(args.tokenGive).to.equal(token1.address)
                expect(args.amountGive).to.equal(tokens(1))
                expect(args.timestamp).to.at.least(1)
            })
        })

        describe("Failure",async()=>{
            it("Reject order with no balance ",async ()=>{
                await expect(exchange.connect(user1).makeOrder(token1.address,tokens(1),token2.address,tokens(1))).to.be.reverted
            })
        })
    })



})