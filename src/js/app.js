App = {
  web3Provider: null,
  contracts: {},
  account:'0x0',
  init: function() {
    // Load pets.
   
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContracts();
  },

  initContracts: function() {
    /*
     * Replace me...
     */
    $.getJSON("KhananiTokenSale.json", function(khananiTokenSale) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.KhananiTokenSale = TruffleContract(khananiTokenSale);
      // Connect provider to interact with contract
      App.contracts.KhananiTokenSale.setProvider(App.web3Provider);
      App.contracts.KhananiTokenSale.deployed().then(function(instance) {
        console.log('Khanani Token Sale Address',instance.address)
      })
    }).done(function(){
      $.getJSON("KhananiToken.json", function(khananiToken) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.KhananiToken = TruffleContract(khananiToken);
        // Connect provider to interact with contract
        App.contracts.KhananiToken.setProvider(App.web3Provider);
        App.contracts.KhananiToken.deployed().then(function(instance) {
          console.log('Khanani Token Address',instance.address)
        })
        return App.render();
    })
    

      //App.listenForEvents();
      
      
    })
    //return App.bindEvents();
  },
  render: function() {

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
