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


    const token = await $.getJSON('LPLToken.json')
    App.contracts.Token = TruffleContract(token)
    App.contracts.Token.setProvider(App.web3Provider)
    App.token = await App.contracts.Token.deployed()
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
    
    // TODO: raro que isWinnder regrese true siempre???
    board = App.makeMove().then( isWinnder => {

      console.log("makeMove response: "+isWinnder)

      // See last number & update FE
      App.seeLastNumberAndUpdateView()

      // Check if was Hit & update FE amount matches
      App.checkHitAndUpdateView()

      // Check winnder & do something
      App.checkWinnderAndDo()
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

  checkWinnder: async () => {
    return await App.bingo.checkWinnder()
  },

  seeLastNumberAndUpdateView: async () => {
    App.seeLastNumber().then( randomNumber => {
      console.log("Random number: "+randomNumber)

      $('.bigNumberDisplay').text(randomNumber)
      $('td.cell' + randomNumber).addClass('selected')
    }).catch( () => { console.log("Error en seeLastNumber!")})
  },

  checkWinnderAndDo: async () => {
    addressText = $('#addressText').val()
    App.checkWinnder().then( isWinnder => {
        if(isWinnder){
          console.log("Ganaste Papa!")
          //TODO: hacer el cierre de juego!
          // Sumamos token por ganar
          App.approve(App.account, 10)
            .then( res => {console.log("res approve: "+res)})
          App.transferFromAndUpdateView(App.account ,addressText, 20)
            .then( res => {console.log("res: "+res)})
          //App.transferFromAndUpdateView(App.account, addressText, 20)
            
        } else {
          console.log("Seguí participando...")
          App.approve(addressText, 10)
            .then( res => {console.log("res approve: "+res)})
          App.transferFromAndUpdateView(addressText, App.account, 10)
          //App.transferFromAndUpdateView(addressText, App.account, 10)
            .then( res => {console.log("res: "+res)})
        }
      })
  
  },

  checkHitAndUpdateView: async () => {
    await App.bingo.wasHit({ from: App.account }).then( wasHit => {
      if(wasHit){
        amountMatches = $('#amountMatches').text()
        console.log("Was Hit!, matches: "+amountMatches)

        $('#amountMatches').text(parseInt(amountMatches)+1)
      } else {
        amountLoseMatches = $('#amountLostNumbers').text()
        console.log("Wasn't Hit :-(, lose matches: "+amountLoseMatches)

        $('#amountLostNumbers').text(parseInt(amountLoseMatches)+1)
      }
    })
  },
  
  makeMove: async () => {
    const randRange = 10;
    const n = new Date().getTime() % randRange
    return await App.bingo.makeMove(n, randRange, { from: App.account })
  },

  balanceOfOwner: async () => {
    App.balanceOf(App.account).then( balance => {
      console.log("Balance: "+balance)
    })
  },

  balanceOf: async (address) => {
    return await App.token.balanceOf(address, { from: App.account })
  },

  approve: async(address, numToken) => {
    return await App.token.approve(address, numToken, { from: App.account })
  },

  transferAndUpdateView: async(addressFrom, addressTo, tokenAmount) => {
    App.token.transfer(addressTo, tokenAmount, { from: App.account })
                .then( txOK => {
                    if(txOK) console.log("Tx OK")
                    else console.log("Tx FAIL")

                    App.token.balanceOf(addressText).then( balance => {
                        $('#totalToken').text(balance)
                        console.log("Balance["+addressText+"]="+balance)
                    })
                })
  },
  transferFromAndUpdateView: async(ownerAddress,buyerAddress,numToken) =>{
    console.log("ownerAddres:"+ownerAddress+",buyerAddress:"+buyerAddress+",numToken:"+numToken)

    App.token.transferFrom(ownerAddress, buyerAddress, numToken, { from: ownerAddress })
      .then( txOK => {
        if(txOK) console.log("Tx OK")
        else console.log("Tx FAIL")

        App.token.balanceOf(ownerAddress, { from: App.account }).then( balance => {
            $('#totalToken').text(balance)
            console.log("Balance["+ownerAddress+"]="+balance)
        })
      })
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
