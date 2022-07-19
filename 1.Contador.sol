/*Esto es para aclarar la version de solidity*/
pragma solidity ^0.4.17;

/*todos los contratos empiezan con la palabra contract 
y el nombre del contrato
Good Practice: ponerlo con mayuscula al principio el nombre*/
contract Contador {
    /*declaro la variable de estado*/
    uint256 count;

    //entero sin signo de 256 bytes

    //Funcion constructor. Se tiene que llamar IGUAL
    //otra buena practica es usar _ para los argumentos
    /*public puede ser accedida tanto exteriormente(transaccion externa)
    como interiormente(dentro del contrato en otra funcion)
    Se le llama un modificador de funcion de visibilidad*/
    function Contador(uint256 _count) public {
        count = _count;
    }

    function setCount(uint256 _count) public {
        count = _count;
    }

    /*¿Cual es la diferencia de esas dos? La primera 
    es la funcion inicializadora de cuando ejecuto por primera 
    vez el contrato (construyo) y la otra la puedo llamar en cualquier 
    momento */
    function incrementCount() public {
        count += 1;
    }

    /*
    VIEW: le dice a la maquina virtual que esta funcion no va a cambiar 
    el valor de esa variable de estado y returns te dice que tipo 
    de variable va a ser retornado */
    function getCount() public view returns (uint256) {
        return count;
    }

    /*pure: no va a escribir ni leer ninguna variable global del contrato!*/
    function getNumber() public pure returns (uint256) {
        return 34;
    }

    /*VIEW Y PURE NO CONSUMEN GAS
    GAS: UNIDAD QUE REPRESENTA ACTIVIDAD COMPUTACIONAL Y ESO SE PAGA EN ETHER 
    es decir que es good practice practicarlo ahora porque estas funciones son gratis */
}
