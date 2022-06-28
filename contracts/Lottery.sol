// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

contract Lottery {
    uint256 constant NUMBERS_PER_CARD = 2;

    struct Participant {
        string name;
        uint256[NUMBERS_PER_CARD] card;
        uint256[NUMBERS_PER_CARD] hits;
        uint256 amountHits;
    }
    Participant[] private participants;

    address private owner;
    address private winner;
    uint256 private roundNumber;
    int256 private lastNumber;

    bool private activeGame;

    //uint256 private premio;

    //payable
    //constructor(uint256 _numerowinnder, uint256 _premio) payable {
    constructor() payable {
        owner = msg.sender;
        roundNumber = 0;
        lastNumber = -1;
        activeGame = true; //para activar o desactivar el juego
    }

    function checkHit(uint256 _num) public view returns (bool) {
        return lastNumber == int256(_num);
    }

    //"Random function" realmente es seudorandom(?)
    //private porque es una funcion que solo puede ser accedida dentro del contrato
    function rand(uint256 n) private view returns (uint256) {
        //primero se castea a uint256
        //keccak256 es un algoritmo de hash (criptografia unidireccional)
        //now es el tiempo de minado, msg sender es la direccion de la persona que lo ejecuta
        // los algoritmos de hash siempre son diferentes por eso se genera un numero pseudo aleatorio.
        // esto genera un valor entero y luego lo castea a uint256
        return
            uint256(
                keccak256(
                    abi.encode(block.timestamp + n, msg.sender, lastNumber)
                )
            ) % 10;
    }

    function seeLastNumber() public view returns (int256) {
        return lastNumber;
    }

    function checkWinnder() private view returns (bool) {
        for (uint256 i; i < participants.length; i++) {
            if (participants[i].amountHits == NUMBERS_PER_CARD) {
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

    function increaseRound() public {
        roundNumber++;
    }

    function participate(string memory _name) public {
        uint256[NUMBERS_PER_CARD] memory rands;
        uint256[NUMBERS_PER_CARD] memory acs;
        for (uint256 i = 0; i < NUMBERS_PER_CARD; i++) {
            rands[i] = rand(bytes(_name).length + i);
            acs[i] = 0;
        }

        Participant memory part = Participant(_name, rands, acs, 0);
        participants.push(part);
    }

    function seeCard(uint256 _id) public view returns (Participant memory) {
        return participants[_id];
    }

    function generateRandom(uint256 _n) public view returns (uint256) {
        return rand(_n);
    }

    function makeMove() public returns (bool) {
        lastNumber = int256(rand(1));

        increaseRound();

        addHit(lastNumber);

        return checkWinnder();
    }
}
