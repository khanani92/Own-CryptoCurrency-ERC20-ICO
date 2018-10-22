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
            //Method called with .call() don't actually create the transition just call the function
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

    it('approve token for delegated Transfer',function(){
        return KhananiToken.deployed().then(function(instance){
            tokenInstance = instance;
            //Method called with .call() don't actually create the transition just call the function
            return tokenInstance.approve.call(accounts[1],100);
        }).then(function(success){
            assert.equal(success, true, 'it returns ture');
            return tokenInstance.approve(accounts[1],100);
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'trigger one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be a approval event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account tokens are authorized by');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
        })
    })

    it('handles delegated token Transfer',function(){
        return KhananiToken.deployed().then(function(instance){
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            return tokenInstance.transfer(fromAccount, 100, {from:accounts[0]}); //for testing giving token to other accounts
        }).then(function(receipt){
            return tokenInstance.approve(spendingAccount,10, {from:fromAccount});
        }).then(function(receipt){
            //Try trasferring smething larger than the sender's balance
            return tokenInstance.transferFrom(fromAccount,toAccount, 9999999, {from:spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert((error.message.indexOf('revert') >= 0), 'cannot transfer value larger than balance');
            //Try trasferring smething larger than the aprroved amount
            return tokenInstance.transferFrom(fromAccount,toAccount, 20, {from:spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert((error.message.indexOf('revert') >= 0), 'cannot transfer valur larger than approved amount');
            return tokenInstance.transferFrom.call(fromAccount,toAccount, 10, {from:spendingAccount});
        })
        .then(function(success){
            assert.equal(success, true, 'it returns ture');
            return tokenInstance.transferFrom(fromAccount,toAccount, 10, {from:spendingAccount});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'trigger one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be a transfer event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(fromAccountBalance){
            assert.equal(fromAccountBalance.toNumber(), 90, 'deducts amount from sender account')
            return tokenInstance.balanceOf(toAccount);
        }).then(function(toAccountBalance){
            assert.equal(toAccountBalance.toNumber(), 10, 'add amount from sender account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance, 0, 'deducts the amount from allowance');
        })
        // .then(function(){
        //     return tokenInstance.transferFrom(fromAccount,toAccount, 10, {from:spendingAccount});
        // })
    })
})