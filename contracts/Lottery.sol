pragma solidity >=0.5.16;

pragma experimental ABIEncoderV2;

contract Lottery {
    // ATRIBUTES -----------------------------------------------
    uint256 constant NUMBERS_PER_BOARD = 21;// 21;
    uint256 constant RAND_INIT_BINGO = 10;
    struct Participant {
        string name;
        uint256[NUMBERS_PER_BOARD] board;
        uint256[NUMBERS_PER_BOARD] hits;
        uint256 amountHits;
    }
    Participant player;
    address private owner; //esta es la wallet del jugador
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
    function collectMoney(uint256 collectedMoney) public view returns (address){
        return owner;
    }


    function amountHits() public view returns(uint256) {
        return player.amountHits;
    }

    function checkWinner() public view returns (bool) {
        return player.amountHits == NUMBERS_PER_BOARD;
        // if (player.amountHits == NUMBERS_PER_BOARD)
        //     return true;
        // return false;
    }

    function addHit(int256 _outNumber) private {
        for (uint256 j = 0; j < player.board.length; j++) {
            if (player.board[j] == uint256(_outNumber)) {
                player.amountHits++;
                break;
            }
        }    
    }

    function wasHit() public view returns (bool) {
        uint256 lastHit = uint256(seeLastNumber());
        for (uint256 j = 0; j < player.board.length; j++) {
            if (player.board[j] == lastHit) {
                return true;
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
        uint256 rangeRand = RAND_INIT_BINGO;

        if(bytes(player.name).length == 0){
            for (uint256 i = 0; i < NUMBERS_PER_BOARD; i++) {
                rands[i] = rand((bytes(_name).length + i) % rangeRand, rangeRand);
                acs[i] = 0;
            }
            player.name = _name;
            player.board = sort_array(rands);
            player.hits = acs;
            player.amountHits = 0;
        }
    }


    function getBoard() public view returns (uint256[NUMBERS_PER_BOARD] memory){
        return player.board;
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

        return checkWinner();
    }

    function sort_array(uint[NUMBERS_PER_BOARD] memory arr) private pure returns (uint[NUMBERS_PER_BOARD] memory) {
        uint l = arr.length;
        for(uint i = 0; i < l; i++) {
            for(uint j = i+1; j < l ;j++) {
                if(arr[i] > arr[j]) {
                    uint temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }
}
