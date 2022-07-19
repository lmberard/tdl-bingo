$(function () {

    /*-------------------------inicio del juego-------------------------- */
    $('#btnStartGame').click(function () {
        // inicio el juego
        App.initBingo();
        console.log("Init Bingo ... OK");

        // creo el tablero
        board = App.getBoard().then(board => {
            console.log("Board created: "+board)
            var idxCol = 0
            var idxRow = 0
            var randomNumber = 0
            var hashTable = {}
            $('td').each(function (index) {
                if((idxCol) >= App.numberPerBoard){
                    idxCol = 0
                    idxRow++
                }
                var randomNumber = board[idxRow+idxCol]
                if(hashTable[randomNumber] == undefined && randomNumber != 0){
                    hashTable[randomNumber] = randomNumber
                    $(this).addClass("cell" + randomNumber).text(randomNumber)
                }
                idxCol += App.numberPerCol
            });
        });

        // obtengo address en donde voy a colectar
        addressText = $('#addressText').val()

        // inicio el token
        App.totalToken = App.initToken
        $('#totalToken').text(App.totalToken)

        App.token.balanceOf(addressText).then(res => {
            console.log("balance in wallet:"+res) 
            $("#totalTokenWallet").text(res)
        })
    });

    /*--------------------------logica del juego-------------------------- */
    $('#btnGenerate').click(function () {
        App.playBingo();
    });

    /*---------------------------guardar tokens--------------------------- */
    function restartTokens () {
        App.totalToken = 0
        $("#totalTokenWallet").text(0)
        $('#totalToken').text(0)
        $('#amountMatches').text(0)
        $('#amountLostNumbers').text(0)
    }

    $('#btnCollect').click(function () {
        addressText = $('#addressText').val()
        console.log("Collect token " + App.totalToken + " to address " + addressText)

        App.transferAndLoadPage(App.account, addressText, App.totalToken)
        restartTokens();
    });

    $('#btnDonate').click(function () {
        console.log("Idem collect pero con nuestra address hardcodeada en el contrato!!!")
        addressText = App.addressPromiseTeam
        console.log("Collect token " + App.totalToken + " to address " + addressText)

        App.transferAndLoadPage(App.account, addressText, App.totalToken)
        restartTokens();
    });

    
    /*---------------------------------------------------------------- */
    window.onbeforeunload = function (e) {
        e = e || window.event;
        var returnString = 'Are you sure?';
        if (e) {
            e.returnValue = returnString;
        }
        return returnString;
    };
});