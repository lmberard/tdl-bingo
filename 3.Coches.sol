pragma solidity ^0.4.17;

//ARRAY MAPPING Y STRUCTS
contract Coches {
    address owner;
    uint256 precio;
    uint256[] identificadores;

    // Formato similar a javascript con respecto a las funciones =>
    mapping(address => Coche) coches;
    struct Coche {
        uint256 identificador;
        string marca;
        uint32 kilometros;
    }

    constructor(uint256 _precio) public {
        owner = msg.sender;
    }

    // string memory porque se tiene que pedir o declarar una memoria. por esto tiene que ser public la funcion
    //external, el modificador es precioFiltro y se le ingresa el value
    //payable es porque maneja plata
    function addCoche(
        uint256 _id,
        string memory _marca,
        uint32 _kilometros
    ) public payable {
        //primero agrego el id a la lista de identificadores
        identificadores.push(_id);
        //mapeo:
        coches[msg.sender].identificador = _id;
        coches[msg.sender].marca = _marca;
        coches[msg.sender].kilometros = _kilometros;
    }

    //view solo va a leer, no se comunica con el resto de los nodos asique no consume gas.
    // esta funcion me dice la cantidad de identificadores(cant de autos)
    function getIdentificadores() external view returns (uint256) {
        return identificadores.length;
    }

    function getCoche()
        external
        view
        returns (string memory marca, uint32 kilometros)
    {
        //aca devuelve varios valores como un struct.
        marca = coches[msg.sender].marca;
        kilometros = coches[msg.sender].kilometros;
    }
}
