var KhananiToken = artifacts.require("./KhananiToken.sol");

contract('KhananiToken', function(accounts){
    var tokenInstance;

    it('initialzes the contract with correct value',function(){
        return KhananiToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(tokenName){
            assert.equal(tokenName, 'Khanani Token');
            return tokenInstance.symbol();
        }).then(function(tokenSymbol){
            assert.equal(tokenSymbol, 'KCOIN');
            return tokenInstance.standard();
        }).then(function(tokenStandard){
            assert.equal(tokenStandard, 'Khanani Token v1.0');
        })
    })

    it('allocate the initial supply upon development',function(){
        return KhananiToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocate the initial supply to admin account')
        })
    })

})