var KhananiToken = artifacts.require("./KhananiToken.sol");
var KhananiTokenSale = artifacts.require("./KhananiTokenSale.sol");

contract('KhananiTokenSale', function(accounts){
    var tokenInstance;
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // in wei
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokensAvailable = 750000;
    var numberOfToken;
    it('initializes the contract with correct value',function(){
        return KhananiTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        })
        .then(function(price){
            assert.equal(price,tokenPrice, 'token price is correct');
            //return tokenSaleInstance.standard();
        })
        //.then(function(tokenStandard){
        //     assert.equal(tokenStandard, 'Khanani Token v1.0');
        // })
    })

    it('facilitates token buying',function(){
        return KhananiToken.deployed().then(function(instance){
            tokenInstance = instance;
            return KhananiTokenSale.deployed();
        }).then(function(SInstance){
            tokenSaleInstance = SInstance;
            //provision 75% of all token sale 
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from:admin} );
        }).then(function(receipt){
            numberOfToken = 10;
            var value = numberOfToken * tokenPrice; 
            return tokenSaleInstance.buyToken(numberOfToken,{from: buyer, value: value});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'trigger one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be a sell event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased tokens');
            assert.equal(receipt.logs[0].args._amount, numberOfToken, 'logs the number of token purchased');
            return tokenSaleInstance.tokensSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(), numberOfToken, 'increments the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        })
        .then(function(buyerBalance){
            console.log('buyer',buyerBalance.toNumber())
            assert.equal(buyerBalance.toNumber(), numberOfToken)    
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        })
        .then(function(balance){
            assert.equal(balance.toNumber(), tokensAvailable - numberOfToken)
            //try to buy token diff from the ether value
            return tokenSaleInstance.buyToken(numberOfToken,{from: buyer, value: 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'msg.value must be equal number of tokens in wei')
            return tokenSaleInstance.buyToken(800000,{from: buyer, value: numberOfToken * tokenPrice});
        })
        .then(assert.fail).catch(function(error){
            //console.log(error);
            assert(error.message.indexOf('revert') >= 0, '1 cannot purchase more tokens then available')
        })
    })
    
});