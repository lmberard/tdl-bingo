pragma solidity >=0.5.16;

pragma experimental ABIEncoderV2;

contract Lottery {
    // ATRIBUTES -----------------------------------------------
    uint256 constant NUMBERS_PER_BOARD = 21;
    struct Participant {
        string name;
        uint256[NUMBERS_PER_BOARD] card;
        uint256[NUMBERS_PER_BOARD] hits;
        uint256 amountHits;
    }
    Participant[] private participants;
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

    function checkHit(uint256 _num) public view returns (bool) {
        return lastNumber == int256(_num);
    }

    // TODO move to Library
    function rand(uint256 n, uint256 range) private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encode(block.timestamp + n, msg.sender, lastNumber)
                )
            ) % range;
    }

    // GAME LOGIC ----------------------------------------------
    function checkWinnder() private view returns (bool) {
        for (uint256 i; i < participants.length; i++) {
            if (participants[i].amountHits == NUMBERS_PER_BOARD) {
                return true;
            }
        }
        return false;
    }

    function addHit(int256 _outNumber) private {
        for (uint256 i = 0; i < participants.length; i++) {
            Participant memory part = participants[i];
            for (uint256 j = 0; j < part.card.length; j++) {
                if (part.card[j] == uint256(_outNumber)) {
                    participants[i].amountHits++;
                    break;
                }
            }
        }
    }

    function wasHit() public view returns (bool) {
        uint256 lastHit = uint256(seeLastNumber());

        for (uint256 i = 0; i < participants.length; i++) {
            Participant memory part = participants[i];
            for (uint256 j = 0; j < part.card.length; j++) {
                if (part.card[j] == lastHit) {
                    return true;
                }
            }
        }
        return false;
    }

    function increaseRound() public {
        roundNumber++;
    }

    function competitor(string memory _name) public {
        uint256[NUMBERS_PER_BOARD] memory rands;
        uint256[NUMBERS_PER_BOARD] memory acs;
        uint256 rangeRand = 10;

        for (uint256 i = 0; i < NUMBERS_PER_BOARD; i++) {
            rands[i] = rand((bytes(_name).length + i) % rangeRand, rangeRand);
            acs[i] = 0;
        }

        Participant memory part = Participant(_name, rands, acs, 0);
        participants.push(part);
    }

    function showBoard(uint256 _id)
        public
        view
        returns (uint256[NUMBERS_PER_BOARD] memory)
    {
        if (_id <= participants.length - 1) {
            Participant memory part = participants[_id];
            return part.card;
        }
        //return [uint256(0), 0];
        return [uint256(0),0,0,0,0,0,0,
                        0, 0,0,0,0,0,0,
                        0, 0,0,0,0,0,0];
    }

    function generateRandom(uint256 _n, uint256 _range)
        public
        view
        returns (uint256)
    {
        return uint256(rand(_n, _range));
    }

    function makeMove(uint256 _n, uint256 _range) public returns (bool) {
        lastNumber = int256(rand(_n, _range));

        increaseRound();

        addHit(lastNumber);

        return checkWinnder();
    }
}
