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

    it('transfers token ownership',function(){
        return KhananiToken.deployed().then(function(instance){
            tokenInstance = instance;
            //Test 'require' statement first by transfaring something larger than sender's balance
            //Method called with .call() don't actually call the function and create the transction
            return tokenInstance.transfer.call(accounts[1], 99999999999999999999999);
        }).then(assert.fail).catch(function(error){
            //console.log('????????',typeof error,typeof error.message,error.message.indexOf('revert') >= 0)
            assert((error.message.indexOf('revert') >= 0), 'error msg must contain revert');
            return tokenInstance.transfer.call(accounts[1],250000, {from: accounts[0]})            
        }).then(function(success){
            assert.equal(success, true, 'it returns ture');
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        })
        .then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'trigger one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be a transfer event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(accountBalance){
            assert.equal(accountBalance.toNumber(), 250000, 'it adds amount to reciving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 750000, 'it deducts amount from sending account');
        })
    })

})