$(function () {

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

    $('#btnGenerate').click(function () {
        App.playBingo();
    });

    $('#btnCollect').click(function () {
        App.collectMoney();
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