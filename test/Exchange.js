const { ethers } = require('hardhat')
const { expect } = require('chai')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Exchange", () => {
    // Testes goes inside here : 

    let deployer,feeAccount,exchange;
    const feePersent = 10;
    
    beforeEach(async () => {
        // Fetch the token from blockchain :

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeAccount = accounts[1];
        
        const Exchange = await ethers.getContractFactory("Exchange")
        exchange = await Exchange.deploy(feeAccount.address,feePersent)
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

})