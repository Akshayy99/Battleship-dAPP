const Battleship = artifacts.require("battleship");


function printBoard(board) {
  var boardTranspose = board[0].map((col, i) => {
    return board.map((row) => {
      return row[i];
    })
  });
  let printedBoard = boardTranspose.reduce((c, row) => {
    return c + (row.map((col) => {
      let ele = col.toString();
      if(ele.length==1) ele = ' ' + ele;
      return ele;
    }) + '\n');
  }, '');
  return printedBoard;
}

contract('battleship', async (accounts) => {

  let battleship, transactionData, gameId;

  it("should be able to set the players names", async () => {
    battleship = await Battleship.deployed();
    transactionData = await battleship.setName("Pragun",{from: accounts[0]});
    transactionData = await battleship.setName("Akshay",{from: accounts[1]});
    let name1 = await battleship.playerNames.call(accounts[0]);
    assert.equal(name1,"Pragun",'The player1 name wasn\'t set correctly');
    let name2 = await battleship.playerNames.call(accounts[1]);
    assert.equal(name2,"Akshay",'The player2 name wasn\'t set correctly');
  });

  it("should get an error if try to set the same name twice for different players", async () => {
    battleship = await Battleship.deployed();
    try{
      transactionData = await battleship.setName("Tom",{from: accounts[2]});
    }catch(e){
      let name1 = await battleship.playerNames.call(accounts[2]);
      assert.equal(name1,"",'The player name was set incorrectly');
    }
  });

  it('should be able to create a new game', async () => {
    transactionData = await battleship.newGame(true,{from: accounts[0], value: 10});
    // console.log(transactionData)
    // console.log(transactionData.logs[transactionData.logs.length - 1].args)
    gameId = transactionData.logs[transactionData.logs.length - 1].args.gameId;
    let gameData = await battleship.games.call(gameId);
    assert.equal(gameData[0],accounts[0],'The player1 wasn\'t set correctly')
    assert.equal(gameData[1],'0x0000000000000000000000000000000000000000','Player2 was defined');
    assert.equal(gameData[6],0,'The game is not in the correct state');
  });

  it('the players shouldn\'t be able to join game if value is wrong', async () => {
    try{
      transactionData = await battleship.joinGame(gameId,{from: accounts[1], value: 20});
    }catch(e){
      // console.error(e);
    }
    let gameData = await battleship.games.call(gameId);
    assert.equal(gameData[0],accounts[0],'The player1 wasn\'t set correctly')
    assert.equal(gameData[1],'0x0000000000000000000000000000000000000000','Player2 was defined');
  });

  it('the players should be able to join game if value is right', async () => {
    transactionData = await battleship.joinGame(gameId,{from: accounts[1], value: 10});
    let gameData = await battleship.games.call(gameId);
    assert.equal(gameData[0],accounts[0],'The player1 wasn\'t set correctly')
    assert.equal(gameData[1],accounts[1],'The player2 wasn\'t set correctly');
    assert.equal(gameData[6],1,'The game is not in the correct state');
  });

  it('the players should be able to see their board', async () => {
    var bd = new Array(10);
    for(var i =0 ; i < 10 ; i++){
        bd[i] = new Array(10);
    }
    for(var i  =0 ; i < 10 ; i++){
        for(var j = 0; j < 10 ; j++){
            bd[i][j] = await battleship.showBoard.call(gameId, i, j,{from: accounts[0]})
            bd[i][j] = bd[i][j].toNumber()
        }
    }
    let allZero = bd.reduce((c,row) => c && row.reduce((c,ele) => c && ele == 0, true), true);
    assert.equal(bd.length == 10 && bd[0].length == 10,true,'The board has the wrong dimensions');
    assert.equal(allZero,true,'The elements are not all initialized to zero');
  });

  it('the players should be able to place their pieces', async () => {
    await battleship.placeShip(gameId,0,1,0,0,{from: accounts[0]});
    var bd = new Array(10);
    for(var i =0 ; i < 10 ; i++){
        bd[i] = new Array(10);
    }
    for(var i  =0 ; i < 10 ; i++){
        for(var j = 0; j < 10 ; j++){
            bd[i][j] = await battleship.showBoard.call(gameId, i, j,{from: accounts[0]})
            bd[i][j] = bd[i][j].toNumber()
        }
    }
    assert.equal(bd[0][0],2,'Piece not placed right');
    assert.equal(bd[1][0],2,'Piece not placed right');
    assert.equal(bd[2][0],0,'Piece not placed right');
  });

  it('the players should be able start game onces all pieces put down', async () => {
    await battleship.placeShip(gameId, 0, 2, 1, 1, {from: accounts[0]});
    await battleship.placeShip(gameId, 0, 3, 2, 2, {from: accounts[0]});
    await battleship.placeShip(gameId, 0, 4, 3, 3, {from: accounts[0]});
    await battleship.placeShip(gameId, 0, 1, 0, 0, {from: accounts[1]});
    await battleship.placeShip(gameId, 0, 2, 1, 1, {from: accounts[1]});
    await battleship.placeShip(gameId, 0, 3, 2, 2, {from: accounts[1]});
    await battleship.placeShip(gameId, 0, 4, 3, 3, {from: accounts[1]});

    var bd1 = new Array(10);
    for(var i =0 ; i < 10 ; i++){
        bd1[i] = new Array(10);
    }
    for(var i  =0 ; i < 10 ; i++){
        for(var j = 0; j < 10 ; j++){
            bd1[i][j] = await battleship.showBoard.call(gameId, i, j,{from: accounts[0]})
            bd1[i][j] = bd1[i][j].toNumber()
        }
    }
    var bd2 = new Array(10);
    for(var i =0 ; i < 10 ; i++){
        bd2[i] = new Array(10);
    }
    for(var i  =0 ; i < 10 ; i++){
        for(var j = 0; j < 10 ; j++){
            bd2[i][j] = await battleship.showBoard.call(gameId, i, j,{from: accounts[1]})
            bd2[i][j] = bd2[i][j].toNumber()
        }
    }
    await battleship.finishPlacing(gameId);

    let gameData = await battleship.games.call(gameId);
    assert.equal(gameData[6],2,'Game not able to start even though pieces are down');

  });

  it('the players shouldn\'t be able to make a move if it\'s not their turn', async () => {

    try{
      await battleship.makeMove(gameId, 0, 0, {from: accounts[1]});
    }catch(e){

    }
    var bd1 = new Array(10);
    for(var i =0 ; i < 10 ; i++){
        bd1[i] = new Array(10);
    }
    for(var i  =0 ; i < 10 ; i++){
        for(var j = 0; j < 10 ; j++){
            bd1[i][j] = await battleship.showBoard.call(gameId, i, j,{from: accounts[0]})
            bd1[i][j] = bd1[i][j].toNumber()
        }
    }

    assert.equal(bd1[0][0],2,'Shouldn\'t have been able to make that move');
    
  });


  it('the player should be able to say they won at any time', async () => {
    transactionData = await battleship.sayWon(gameId,{from: accounts[0]});
    let numLogs = transactionData.logs.length;
    assert.equal(transactionData.logs[numLogs-1].event,'WonChallenged','The event had the wrong name');
    assert.equal(transactionData.logs[numLogs-1].args.player,accounts[0],'The wrong player was assigned to event');
  });

  it('neither player should be able to withdraw funds', async () => {
    transactionData = await battleship.withdraw(gameId,{from: accounts[0]});
    let numLogs = transactionData.logs.length;
    assert.equal(transactionData.logs[numLogs-1].event,'WithdrawFailed','The event had the wrong name');
    assert.equal(transactionData.logs[numLogs-1].args.player,accounts[0],'The wrong player was assigned to event');
    assert.equal(transactionData.logs[numLogs-1].args.reason,'This game isnt over yet','Wrong reason for withdraw failure');

    transactionData = await battleship.withdraw(gameId,{from: accounts[1]});
    numLogs = transactionData.logs.length;
    assert.equal(transactionData.logs[numLogs-1].event,'WithdrawFailed','The event had the wrong name');
    assert.equal(transactionData.logs[numLogs-1].args.player,accounts[1],'The wrong player was assigned to event');
    assert.equal(transactionData.logs[numLogs-1].args.reason,'This game isnt over yet','Wrong reason for withdraw failure');
  });

  it('the player should be able to win the game', async () => {
    // Making moves
    transactionData = await battleship.makeMove(gameId,0,0,{from: accounts[0]});
    await battleship.makeMove(gameId, 0, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 1, 0, {from: accounts[0]});
    await battleship.makeMove(gameId, 1, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 0, 1, {from: accounts[0]});
    await battleship.makeMove(gameId, 2, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 1, 1, {from: accounts[0]});
    await battleship.makeMove(gameId, 9, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 8, 8, {from: accounts[0]});
    await battleship.makeMove(gameId, 3, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 2, 1, {from: accounts[0]});
    await battleship.makeMove(gameId, 4, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 0, 2, {from: accounts[0]});
    await battleship.makeMove(gameId, 5, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 1, 2, {from: accounts[0]});
    await battleship.makeMove(gameId, 6, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 2, 2, {from: accounts[0]});
    await battleship.makeMove(gameId, 7, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 3, 2, {from: accounts[0]});
    await battleship.makeMove(gameId, 8, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 0, 3, {from: accounts[0]});
    await battleship.makeMove(gameId, 9, 0, {from: accounts[1]});
    await battleship.makeMove(gameId, 1, 3, {from: accounts[0]});
    await battleship.makeMove(gameId, 0, 1, {from: accounts[1]});
    await battleship.makeMove(gameId, 2, 3, {from: accounts[0]});
    await battleship.makeMove(gameId, 0, 2, {from: accounts[1]});
    await battleship.makeMove(gameId, 3, 3, {from: accounts[0]});
    await battleship.makeMove(gameId, 0, 3, {from: accounts[1]});
    await battleship.makeMove(gameId, 4, 3, {from: accounts[0]});

 
    var bd1 = new Array(10);
    for(var i =0 ; i < 10 ; i++){
        bd1[i] = new Array(10);
    }
    for(var i  =0 ; i < 10 ; i++){
        for(var j = 0; j < 10 ; j++){
            bd1[i][j] = await battleship.showBoard.call(gameId, i, j,{from: accounts[0]})
            bd1[i][j] = bd1[i][j].toNumber()
        }
    }

   
    var bd2 = new Array(10);
    for(var i =0 ; i < 10 ; i++){
        bd2[i] = new Array(10);
    }
    for(var i  =0 ; i < 10 ; i++){
        for(var j = 0; j < 10 ; j++){
            bd2[i][j] = await battleship.showBoard.call(gameId, i, j,{from: accounts[1]})
            bd2[i][j] = bd2[i][j].toNumber()
        }
    }
    // let board1from2 = await battleship.showOtherPlayerBoard(gameId, {from: accounts[1]});

    transactionData = await battleship.sayWon(gameId, {from: accounts[0]});

    let numLogs = transactionData.logs.length;


    assert.equal(transactionData.logs[numLogs-1].event, 'GameEnded', 'The event had the wrong name');
    assert.equal(transactionData.logs[numLogs-1].args.winner, accounts[0], 'The wrong player was assigned to event');
  });

  it('the winner should be able to withdraw funds', async () => {
    transactionData = await battleship.withdraw(gameId,{from: accounts[1]});
    let numLogs = transactionData.logs.length;

    assert.equal(transactionData.logs[numLogs-1].event, 'WithdrawFailed', 'The event had the wrong name');
    assert.equal(transactionData.logs[numLogs-1].args.player, accounts[1], 'The wrong player was assigned to event');
    assert.equal(transactionData.logs[numLogs-1].args.reason, 'This player hasnt won the game', 'Wrong reason for withdraw failure');

    transactionData = await battleship.withdraw(gameId, {from: accounts[0]});
    numLogs = transactionData.logs.length;
    assert.equal(transactionData.logs[numLogs-1].event, 'WinningsWithdrawn', 'The event had the wrong name');
    assert.equal(transactionData.logs[numLogs-1].args.player, accounts[0], 'The wrong player was assigned to event');
    
    transactionData = await battleship.withdraw(gameId, {from: accounts[0]});
    numLogs = transactionData.logs.length;
    assert.equal(transactionData.logs[numLogs-1].event, 'WithdrawFailed', 'The event had the wrong name');
    assert.equal(transactionData.logs[numLogs-1].args.player, accounts[0], 'The wrong player was assigned to event');
    assert.equal(transactionData.logs[numLogs-1].args.reason, 'No more funds in the contract for this game', 'Wrong reason for withdraw failure');

  });


});