pragma solidity >= 0.5.0;

contract battleship {
    address payable public p1;
    address payable public p2; 
    address payable public winner;
    mapping(address => int8[10][10]) public playerGrids;
    mapping (address => bool[4])public  playerShips;
    mapping (address => string) public pnames;
    
    uint8 public maxlen = 5;
    uint8 public minlen = 2;

    // struct Game {
    //     address payable public player1;
    //     address payable public player2;
    //     string public player1Name;
    //     string public player2Name;
    //     address public currentPlayer;
    //     address public payable winner;
    //     GameState public gameState;
    //     uint pot;
    //     uint availablePot;
    //     mapping(address => int8[10][10]) public playerGrids;
    //     mapping(address => bool[4]) public playerShips;
    // }

    // mapping(address => string) public playerNames;
    // mapping(bytes32 => bool) public playerNameExists;
    // mapping(int => Game) public games;
    // // mapping(address => bytes32[]) public playerGames;
    // mapping(address => int) public playerGames;


    function initialiseBoard(address player) public{
        for(uint8 i = 0; i < 10; i++) {
            for(uint8 j = 0; j < 10; j++) {
                playerGrids[player][i][j] = 0;
            }
        }
    }
    function findOtherPlayer(address player) public returns(address) {
        if(player == p1) return p2;
        return p1;
    }
    function setName(string memory name ) public{
        require(bytes(name).length <= 30);
        pnames[msg.sender] = name;
    }
    function newGame(bool goFirst) public payable{
        p1 = msg.sender;
        p2 = address(0);
        winner = address(0);
        initialiseBoard(msg.sender);
    }
    function joinGame(string memory gaeId) public payable {
        p2 = msg.sender;
        initialiseBoard(msg.sender);
    }
    function abs(int number) internal pure returns(uint unumber) {
        if(number < 0) return uint(-1 * number);
        return uint(number);
    }
    function placeShip(uint8 startX, uint8 endX, uint8 startY, uint8 endY) public{
        require(startX == endX || startY == endY, 'placement error');
        require(startX < endX || startY < endY, "placement error0");
        require(startX  < 10 && startX  >= 0 &&
                endX    < 10 && endX    >= 0 &&
                startY  < 10 && startY  >= 0 &&
                endY    < 10 && endY    >= 0, 'placement error2');
        for(uint8 x = startX; x <= endX; x++)
        {
            for(uint8 y = startY; y <= endY; y++)
            {
                require(playerGrids[msg.sender][x][y] == 0, 'placement error3');
            }
        }
        uint8 boatLength = 1;
        if(startX == endX)
        {
            boatLength += uint8(abs(int(startY)-int(endY)));
        }
        else if(startY == endY)
        {
            boatLength += uint8(abs(int(startX)-int(endX)));
        }

        require(boatLength <= maxlen && boatLength >= minlen, 'length error');
        require(!(playerShips[msg.sender][boatLength-minlen]), "ship already placed");

        playerShips[msg.sender][boatLength - minlen] = true;

        for(uint8 x = startX; x <= endX; x++)
        {
            for( uint8 y = startY; y <= endY; y++)
            {
                playerGrids[msg.sender][x][y] = int8(boatLength);
            }
        }
    }
    function makeMove(uint8 x, uint8 y) public {
        address otherPlayer = findOtherPlayer(msg.sender);
        require(playerGrids[otherPlayer][x][y] >= 0);
        if(playerGrids[otherPlayer][x][y] >= 1 && playerGrids[otherPlayer][x][y] <= int(maxlen))
        {
            playerGrids[otherPlayer][x][y] = -1 * playerGrids[otherPlayer][x][y];
        }
        else
        {
            playerGrids[otherPlayer][x][y] = 100;
        }
    }
    function sayWon() public returns(bool){
        address otherPlayer = findOtherPlayer(msg.sender);
        uint8 requiredToWin = 0;
        for(uint8 i = minlen; i <= maxlen; i++){
            requiredToWin += i;
        }
        int8[10][10] memory otherPlayerGrid = playerGrids[otherPlayer];
        uint8 numberHit = 0;
        for(uint i = 0;  i < 10; i++) {
            for(uint j = 0;  j < 10; j++) {
                if(otherPlayerGrid[i][j] < 0){
                    numberHit += 1;
                }
            }
        }
        if(numberHit >= requiredToWin){
            return true;
        }
        return false;
    }


}