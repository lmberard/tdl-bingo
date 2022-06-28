// Vamos a usar de referencia https://eips.ethereum.org/EIPS/eip-20

pragma solidity ^0.4.17;

// Token basico
contract LPLToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    //para la asociacion de balances
    mapping(address => uint256) public balanceOf;

    //Los mapping pueden tener mappings: sirve para guardar estructuras de datos mas complejas:
    //mi direccion va a tener asociada otra direccion que a su vez va a tener un valor uint256 de tokens
    //direcciones asociadas al propietrario
    mapping(address => mapping(address => uint256)) public allowance;

    //Event son como los eventos de Js. (esto figura en la documentacion). Los eventos se "trigerean" cuando pasa algo
    //aca los eventos van a ser registros en el log del recibo de una transaccion del smart contract.
    //una buena practica es escribirlos con la primer letra en mayuscula
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    //Como en las clases, en los contratos tiene que haber un constructor que inicialice el mismo
    //siempre tienen que ser public
    constructor() public {
        name = "Promise coin";
        symbol = "LPL"; //Lucas Pedro Lucia
        decimals = 18;
        totalSupply = 1000000 * (uint256(10)**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        //verifico que tenga la cantidad necesaria
        require(balanceOf[msg.sender] >= _value);
        //se resta el valor del usuario y se agrega al destinatario
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true; //porque la funcion devuelve un bool de success
    }

    //para que una persona(address) puede gestionar mis tokens
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        //actualizo el array de allowance
        allowance[msg.sender][_spender] = _value;

        //emito el evento de Approval
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}

/*
- Que onda la funcion de decimales? 
    `function** decimals() **public** view returns (uint8)`
    Nos retorna la cantidad de decimales que va a tener nuestro token. 
    En un smart contract en solidity no se pueden manejar tipos de variables 
    flotantes por lo que se separa entre valor entero y el valor de decimales. 
    Esta funcion esta "acompañada" con la de totalSupply()

- balanceOf() es un mapping que me va a mapear los valores de 
tokens segun la address ingresada. (direcciones con sus saldos)

- Las funciones setters son transfer y transferFrom
 */
