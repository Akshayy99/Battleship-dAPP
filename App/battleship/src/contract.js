import web3 from './web3'

const deployeAddress = '0xb8B4894EdE8fD9416a92a0a19c2F1c0AE030543E';

const deployedAbi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "playerNames",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "minlen",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "maxlen",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "playerNameExists",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "games",
      "outputs": [
        {
          "name": "player1",
          "type": "address"
        },
        {
          "name": "player2",
          "type": "address"
        },
        {
          "name": "player1Name",
          "type": "string"
        },
        {
          "name": "player2Name",
          "type": "string"
        },
        {
          "name": "currentPlayer",
          "type": "address"
        },
        {
          "name": "winner",
          "type": "address"
        },
        {
          "name": "gameState",
          "type": "uint8"
        },
        {
          "name": "pot",
          "type": "uint256"
        },
        {
          "name": "availablePot",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "name",
          "type": "string"
        }
      ],
      "name": "PlayerSetName",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "player1",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "player1GoesFirst",
          "type": "bool"
        },
        {
          "indexed": false,
          "name": "pot",
          "type": "uint256"
        }
      ],
      "name": "GameInitialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "player2",
          "type": "address"
        }
      ],
      "name": "GameJoined",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "startX",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "endX",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "startY",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "endY",
          "type": "uint8"
        }
      ],
      "name": "ShipPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "newState",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "newStateString",
          "type": "string"
        }
      ],
      "name": "StateChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "currentPlayer",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "x",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "y",
          "type": "uint8"
        }
      ],
      "name": "MadeMove",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "currentPlayer",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "x",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "y",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "pieceHit",
          "type": "int8"
        }
      ],
      "name": "HitBattleShip",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "player",
          "type": "address"
        }
      ],
      "name": "WonChallenged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "winner",
          "type": "address"
        }
      ],
      "name": "GameEnded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "player",
          "type": "address"
        }
      ],
      "name": "WinningsWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "WithdrawFailed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "currentState",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "comparingState",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "equal",
          "type": "bool"
        }
      ],
      "name": "IsStateCalled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "player",
          "type": "address"
        }
      ],
      "name": "IsPlayerCalled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "state",
          "type": "uint8"
        }
      ],
      "name": "LogCurrentState",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "source",
          "type": "string"
        }
      ],
      "name": "stringToBytes32",
      "outputs": [
        {
          "name": "result",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "name",
          "type": "string"
        }
      ],
      "name": "setName",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "gameId",
          "type": "bytes32"
        }
      ],
      "name": "findPot",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "goFirst",
          "type": "bool"
        }
      ],
      "name": "newGame",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "bytes32"
        }
      ],
      "name": "joinGame",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "bytes32"
        }
      ],
      "name": "showBoard",
      "outputs": [
        {
          "name": "board",
          "type": "int8[10][10]"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "bytes32"
        }
      ],
      "name": "showOtherPlayerBoard",
      "outputs": [
        {
          "name": "",
          "type": "int8[10][10]"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "name": "startX",
          "type": "uint8"
        },
        {
          "name": "endX",
          "type": "uint8"
        },
        {
          "name": "startY",
          "type": "uint8"
        },
        {
          "name": "endY",
          "type": "uint8"
        }
      ],
      "name": "placeShip",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "bytes32"
        }
      ],
      "name": "finishPlacing",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "bytes32"
        },
        {
          "name": "x",
          "type": "uint8"
        },
        {
          "name": "y",
          "type": "uint8"
        }
      ],
      "name": "makeMove",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "bytes32"
        }
      ],
      "name": "sayWon",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
export default new web3.eth.Contract(deployedAbi,deployeAddress,{  gasLimit: "600000"  });