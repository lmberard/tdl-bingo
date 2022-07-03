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
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
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
  generateRandomNumber: async () => {
    //Llamada al contrato
    const n = new Date().getTime() % 100
    const randomNumber = await App.bingo.generateRandom(n, 100)
    console.log("random number: "+ randomNumber.toString())

    $('.bigNumberDisplay').text(randomNumber)
    $('td.cell' + randomNumber).addClass('selected')
    return randomNumber
  },

  checkHit: async () => {
    const wasHit = await App.bingo.wasHit()
    console.log("checkHit: "+wasHit);

    amountMatches = $('#amountMatches').text()
    $('#amountMatches').text(parseInt(amountMatches)+1)
  },

  playBingo : async() => {
    const randRange = 10

    board = await App.getBoard()
    console.log("Retrieve board: "+ board.toString())

    const n = new Date().getTime() % randRange
    const randomNumber = await App.bingo.generateRandom(n, randRange)
    var amountMatches = 0;

    $('.bigNumberDisplay').text(randomNumber)   
    $('td.cell' + randomNumber).addClass('selected')

    amountMatches++;
  },

  initBingo: async ()  => {
    await App.bingo.competitor("pipo", { from: App.account })
  },

  getBoard: async () => {
    return await App.bingo.getBoard({ from: App.account })
  },


  generateRandomRange: async (range) => {

  }
  //TODO: hacer una random de numeros dentro de 1 rango
}

$(() => {
  $(window).load(() => {
    App.load()
    //App.initBingo()
    //App.bingo.competitor("foo", { from: App.account })
  })
})
