pragma solidity >=0.5.0;

contract EIP20 {

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    
    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    
    string public name;
    uint8 public decimals;
    string public symbol;
    
    uint256 public totalSupply;

    constructor() public {
        balances[msg.sender] = 1000000;//_initialAmount;
        totalSupply = 1000000;//_initialAmount;
        name = "LPL Token - TDL Fiuba";//_tokenName;
        decimals = 2;//_decimalUnits;
        symbol = "LPL";//_tokenSymbol;
    }
    
    /* Para hacer transerencias de la cuenta owner hacia otra */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    /* Para transferir fondos de una cuenta aprobada a otra */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value);
        return true;
    }

    /* Balance de una cuenta */
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    /* Para dar permiso a otras cuentas a transferir los tokens */
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /* Getter de allowed */
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}