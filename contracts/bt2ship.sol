pragma solidity >= 0.5.0;

contract battleship {
    uint8 public maxlen = 5;
    uint8 public minlen = 2;

    struct Game {
        address payable  p1;
        address payable  p2;
        string  p1_name;
        string  p2_name;
        address  currentPlayer;
        address  payable winner;
        uint pot;
        uint availablePot;
        mapping(address => int8[10][10])  playerGrids;
        mapping(address => bool[4])  playerShips;
    }

    mapping(address => string) public playerNames;
    mapping(bytes32 => bool) public playerNameExists;
    mapping(uint => Game) public games;
    mapping(address => uint[]) public playerGames;

    function initialiseBoard(uint gameId, address player) public{
        for(uint8 i = 0; i < 10; i++) {
            for(uint8 j = 0; j < 10; j++) {
                games[gameId].playerGrids[player][i][j] = 0;
            }
        }
    }
    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    function findOtherPlayer(uint gameId,address player) public view returns(address) {
        if(player == games[gameId].p1) return games[gameId].p2;
        return games[gameId].p1;
    }
    function setName(string memory name ) public{
        require(bytes(name).length <= 30, "length too much");
        bytes32 bytesname = stringToBytes32(name);
        require(!playerNameExists[bytesname], "name already exist");
        playerNames[msg.sender] = name;
        playerNameExists[bytesname] = true;
    }
    function newGame(bool goFirst) public payable{
        // require(msg.value > 0);
        uint gameId = uint(keccak256(abi.encodePacked(msg.sender, block.number)))%256;
        // address gameId = msg.sender;
        playerGames[msg.sender].push(gameId);
        games[gameId] = Game(
            msg.sender, // address player1;
            address(0), // address player2;
            playerNames[msg.sender], //     string p1_name;
            "",  // string p2_name;
            address(0), // address currentPlayer;
            address(0), // address winner;
            msg.value,    // uint pot;
            msg.value    // uint availablePot;
        );
        if(goFirst){
            games[gameId].currentPlayer = msg.sender;
        }
        initialiseBoard(gameId,msg.sender);
    }
    function retid() public view returns(uint){
        uint ln = playerGames[msg.sender].length;
        return playerGames[msg.sender][ln-1];
    }
    function joinGame(uint gameId) public payable {
        games[gameId].p2 = msg.sender;
        games[gameId].p2_name = playerNames[msg.sender];
        playerGames[msg.sender].push(gameId);
        if(games[gameId].currentPlayer == address(0)){
            games[gameId].currentPlayer = msg.sender;
        }
        initialiseBoard(gameId,msg.sender);
    }
    function abs(int number) internal pure returns(uint unumber) {
        if(number < 0) return uint(-1 * number);
        return uint(number);
    }
     function placeShip(uint gameId, uint8 startX, uint8 endX, uint8 startY, uint8 endY) public {
        require(startX == endX || startY == endY, 'placement error');
        require(startX < endX || startY < endY, "placement error0");
        require(startX < 10 && startX >= 0 &&
                endX < 10 && endX >= 0 &&
                startY < 10 && startY >= 0 &&
                endY < 10 && endY >= 0, 'placement error2');
        for(uint8 x = startX; x <= endX; x++)
        {
            for(uint8 y = startY; y <= endY; y++)
            {
                require(games[gameId].playerGrids[msg.sender][x][y] == 0, 'placement error3');
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
        require(!(games[gameId].playerShips[msg.sender][boatLength-minlen]), "ship already placed");

        games[gameId].playerShips[msg.sender][boatLength - minlen] = true;

        for(uint8 x = startX; x <= endX; x++)
        {
            for( uint8 y = startY; y <= endY; y++)
            {
                games[gameId].playerGrids[msg.sender][x][y] = int8(boatLength);
            }
        }
    }
    function makeMove(uint gameId, uint8 x, uint8 y) public{
        address otherPlayer = findOtherPlayer(gameId, msg.sender);
        require(games[gameId].playerGrids[otherPlayer][x][y] >= 0, "should be available");
        if(games[gameId].playerGrids[otherPlayer][x][y] >= 1 && games[gameId].playerGrids[otherPlayer][x][y] <= int(maxlen))
        {
            games[gameId].playerGrids[otherPlayer][x][y] = -1 * games[gameId].playerGrids[otherPlayer][x][y];
        }
        else
        {
            games[gameId].playerGrids[otherPlayer][x][y] = 100;
        }
        games[gameId].currentPlayer = otherPlayer;
        uint8 requiredToWin = 0;
        for(uint8 i = minlen; i <= maxlen; i++){
            requiredToWin += i;
        }
        int8[10][10] memory otherPlayerGrid = games[gameId].playerGrids[otherPlayer];
        uint8 numberHit = 0;
        for(uint i = 0;  i < 10; i++) {
            for(uint j = 0;  j < 10; j++) {
                if(otherPlayerGrid[i][j] < 0){
                    numberHit += 1;
                }
            }
        }
        if(numberHit >= requiredToWin){
            games[gameId].winner = msg.sender;
            games[gameId].currentPlayer = address(0);
        }
    }
    function winner(uint gameId) public view returns(address){
        return games[gameId].winner;
    }
    function sayWon(uint gameId) public{
        address otherPlayer = findOtherPlayer(gameId,msg.sender);
        uint8 requiredToWin = 0;
        for(uint8 i = minlen; i <= maxlen; i++){
            requiredToWin += i;
        }
        int8[10][10] memory otherPlayerGrid = games[gameId].playerGrids[otherPlayer];
        uint8 numberHit = 0;
        for(uint i = 0;  i < 10; i++) {
            for(uint j = 0;  j < 10; j++) {
                if(otherPlayerGrid[i][j] < 0){
                    numberHit += 1;
                }
            }
        }
        if(numberHit >= requiredToWin){
            games[gameId].winner = msg.sender;
        }

    }
    function finishPlacing(uint gameId) public returns(bool){
        bool ready = true;
        for(uint8 i = 0; i <= maxlen - minlen; i++)
        {
            if(!games[gameId].playerShips[games[gameId].p1][i] || !games[gameId].playerShips[games[gameId].p2][i])
            {
                ready = false;
                break;
            }
        }
        if(ready==true){
            games[gameId].currentPlayer = games[gameId].p1;
        }
        return ready;
    }

    function status(uint gameId) public view returns(address){
        return games[gameId].currentPlayer;
    }

}