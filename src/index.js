$(function () {

    /*-------------------------inicio del juego-------------------------- */
    $('#btnStartGame').click(function () {
        // inicio el juego
        App.initBingo();
        console.log("Init Bingo ... OK");

        // creo el tablero
        board = App.getBoard().then(board => {
            console.log("Board created: "+board);
            $('td').each(function (index) {
                var randomNumber = board[index];
                $(this).addClass("cell" + randomNumber).text(randomNumber);
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
    }

    $('#btnCollect').click(function () {
        addressText = $('#addressText').val()
        console.log("Collect token " + App.totalToken + " to address " + addressText)

        App.transferAndLoadPage(App.account, addressText, App.totalToken)
        restartTokens();
    });

    $('#btnDonate').click(function () {
        console.log("Idem collect pero con nuestra address hardcodeada en el contrato!!!")
        addressText = "0x4da5D2f47ed9F93FF317e689a4b1eda25D2e1352"
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