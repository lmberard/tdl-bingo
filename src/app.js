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

  playBingo : async() => {
    
    // TODO: raro que isWinner regrese true siempre???
    board = App.makeMove().then( isWinner => {
      console.log(App.getBoard())

      // See last number & update FE
      App.seeLastNumberAndUpdateView()

      // Check if was Hit & update FE amount matches
      App.checkHitAndUpdateView()

      // Check winner & do something
      App.checkWinnerAndDo()
    })
  },

  initBingo: async ()  => {
    await App.bingo.competitor("pipo", { from: App.account })
  },

  getBoard: async () => {
    return await App.bingo.getBoard({ from: App.account })
  },

  seeLastNumber: async () => {
    return await App.bingo.seeLastNumber({ from: App.account })
  },

  amountHits: async () => {
    return await App.bingo.amountHits()
  },

  checkWinner: async () => {
    return await App.bingo.checkWinner()
  },

  seeLastNumberAndUpdateView: async () => {
    App.seeLastNumber().then( randomNumber => {
      console.log("Random number: "+randomNumber)

      $('.bigNumberDisplay').text(randomNumber)
      $('td.cell' + randomNumber).addClass('selected')
    }).catch( () => { console.log("Error en seeLastNumber!")})
  },

  checkWinnerAndDo: async () => {
    App.checkWinner().then( isWinner => {
        if(isWinner){
          console.log("Ganaste Papa!")
          //TODO: hacer el cierre de juego!
        } else {
          console.log("Seguí participando...")
        }
      })
  
  },

  checkHitAndUpdateView: async () => {
    await App.bingo.wasHit({ from: App.account }).then( wasHit => {
      if(wasHit){
        var amountMatches = $('#amountMatches').text()
        amountMatches = parseInt(amountMatches) + 1

        var collectedMoney = 1 * parseInt(amountMatches) //1 eth per match

        console.log("Was Hit!, matches: " + amountMatches)
        $('#amountMatches').text(parseInt(amountMatches))

        console.log(collectedMoney)
        $('#collectedMoney').text(collectedMoney)
      } else {
        amountLoseMatches = $('#amountLostNumbers').text()
        console.log("Wasn't Hit :-(, lose matches: "+amountLoseMatches)

        $('#amountLostNumbers').text(parseInt(amountLoseMatches)+1)
      }
    })
  },

  collectMoney: async () =>{
    var collectedMoney = $('#collectedMoney').text()
    console.log("pipo, esto estas probando capo: " + collectedMoney)
    str = await App.bingo.collectMoney(collectedMoney, { from: App.account });
    console.log("pipo, el owner es: "+str)
  },
  
  makeMove: async () => {
    const randRange = 10;
    const n = new Date().getTime() % randRange
    return await App.bingo.makeMove(n, randRange, { from: App.account })
  },

  generateRandomRange: async (range) => {

  }
  //TODO: hacer una random de numeros dentro de 1 rango
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
