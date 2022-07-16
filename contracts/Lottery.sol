pragma solidity >=0.5.16;

pragma experimental ABIEncoderV2;

contract Lottery {
    // ATRIBUTES -----------------------------------------------
    uint256 constant NUMBERS_PER_CARD = 2;
    struct Participant {
        string name;
        uint256[NUMBERS_PER_CARD] card;
        uint256[NUMBERS_PER_CARD] hits;
        uint256 amountHits;
    }
    address private owner;
    address private winner;
    uint256 private roundNumber;
    int256 private lastNumber;
    bool private activeGame;

    // CONSTRUCTORS - GETTERS - SETTERS ------------------------
    constructor() public payable {
        owner = msg.sender;
        roundNumber = 0;
        lastNumber = -1;
        activeGame = true;
    }

    function seeLastNumber() public view returns (int256) {
        return lastNumber;
    }

    // FUNCION NUEVA -------------------------------------------
    function rand(uint256 n, uint256 range) private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encode(block.timestamp + n, msg.sender, lastNumber)
                )
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
