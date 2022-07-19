pragma solidity >=0.5.16;

pragma experimental ABIEncoderV2;

contract Lottery {
    // ATRIBUTES -----------------------------------------------
    uint256 constant NUMBERS_PER_BOARD = 21;
    uint256 constant NUMBERS_PER_LINE = 7;
    uint256 constant NUMBERS_PER_COL = NUMBERS_PER_BOARD/NUMBERS_PER_LINE;

    // Used in module random numbers
    uint256 constant RAND_INIT_BINGO = 100;

    struct Participant {
        string name;
        uint256[NUMBERS_PER_BOARD] board;
        uint256[NUMBERS_PER_BOARD] hits;
        uint256 amountHits;
    }
    Participant player;
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
    function rand(uint256 _n, uint256 _range) private view returns (uint256) {
        return
            uint256(
                keccak256(
                    //abi.encode(block.timestamp + n, msg.sender, lastNumber)
                    abi.encode(block.timestamp + _n, block.difficulty, player.amountHits)
                )
            ) % _range;
    }

    function randInRange10(uint256 _n, uint256 _initRange) private view returns (uint256) {
        uint256 randRange = uint256(rand(_n, 10));
        return _initRange + randRange;
    }

    // GAME LOGIC ----------------------------------------------
    function amountHits() public view returns (uint256) {
        return player.amountHits;
    }

    function checkWinner() public view returns (bool) {
        return player.amountHits == NUMBERS_PER_BOARD;
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

        if (bytes(player.name).length == 0) {
            uint256 idx = 0;
            for (uint256 i = 0; i < NUMBERS_PER_LINE; i++) {
                //cleanIdx = rand((i+1) % 3, 3);
                for (uint256 j = 0; j < NUMBERS_PER_COL; j++) {
                        rands[idx] = randInRange10(
                            (bytes(_name).length + idx) % RAND_INIT_BINGO,
                            (i + 1)*10);
                    
                    acs[idx] = 0;
                    idx++;
                }
            }

            player.board = sortArrayAndSetBlank(rands);
            player.name = _name;
            player.hits = acs;
            player.amountHits = 0;
        }
    }

    function getBoard()
        public
        view
        returns (uint256[NUMBERS_PER_BOARD] memory)
    {
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

    function sortArrayAndSetBlank(uint256[NUMBERS_PER_BOARD] memory arr)
        private view
        returns (uint256[NUMBERS_PER_BOARD] memory)
    {
        // Ordenamos los números generados
        uint256 l = arr.length;
        for (uint256 i = 0; i < l; i++) {
            for (uint256 j = i + 1; j < l; j++) {
                if (arr[i] > arr[j]) {
                    uint256 temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }

        // Seteamos casilleros aleatorios en 0 para armar el carton
        uint256 cleanIdx;
        for(uint256 i = 0; i <= 18; i = i+3){
                cleanIdx = rand((i+1), 3);
                arr[cleanIdx + i] = 0;
        }
        return arr;
    }
}
