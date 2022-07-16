App = {
    contracts: {},

    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        web3.eth.defaultAccount = web3.eth.accounts[0]
      },
    
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
    },

  loadAccount: async () => {
    // Set the current blockchain account
    const accounts = await web3.eth.getAccounts();
    console.log("Account: "+accounts[0]);
    App.account = accounts[0];
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const bingo = await $.getJSON('Lottery.json')
    App.contracts.Bingo = TruffleContract(bingo)
    App.contracts.Bingo.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.bingo = await App.contracts.Bingo.deployed()
  },


  ////////////////////////////////

  changeName: async (name) => {
    await App.bingo.setName(name, { from: App.account });
    console.log('Se setio el nombre: ' + name)
  },

  getName: async () => {
    var name = await App.bingo.getName({ from: App.account });
    console.log("Se muestra: " + name);
    $('#divName').text(name);
  },

  getAddress: async () => {
    $('#divAddress').text(String(App.account));
  },


  ////////////////////////////////
  generateRandomNumber: async () => {
    const n = new Date().getTime() % 100
    const randomNumber = await App.bingo.generateRandom(n, 100)
    console.log("random number: "+ randomNumber.toString())
    $('.bigNumberDisplay').text(randomNumber)
  },

  seeLast: async () => {
    const lastNumber = await App.bingo.getLastNumber({ from: App.account })
    console.log("last number : "+ lastNumber.toString())
    $('#divLastNumber').text('El anterior numero fue: ' + lastNumber.toString());
  },




}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
