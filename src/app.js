App = {
  // Config params
  numberPerBoard: 21,
  numberPerLines: 7,
  numberPerCol: 3,
  randRange: 100,
  matchTokenWin: 5,
  initToken: 10,
  totalToken: 0,
  addressPromiseTeam: "0x4da5D2f47ed9F93FF317e689a4b1eda25D2e1352",
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
    const accounts = await web3.eth.getAccounts()
    console.log("Account: "+accounts[0])
    App.account = accounts[0]
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
    const n = new Date().getTime() % 100
    const randomNumber = await App.bingo.generateRandom(n, 100)
    console.log("random number: "+ randomNumber.toString())

    $('.bigNumberDisplay').text(randomNumber)
    $('td.cell' + randomNumber).addClass('selected')
    return randomNumber
  },

  playBingo : async() => {
    
    board = App.makeMove().then( isWinner => {

      console.log("makeMove response: "+isWinner)

      // See last number & update FE
      App.seeLastNumberAndUpdateView()

      // Check if was Hit & update FE amount matches
      App.checkHitAndUpdateView().then( wasHit => {
        // Check Winner & do something
        App.checkWinnerAndDo(wasHit)
      })
      
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

  wasHit: async () => {
    return await App.bingo.wasHit()
  },

  seeLastNumberAndUpdateView: async () => {
    App.seeLastNumber().then( randomNumber => {
      console.log("Random number: "+randomNumber)

      $('.bigNumberDisplay').text(randomNumber)
      $('td.cell' + randomNumber).addClass('selected')
    }).catch( () => { console.log("Error en seeLastNumber!")})
  },

  checkWinnerAndDo: async (wasHit) => {
    addressText = $('#addressText').val()
    App.checkWinner().then( isWinner => {
        if(isWinner){
          console.log("Ganaste!")
          tokenWin = 1000
          App.totalToken = tokenWin/100
          App.approve(addressText, tokenWin)
          App.transferAndUpdateView(App.account, addressText, tokenWin)
          console.log("Token transferidos!", tokenWin)
        } else {
          if(!wasHit){
            console.log("Seguí participando...")
            App.totalToken -= 1
          }

          $('#totalToken').text(App.totalToken)

          if(App.totalToken == 0){
            console.log("El juego se ha terminado!")
            window.location.href = "/endGame.html"
          }
        }
      })
    
    App.balanceOf(addressText).then(res => {
      $("#totalTokenWallet").text(res)
    })
     
  },

  checkHitAndUpdateView: async () => {
    wasHit = await App.bingo.wasHit({ from: App.account }).then( wasHit => {
      if(wasHit){
        amountMatches = $('#amountMatches').text()
        console.log("Was Hit!, matches: "+ (parseInt(amountMatches) + 1).toString()
          + " wins "+App.matchTokenWin+" tokens")

        $('#amountMatches').text(parseInt(amountMatches)+1)
        App.totalToken += App.matchTokenWin
      } else {
        amountLoseMatchesNext = parseInt($('#amountLostNumbers').text())+1
        
        console.log("Wasn't Hit :-(, lose matches: "+amountLoseMatchesNext.toString())

        $('#amountLostNumbers').text(amountLoseMatchesNext)
      }
      return wasHit
    })
    console.log("was hits: "+wasHit)
    return wasHit
  },
  
  makeMove: async () => {
    const randRange = App.randRange;
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

  allowance: async(addressOwner, addressDelegate) => {
    return await App.token.allowance(addressOwner, addressDelegate)
  },

  transferAndLoadPage: async(addressFrom, addressTo, tokenAmount) => {
    App.approve(addressTo, tokenAmount)
    App.token.transfer(addressTo, tokenAmount, { from: addressFrom })
                .then( txOK => {
                    if(txOK) console.log("Tx OK")
                    else console.log("Tx FAIL")

                    window.location.href = '/endGame.html'
                  })
  },

  transfer: async(addressFrom, addressTo, tokenAmount) => {
    App.approve(addressTo, tokenAmount)
    App.token.transfer(addressTo, tokenAmount, { from: addressFrom })
                .then( txOK => {
                    if(txOK) console.log("Tx OK")
                    else console.log("Tx FAIL")
                }
  )},

  transferAndUpdateView: async(addressFrom, addressTo, tokenAmount) => {
    App.token.transfer(addressTo, tokenAmount, { from: addressFrom })
                .then( txOK => {
                    if(txOK) console.log("Tx OK")
                    else console.log("Tx FAIL")

                    App.token.balanceOf(addressText).then( balance => {
                        $('#totalToken').text(balance)
                        console.log("Balance["+addressText+"]="+balance)
                    })
                })
  },

  transferFromAndUpdateView: async(fromAddress, toAddress, numToken) =>{
    console.log("fromAddress: "+fromAddress+",toAddress: "+toAddress+",numToken: "+numToken)

    App.token.transferFrom(fromAddress, toAddress, numToken, { from: App.account })
      .then( txOK => {
        if(txOK) console.log("Tx OK")
        else console.log("Tx FAIL")

        App.token.balanceOf(fromAddress, { from: App.account }).then( balance => {
            $('#totalToken').text(balance)
            console.log("Balance["+fromAddress+"]="+balance)
        })
      })
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
