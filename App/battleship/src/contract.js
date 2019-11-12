import web3 from './web3'

const deployeAddress = '0x2c41de68788412d9cf3ec1928c215f4b5ed2ef02';

const deployedAbi = [
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "findOtherPlayer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
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
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "playerGames",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
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
				"internalType": "bool",
				"name": "goFirst",
				"type": "bool"
			}
		],
		"name": "newGame",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			}
		],
		"name": "findPot",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playerNames",
		"outputs": [
			{
				"internalType": "string",
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
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			}
		],
		"name": "status",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"internalType": "uint8",
				"name": "x",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "y",
				"type": "uint256"
			}
		],
		"name": "showOtherPlayerBoard",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "returngameid",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "x",
				"type": "bytes32"
			}
		],
		"name": "bytes32ToString",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"internalType": "uint8",
				"name": "startX",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "endX",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "startY",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
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
		"constant": true,
		"inputs": [],
		"name": "minlen",
		"outputs": [
			{
				"internalType": "uint8",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "y",
				"type": "uint256"
			}
		],
		"name": "showBoard",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
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
				"internalType": "uint8",
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
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "playerNameExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
				"internalType": "bytes32",
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
				"internalType": "string",
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
				"internalType": "string",
				"name": "source",
				"type": "string"
			}
		],
		"name": "stringToBytes32",
		"outputs": [
			{
				"internalType": "bytes32",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			}
		],
		"name": "finishPlacing",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			}
		],
		"name": "sayWon",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "games",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "player1",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "player2",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "player1Name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "player2Name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "currentPlayer",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "winner",
				"type": "address"
			},
			{
				"internalType": "enum battleship.GameState",
				"name": "gameState",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "pot",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
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
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player1",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "player1GoesFirst",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "startX",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "endX",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "startY",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "enum battleship.GameState",
				"name": "newState",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "string",
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
				"internalType": "string",
				"name": "testing",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			}
		],
		"name": "GameMade",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "currentPlayer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "x",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "currentPlayer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "x",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "y",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "int8",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "enum battleship.GameState",
				"name": "currentState",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum battleship.GameState",
				"name": "comparingState",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "bool",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
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
				"internalType": "bytes32",
				"name": "gameId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "enum battleship.GameState",
				"name": "state",
				"type": "uint8"
			}
		],
		"name": "LogCurrentState",
		"type": "event"
	}
]
export default new web3.eth.Contract(deployedAbi,deployeAddress,{  gasLimit: "1000000"  });