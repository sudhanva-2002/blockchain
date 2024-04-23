// Define your Ethereum node or service provider URL
var providerUrl = 'https://mainnet.infura.io/v3/b8e15e2883544b038a23bf6afeecb997'; // Replace with your Web3 provider URL

// Initialize Web3 and connect to the Ethereum node
const Web3 = require('web3');

async function initWeb3() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
  } else if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"));
  }
}

// Define the address and ABI of your smart contract
var contractAddress = '0xB66f35b9F8Ca9E25Ef251EF584b59523fDA9296c'; // Replace with your contract address
var contractAbi =[
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

// Function to listen for the DataStored event and retrieve data
async function listenForDataStored() {
  try {
    // Initialize Web3
    await initWeb3();

    // Get the contract instance
    var contract = new web3.eth.Contract(contractAbi, contractAddress);

    // Subscribe to the DataStored event
    contract.events.DataStored()
      .on('data', async (event) => {
        const eventData = event.returnValues.data;
        console.log('Data stored in the block:', eventData);

        // Display data on the front end or perform other actions
        displayData(eventData);
      })
      .on('error', (error) => {
        console.error('Error listening to DataStored event:', error);
        alert('Error listening to DataStored event: ' + error.message);
      });
  } catch (error) {
    console.error('Error initializing Web3 and contract:', error);
    alert('Error initializing Web3 and contract: ' + error.message);
  }
}

// Function to display data on the front end
function displayData(data) {
  const dataDisplayDiv = document.getElementById('dataDisplay');
  alert(`Data stored in the block: ${data}`);
}

// Call the function to start listening for the DataStored event
listenForDataStored();
