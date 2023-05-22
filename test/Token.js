const { ethers } = require('hardhat')
const { expect } = require('chai')

describe("Token", () => {
    // Testes goes inside here : 

    let token, deployer, accounts, receiver,exchange;
    const tokens = (n) => {
        return ethers.utils.parseUnits(n.toString(), 'ether')
    }
    beforeEach(async () => {
        // Fetch the token from blockchain : 
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy('Dapp University', 'DAPP', '1000000')

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        receiver = accounts[1];
        exchange = accounts[2];
    })


    describe('Deployment', () => {
        const name = 'Dapp University';
        const symbol = 'DAPP';
        const decimal = '18';
        const totalSupply = tokens('1000000');


        it("has correct name", async () => {
            // Check the name is correct : 
            expect(await token.name()).to.equal(name)
        })

        it("has correct symbol", async () => {
            //Read token name : 
            const symbol = await token.symbol();
            // Check the name is correct : 
            expect(symbol).to.equal(symbol)
        })

        it("has correct decimals", async () => {
            // Check the name is correct : 
            expect(await token.decimals()).to.equal(decimal)
        })

        it("has correct totalSupply", async () => {
            // Check the name is correct : 
            expect(await token.totalSupply()).to.equal(totalSupply)
        })

        it("assign total supply to developer", async () => {
            // Check the name is correct : 
            // console.log(deployer.toString())
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })
    })

    describe('Sending tokens', () => {
        let amount, transaction, result;
        describe('Sucess', () => {
            beforeEach(async () => {
                amount = tokens(100);
                transaction = await token.connect(deployer).transfer(receiver.address, amount);
                result = await transaction.wait();
            })

            it('transfers token balances', async () => {
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
            })

            it("emit a transfer function", async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')
                const args = event.args;
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('failed', async () => {
            it('reject insuffencient balance', async () => {
                const invalidAmount = tokens(100000000);
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
            })

            it('reject invalid recepient', async () => {
                const amount = tokens(100);
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
            })
        })
    })

    describe('Approving tokens', () => {
        let amount,transaction,result;
        beforeEach(async () => {
            amount = tokens(100);
            transaction = await token.connect(deployer).approve(exchange.address, amount);
            result = await transaction.wait();
        })
        describe('sucess', () => {
            it('allocate allowance for delegated spending', async () => {
                expect(await token.allowance(deployer.address,exchange.address)).to.equal(amount);
            })

            it("emit a approval event", async () => {
                const event = result.events[0]
                expect(event.event).to.equal('approval')
                const args = event.args;
                expect(args.owner).to.equal(deployer.address)
                expect(args.spender).to.equal(exchange.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('failuer', () => {
            it('reject invalid spender',async ()=>{
                await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000',amount)).to.be.reverted;
            })
        })
    })
})