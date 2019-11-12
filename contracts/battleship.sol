pragma solidity >= 0.5.0;

contract battleship {

    enum GameState { Created, SettingUp, Playing, Finished }

    struct Game {
        address payable player1;
        address payable player2;
        string player1Name;
        string player2Name;
        address currentPlayer;
        address payable winner;
        GameState gameState;
        uint pot;
        uint availablePot;
        mapping(address => int8[10][10]) playerGrids;
        mapping(address => bool[4]) playerShips;
    }

    mapping(address => string) public playerNames;
    mapping(bytes32 => bool) public playerNameExists;
    mapping(bytes32 => Game) public games;
    mapping(address => bytes32[]) public playerGames;

    uint8 public maxlen = 5;
    uint8 public minlen = 2;

    int8[10][10] otherPlayerBoard;

    event PlayerSetName(address player, string name);
    event GameInitialized(bytes32 gameId, address player1, bool player1GoesFirst, uint pot);
    event GameJoined(bytes32 gameId, address player2);
    event ShipPlaced(bytes32 gameId, address player, uint8 startX, uint8 endX, uint8 startY, uint8 endY);
    event StateChanged(bytes32 gameId, GameState newState, string newStateString);
    event GameMade(string testing, bytes32 gameId );
    event MadeMove(bytes32 gameId, address currentPlayer, uint8 x, uint8 y);
    event HitBattleShip(bytes32 gameId, address currentPlayer, uint8 x, uint8 y, int8 pieceHit);
    event WonChallenged(bytes32 gameId, address player);
    event GameEnded(bytes32 gameId, address winner);
    
    event WinningsWithdrawn(bytes32 gameId, address player);
    event WithdrawFailed(bytes32 gameId, address player, string reason);

    event IsStateCalled(bytes32 gameId, GameState currentState, GameState comparingState, bool equal);
    event IsPlayerCalled(bytes32 gameId, address player);
    event LogCurrentState(bytes32 gameId, GameState state);

    function stringToBytes32(string memory source) pure public returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    modifier hasName() {
        if(stringToBytes32(playerNames[msg.sender]) != bytes32(0x0)) _;
    }

    modifier isPlayer(bytes32 gameId) {
        emit IsPlayerCalled(gameId,msg.sender);

        if(msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2) _;
    }

    modifier isCurrentPlayer(bytes32 gameId) {
        if(msg.sender == games[gameId].currentPlayer) _;
    }

    modifier isState(bytes32 gameId, GameState state){
        emit IsStateCalled(gameId,state, games[gameId].gameState, state == games[gameId].gameState);
        if(state == games[gameId].gameState) _;
    }

    function abs(int number) internal pure returns(uint unumber) {
        if(number < 0) return uint(-1 * number);
        return uint(number);
    }
    function withdraw(bytes32 gameId) public payable{
        if(games[gameId].gameState != GameState.Finished){
            emit WithdrawFailed(gameId,msg.sender,'This game isnt over yet');
        }
        else
        {
            uint amount = games[gameId].availablePot;
            if(amount > 0){
                if(msg.sender == games[gameId].winner){
                    games[gameId].availablePot = 0;
                    msg.sender.transfer(amount);
                    emit WinningsWithdrawn(gameId, msg.sender);
                }else{
                    emit WithdrawFailed(gameId,msg.sender,'This player hasnt won the game');
                }
            }else{
                emit WithdrawFailed(gameId,msg.sender,'No more funds in the contract for this game');
            }
        }

    }
    function initialiseBoard(bytes32 gameId, address player) isState(gameId, GameState.Created) internal {
        for(uint8 i = 0; i < 10; i++) {
            for(uint8 j = 0; j < 10; j++) {
                games[gameId].playerGrids[player][i][j] = 0;
            }
        }
    }
    
    function findOtherPlayer(bytes32 gameId,address player) public view returns(address) {
        if(player == games[gameId].player1) return games[gameId].player2;
        return games[gameId].player1;
    }

    function setName(string memory name ) public{
        require(bytes(name).length <= 30);
        bytes32 bytesname = stringToBytes32(name);
        require(!playerNameExists[bytesname]);
        playerNames[msg.sender] = name;
        playerNameExists[bytesname] = true;
    }

    function findPot(bytes32 gameId) view public returns(uint){
        return games[gameId].pot;
    }
    function bytes32ToString(bytes32 x) public view returns (string memory) {
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
        byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
        if (char != 0) {
            bytesString[charCount] = char;
            charCount++;
        }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (uint j = 0; j < charCount; j++) {
        bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
    }
    function returngameid() public view returns(bytes32){
        return playerGames[msg.sender][0];
    }
//     function toBytes(address a) public pure returns (bytes memory) {
//     return abi.encodePacked(a);
// }

    function newGame(bool goFirst) public hasName payable returns(bytes32){
        require(msg.value > 0);
        // bytes32 gameId = keccak256(msg.sender, block.number);
        // bytes32 gameId = keccak256(abi.encodePacked(msg.sender, block.number));
        bytes32 gameId = bytes32(uint256(msg.sender) << 96);
        emit GameMade("testing", gameId);
        playerGames[msg.sender].push(gameId);
        games[gameId] = Game(
            msg.sender, // address player1;
            address(0), // address player2;
            playerNames[msg.sender], //     string player1Name;
            "",  // string player2Name;
            address(0), // address currentPlayer;
            address(0), // address winner;
            GameState.Created, // GameState gameState;
            msg.value,    // uint pot;
            msg.value    // uint availablePot;
        );
        if(goFirst){
            games[gameId].currentPlayer = msg.sender;
        }
        initialiseBoard(gameId,msg.sender);
        return gameId;
    }

    function joinGame(bytes32 gameId) public hasName  isState(gameId, GameState.Created) payable {
        require(games[gameId].player2 == address(0));
        require(msg.value == games[gameId].pot);
        games[gameId].player2 = msg.sender;
        games[gameId].player2Name = playerNames[msg.sender];
        playerGames[msg.sender].push(gameId);
        if(games[gameId].currentPlayer == address(0)){
            games[gameId].currentPlayer = msg.sender;
        }
        initialiseBoard(gameId,msg.sender);
        emit GameJoined(gameId,msg.sender);
        games[gameId].gameState = GameState.SettingUp;
        emit StateChanged(gameId,GameState.SettingUp,"SettingUp");
    }
    function showBoard(bytes32 gameId, uint x, uint y) public view returns(int){
        return games[gameId].playerGrids[msg.sender][x][y];
    }
    function showOtherPlayerBoard(bytes32 gameId, uint x, uint y) public isPlayer(gameId) returns(int){
        require(games[gameId].gameState == GameState.Playing || games[gameId].gameState == GameState.Finished);
        address otherPlayer = findOtherPlayer(gameId, msg.sender);
        return  games[gameId].playerGrids[otherPlayer][x][y];
    }

    function placeShip(bytes32 gameId, uint8 startX, uint8 endX, uint8 startY, uint8 endY) public isPlayer(gameId) isState(gameId,GameState.SettingUp) {
        
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
    function finishPlacing(bytes32 gameId) public isPlayer(gameId) isState(gameId,GameState.SettingUp) returns(bool){
        bool ready = true;
        for(uint8 i = 0; i <= maxlen - minlen; i++)
        {
            if(!games[gameId].playerShips[games[gameId].player1][i] || !games[gameId].playerShips[games[gameId].player2][i])
            {
                ready = false;
                break;
            }
        }
        if(ready==true){
            games[gameId].gameState = GameState.Playing;
        }
        return ready;
    }

    function status(bytes32 gameId) public view returns(address){
        return games[gameId].currentPlayer;
    }

    function makeMove(bytes32 gameId, uint8 x, uint8 y) public isState(gameId,GameState.Playing) isCurrentPlayer(gameId) {
        address otherPlayer = findOtherPlayer(gameId, msg.sender);
        require(games[gameId].playerGrids[otherPlayer][x][y] >= 0);
        if(games[gameId].playerGrids[otherPlayer][x][y] >= 1 && games[gameId].playerGrids[otherPlayer][x][y] <= int(maxlen))
        {
            games[gameId].playerGrids[otherPlayer][x][y] = -1 * games[gameId].playerGrids[otherPlayer][x][y];
        }
        else
        {
            games[gameId].playerGrids[otherPlayer][x][y] = 100;
        }

        games[gameId].currentPlayer = otherPlayer;
    }

    function sayWon(bytes32 gameId) isPlayer(gameId) isState(gameId,GameState.Playing) public
    {
        emit WonChallenged(gameId,msg.sender);
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
            games[gameId].gameState = GameState.Finished;
            emit StateChanged(gameId,GameState.Finished,"Finished");
            games[gameId].winner = msg.sender;
            emit GameEnded(gameId,msg.sender);
        }    
    }



    // function () public {
    //     revert("accidental sending"); // Prevents accidental sending of ether
    // }

}
