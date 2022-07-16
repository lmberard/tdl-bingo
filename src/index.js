$(function () {
    const priceNotMatch = 0.1, priceIncrease = 1, priceEasierCard = 10;
    const rewardMatch = 0.4, rewardCompleteLine = 100, rewardBingo = 1000;

    $('#btnStartGame').click(function () {
        App.initBingo();
        console.log("Init Bingo ... OK");
        board = App.getBoard().then(board => {
            console.log("Board created: "+board);
            $('td').each(function (index) {
                var randomNumber = board[index];
                $(this).addClass("cell" + randomNumber).text(randomNumber);
            });
        });        
    });

    var amountMatches = 0,amountLostNumbers = 0; amountEasierCards = 0;
    $('#btnGenerate').click(function () {
        App.playBingo();
    });

    $('#btnIncrease').click(function (amountMatches) {
        console.log("Yet not implemented")
    });

    $('#btnEasierCard').click(function () {
        console.log("Yet not implemented")
    });

    $('#btnCollect').click(function () {
        console.log("Yet not implemented")
    });
    
    $('#btnDonate').click(function () {
        console.log("Yet not implemented")
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