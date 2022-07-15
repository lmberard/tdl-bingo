$(function () {
    const priceNotMatch = 0.1, priceIncrease = 1, priceEasierCard = 10;
    const rewardMatch = 0.4, rewardCompleteLine = 100, rewardBingo = 1000;

    var bingo = {
        selectedNumbers:[],
        generateRandom:function () {
            var min = 0;
            var max = 20;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random;
        },
        generateNextRandom:function () {
            if (bingo.selectedNumbers.length > 20) {
                alert("All numbers Exhausted");
                return 0;
            }
            var random = bingo.generateRandom();
            while ($.inArray(random, bingo.selectedNumbers) > -1) {
                random = bingo.generateRandom();
            }
            bingo.selectedNumbers.push(random);
            return random;
        },
        generateTableRandom:function () {
            var min = 0;
            var max = 20;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random;
        }
    };

    $('#btnStartGame').click(function () {

        console.log("Selected Account:"+App.account)

        // Iniciamos el juego
        App.initBingo();
        console.log("Init Bingo ... OK");
        
        console.log("Transfer Bingo ... OK")
        
        // Recuperamos el Carton de Bingo y lo agregamos en la vista
        board = App.getBoard().then(board => {
            console.log("Board created: "+board);
            $('td').each(function (index) {
                var concatClass = this.cellIndex + "" + this.parentNode.rowIndex;
                var randomNumber = board[index];
                var numberString = parseInt(concatClass, 10).toString();
                $(this).addClass("cell" + randomNumber).text(randomNumber);
            });
        });

        // Seteamos la cantidad de Token con la que comienza nuestro jugador
        // Y actualizamos la vista
        App.totalTokenPlayer = App.initToken
        $('#totalToken').text(App.totalTokenPlayer)

        // Usamos la llamada del token
        App.token.balanceOf(App.account).then(res => {
            console.log("balance in wallet["+App.account+"]: "+res) 
            $("#totalTokenWallet").text(res)
        })
    });

    $('#btnGenerate').click(function () {
        App.playBingo();
    });

    $('#btnCollect').click(function (e) {
        console.log("Collect token "+App.totalToken+" to address "+App.account)

        e.preventDefault();

        App.transferAndLoadPage(App.account, addressText, App.totalToken)

        // Clean FE
        App.totalToken = 0
        $("#totalTokenWallet").text(0)
        $('#totalToken').text(0)
    });

    window.onbeforeunload = function (e) {
        e = e || window.event;
        var returnString = 'Are you sure?';
        if (e) {
            e.returnValue = returnString;
        }
        return returnString;
    };

    // $('#btnIncrease').click(function (amountMatches) {
    //     console.log("Implementar!!!")
    // });

    // $('#btnEasierCard').click(function () {
    //     console.log("Implementar!!!")
    // });

    // $('#btnDonate').click(function () {
    //     console.log("Implementar!!!")
    // });
});