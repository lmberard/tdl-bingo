$(function () {
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
        }
    };
    
    $('#btnGenerate').click(function () {
        App.generateRandomNumber();
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