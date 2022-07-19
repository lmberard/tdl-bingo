pragma solidity ^0.4.17;

contract Banco {
    //declaro una variable global del tipo address
    address owner;

    //modificador personalizado:
    modifier onlyOwner() {
        //medida de seguridad para que no lo pueda invocar cualquier persona, solo el que hace el deploy
        require(msg.sender == owner);
        _; //esto hay que ponerlo siempre. le dice que ejecute lo que sigue
    }

    //funcion para cambiar de dueño. solo lo puede cambiar el dueño actual
    function newOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    //devuelve el owner
    function getOwner() public view returns (address) {
        return owner;
    }

    //devuelve el saldo
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /*payable permite que reciba dinero en eth */
    function Banco() public payable {
        owner = msg.sender;
        /*la direccion del que haga 
        deploy se va a guardar aca*/
    }

    /*aca me esta dicinedo en cuanto lo incremento
    y el require es para verificar!!! es good practice 
    porque sino puedo mandar cualquier cosa.
    es una medida de seguridad*/
    function incrementBalance(uint256 amount) public payable {
        require(msg.value == amount);
    }

    /*msg es una variable global que va a tener 
    propiedades sobre el origen de la transaccion
    aca con sender esta haciendo referencia a la direccion 
    de origen que ha invocado esa funcion (cuenta externa)
    transfer es para transferir y el argumento es la cantidad que le voy a mandar
    en este caso es TODA la plata por eso es address(this) */
    function withdrawBalance() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    /*esta funcion es anonima: esta funcion lo que hace 
    es cuando se invoca un contrato con una funcion determinada
    y esa no la encuentra, se ejecuta esta funcion sin nombre por default*/
    function() public payable {}
}
