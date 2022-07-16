$(function () {
    
    $('#btnSetName').click(function (name) {
        var name = document.getElementById('inputName').value;
        App.changeName(name);
    });

    $('#btnGetName').click(function () {
        App.getName();
    });

    $('#btnGetAddress').click(function () {
        console.log("Se mostro la address");
        App.getAddress();
    });


    $('#btnGenerate').click(function () {
        console.log('Generating')
        App.generateRandomNumber();
    });

    $('#btnGetLast').click(function () {
        console.log('last number')
        App.seeLast();
    });

});