// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

pragma experimental ABIEncoderV2;
library SafeMath{
    // La Resta
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    // La Suma
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
    // La Multiplicación
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
        return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }
}

//Interface token ERC
interface IERC20{
    // //El suministro total de tokens
    // function totalsupply()external view returns (uint256);
    // //Devuelve el número de tokens de una dirección
    // function balanceOf(address account)external view returns (uint256);
    // //Un usuario tiene la cantidad de tokens suficientes (y devuelve el número)
    // function allowance(address owner, address spender)external view returns (uint256);
    //Tokens del suministro inicial a un usuario
    function transfer(address recipient, uint256 amount) external returns (bool);
    //Si el contrato puede mandar una cantidad de tokens a un usuario
    function approve(address spender, uint256 amount) external returns (bool);
    //Habilita la transferencia de tokens entre usuarios
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    //Evento número 1
    event Transfer(address indexed from, address indexed to, uint256 value);
    //Evento número 2
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
//Implementacion funciones token ERC20
contract ERC20Basic is IERC20 {
    string public constant name = "LPL Token - TDL Fiuba";
    string public constant symbol = "LPL";
    uint public constant decimals = 0; //2;

    using SafeMath for uint256;

    mapping(address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;
    uint256 public totalSupply;
    
    constructor () public { //uint256 initialSupply
        totalSupply = 1000000;// * (uint256(10) ** decimals); // init supply
        balanceOf[msg.sender] = totalSupply;
    }

    // function totalsupply() public view returns (uint256){
    //     return totalSupply;
    // }
    // function increaseTotalSupply(uint newTokensAmount) public {
    //     totalSupply_+=newTokensAmount;
    //     balanceOf[msg.sender]+= newTokensAmount;
    // }
    // function balanceOf(address tokenOwner) public view returns (uint256){
    //     return balanceOf[tokenOwner];
    // }
    // function allowance(address owner, address delegate) public view returns (uint256){
    //     return allowance[owner][delegate];
    // }

    function approve(address _delegate, uint256 _numTokens) public returns (bool){
        allowance[msg.sender][_delegate] = _numTokens;
        emit Approval(msg.sender, _delegate, _numTokens);
        return true;
    }

    function transfer(address _to, uint256 numTokens) public returns (bool){
            require(numTokens <= balanceOf[msg.sender]);
            balanceOf[msg.sender] = balanceOf[msg.sender].sub(numTokens);
            balanceOf[_to] = balanceOf[_to].add(numTokens);
            emit Transfer(msg.sender, _to, numTokens);
            return true;
    }

    function transferFrom(address _from, address _to, uint256 _numTokens) public returns (bool){
            // Chequeo si el _from tiene la cantidad de token solicitados
            require(balanceOf[_from] >= _numTokens);
            // Chequeo si el _from autorizo al que hace la petición(msg.sender) a hacer Tx
            // por el monto solicitado
            require(allowance[_from][msg.sender] >= _numTokens);
            balanceOf[_from] = balanceOf[_from].sub(_numTokens);
            allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_numTokens);
            balanceOf[_to]= balanceOf[_to].add(_numTokens);
            emit Transfer(_from, _to, _numTokens);
            return true;
    }
}