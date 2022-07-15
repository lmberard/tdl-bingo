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
        App.initBingo();
        console.log("Init Bingo ... OK");
        board = App.getBoard().then(board => {
            console.log("Board created: "+board);
            $('td').each(function (index) {
                var concatClass = this.cellIndex + "" + this.parentNode.rowIndex;
                var randomNumber = board[index];
                var numberString = parseInt(concatClass, 10).toString();
                $(this).addClass("cell" + randomNumber).text(randomNumber);
            });
        });        
    });
    // TODO: lo dejamos o lo sacamos?
    var amountMatches = 0,amountLostNumbers = 0; amountEasierCards = 0;
    $('#btnGenerate').click(function () {
        //$( "#containerGameID" ).show("slow");
        //$( "#containerGameID" ).css({'style':'display: block'})
        App.playBingo();
        

    });
    $('#btnIncrease').click(function (amountMatches) {
        // amountMatches++;
        // console.log("amount: "+amountMatches)
        // $('#amountMatches').text(amountMatches);
    });
    $('#btnEasierCard').click(function () {
        
    });

    $('#btnCollect').click(function () {
        
    });
    $('#btnDonate').click(function () {
        
    });

    window.onbeforeunload = function (e) {
        e = e || window.event;
        var returnString = 'Are you sure?';
        if (e) {
            e.returnValue = returnString;
        }
        return returnString;
    };
});