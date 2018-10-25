var KhananiTokenSale = artifacts.require("./KhananiTokenSale.sol");

contract('KhananiTokenSale', function(accounts){
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // in wei

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
});