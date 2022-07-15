App = {
  initToken: 10,
  totalTokenBingo: 100000000,
  totalTokenPlayer: 0,
  prize: 100,
  contracts: {},

  load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      web3.eth.defaultAccount = web3.eth.accounts[0]

      // Transferimos todo el dinero al address del Bingo
      // en caso de ser necesario
      balanceUserAccount = App.token.balanceOf(App.account).then(
        tokenCount => {
            if(tokenCount == App.totalTokenBingo){
                App.transfer(App.contracts.Bingo.address, tokenCount)
            }
        }
      )
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

    //console.log("address contract:"+App.contracts.Bingo.address)

    App.contracts.Bingo.setProvider(App.web3Provider)
    // Hydrate the smart contract with values from the blockchain
    App.bingo = await App.contracts.Bingo.deployed()


    const token = await $.getJSON('LPLToken.json')
    App.contracts.Token = TruffleContract(token)
    App.contracts.Token.setProvider(App.web3Provider)
    App.token = await App.contracts.Token.deployed()

    //App.transfer(App.contracts.Bingo.addres,1000000, {from: App.account})
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
    
    // TODO: por que isWinnder regresa true siempre??? It's OK?
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
    App.checkWinnder().then( isWinnder => {
        if(!isWinnder){
          console.log("Ganaste!")
          //tokenWin = App.initToken;
          tokenWin = parseInt($('#totalToken').text()) + App.prize
          // Divimos por 100 porque los ultimos 2 numeros representan los decimales
          App.totalTokenPlayer = tokenWin
          // Autorizo a addressText a transferir la cantidad tokenWin
          App.approve(App.account, tokenWin)

          App.transferAndUpdateView(App.contracts.Bingo.address, App.account, tokenWin)
          console.log("Token transferidos!", tokenWin)
        } else {
          console.log("Seguí participando...")
          App.totalTokenPlayer -= 1;
          // Update View
          $('#totalToken').text(App.totalTokenPlayer)

          if(App.totalTokenPlayer == 0){
            console.log("El juego se ha terminado!")
            
            window.location.href = "/endGame.html"
          }
        }
      })
    
    // App.balanceOf(App.account).then(res => {
    //   $("#totalTokenWallet").text(res)
    // })
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
    App.balanceOf(App.account)
  },

  balanceOf: async (address) => {
    App.token.balanceOf(address, { from: App.account }).then(
      balance => {
        console.log("Balance owner["+address+"]: "+balance)
      })
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

  transfer: async(addressTo, tokenAmount) => {
    App.approve(addressTo, tokenAmount)
    App.token.transfer(addressTo, tokenAmount, { from: App.account })
                .then( txRes => {
                    if(txRes) console.log("Tx OK")
                    else console.log("Tx FAIL")
                }
  )},
  
  transferAndUpdateView: async( addressTo, tokenAmount) => {
    App.token.transfer(addressTo, tokenAmount, { from: App.account })
                .then( txOK => {
                    if(txOK) console.log("Tx OK")
                    else console.log("Tx FAIL")

                    App.token.balanceOf(addressTo).then( balance => {
                        $('#totalToken').text(balance)
                        console.log("Balance["+addressTo+"]="+balance)
                    })
                })
  },

  transferFromAndUpdateView: async(fromAddress, toAddress, numToken) =>{
    console.log("fromAddress: "+fromAddress+",toAddress: "+toAddress+",numToken: "+numToken)
    //App.approve(toAddress, numToken, {from: fromAddress});
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
