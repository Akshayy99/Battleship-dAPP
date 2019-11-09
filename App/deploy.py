from web3 import Web3
from solc import compile_files
# web3.py instance
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

contracts = compile_files(['../contracts/battleship.sol', 'stringUtils.sol'])

contract = contracts.pop("../contracts/battleship.sol:StringUtils")
library_link = contracts.pop("stringUtils.sol:StringUtils")

