// Connect to Ethereum node and contract
const Web3 = require('web3');
var contractAddress = '0xB66f35b9F8Ca9E25Ef251EF584b59523fDA9296c'; // Replace with your contract address
var contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "blockHash",
				"type": "bytes32"
			}
		],
		"name": "BlockHashRetrieved",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getBlockHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "int256",
				"name": "lat",
				"type": "int256"
			},
			{
				"indexed": true,
				"internalType": "int256",
				"name": "lon",
				"type": "int256"
			}
		],
		"name": "LocationSet",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "_latitude",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "_longitude",
				"type": "int256"
			}
		],
		"name": "setLocation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLocation",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "latitude",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "longitude",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

async function initWeb3() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
  } else if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }
}

async function getBlockHash() {
  try {
    // Initialize Web3
    await initWeb3();

    // Get the contract instance
    var contract = new web3.eth.Contract(contractAbi, contractAddress);

    // Specify the sender's address in the transaction options
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0]; // Use the first account as the sender

    // Call the getBlockHash function of the smart contract with the sender's address
    const result = await contract.methods.getBlockHash().send({ from: fromAddress });

    // Display the block hash on the front end
    const blockHash = result.events.BlockHashRetrieved.returnValues.blockHash;
    document.getElementById('blockHashInfo').innerHTML = `Block Hash: ${blockHash}`;
  } catch (error) {
    console.error('Error retrieving block hash:', error);
    alert('Error retrieving block hash: ' + error.message);
  }
}

document.getElementById('getBlockHashBtn').addEventListener('click', getBlockHash);
