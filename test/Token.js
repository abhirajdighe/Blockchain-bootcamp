const {ethers} = require('hardhat')
const {expect} = require('chai')

describe("Token",()=>{
    // Testes goes inside here : 

    let token , deployer, accounts;
    const tokens = (n)=>{
        return ethers.utils.parseUnits(n.toString(),'ether')
    }
    beforeEach(async ()=>{
        // Fetch the token from blockchain : 
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy('Dapp University','DAPP','1000000')

        accounts = await ethers.getSigners();
        deployer = accounts[0];
    })
    

    describe('Deployment',()=>{
        const name = 'Dapp University';
        const symbol = 'DAPP';
        const decimal ='18';
        const totalSupply=tokens('1000000');


        it("has correct name",async ()=>{
            // Check the name is correct : 
            expect(await token.name()).to.equal(name)
        })
    
        it("has correct symbol",async ()=>{
            //Read token name : 
           const symbol =  await token.symbol();
            // Check the name is correct : 
            expect(symbol).to.equal(symbol)
        })
    
        it("has correct decimals",async ()=>{
            // Check the name is correct : 
            expect(await token.decimals()).to.equal(decimal)
        })
    
        it("has correct totalSupply",async ()=>{
            // Check the name is correct : 
            expect(await token.totalSupply()).to.equal(totalSupply)
        })

        it("assign total supply to developer",async ()=>{
            // Check the name is correct : 
            // console.log(deployer.toString())
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })
    })
    
    

})