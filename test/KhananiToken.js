var KhananiToken = artifacts.require("./KhananiToken.sol");

contract('KhananiToken', function(accounts){

    it('set total supply upon development',function(){
        return KhananiToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
        })
    })

})