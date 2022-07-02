// import '../node_modules/@metamask/legacy-web3'
// // // v ar contract = require("truffle-contract");
// // const { web3 } = window
// // // const selectedAddress = web3.eth.defaultAccount
// // const PORT = 7545;

App = {
    contracts: {},

    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        web3.eth.defaultAccount = web3.eth.accounts[0]
        // await App.render()
      },
    
      
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
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
    //App.account = web3.eth.accounts[0]
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
    //Agrego un participante!
    await App.bingo.participate("foo", { from: App.account })
    //Muestro las cartas
    card = await App.bingo.seeCard(0, { from: App.account })
    console.log("card: "+ card.toString())

    // const n = new Date().getTime() % 10
    // const range = 10
    // const win = await App.bingo.makeMove(n, range, { from: App.account })

     const n = new Date().getTime() % 10
     const randomNumber = await App.bingo.generateRandom(n, 10)
    var amountMatches = 0;
    $('.bigNumberDisplay').text(randomNumber)
    
    $('td.cell' + randomNumber).addClass('selected')
    CardMatch = document.getElementById('td.cell'  + randomNumber).getText();

    console.log(CardMatch)

    // if($('td.cell' + randomNumber).addClass('selected')){
    //   amountMatches++;
    //   console.log("amount: "+amountMatches);
    //   $('#amountMatches').text(amountMatches);
    // }
    
      

    console.log("randomNumber: "+ randomNumber.toString())

    //await checkHit();

  },

  generateRandomRange: async (range) => {

  }
  //TODO: hacer una random de numeros dentro de 1 rango
}

// App.listen(PORT, () => console.log(`app listening at http://localhost:${PORT}`))

$(() => {
  $(window).load(() => {
    App.load()
  })
})
