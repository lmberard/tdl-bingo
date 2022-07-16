pragma solidity >=0.5.16;

pragma experimental ABIEncoderV2;

contract Lottery {
    // ATRIBUTES -----------------------------------------------
    string name;
    address private owner;
    address private winner;
    int256 private lastNumber;

    // CONSTRUCTORS - GETTERS - SETTERS ------------------------
    constructor() public payable {
        owner = msg.sender;
        lastNumber = -1;
    }

    function getLastNumber() public view returns (int256) {
        return lastNumber;
    }

    function setName(string memory _name) public {
        name = _name;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    // FUNCION NUEVA -------------------------------------------
    function rand(uint256 n, uint256 range) private view returns (uint256) {
        return
            uint256(
                keccak256(abi.encode(block.timestamp + n, owner, lastNumber))
            ) % range;
    }

    function generateRandom(uint256 _n, uint256 _range)
        public
        view
        returns (uint256)
    {
        return uint256(rand(_n, _range));
    }
}
