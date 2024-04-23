const Web3 = require('web3');
var address = "0xB66f35b9F8Ca9E25Ef251EF584b59523fDA9296c";

async function Connect() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
  } else if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }
  web3.eth.defaultAccount = '0x2dDABf5c81a5023D872889b7A6287fa7e3FFdFC6';
}

Connect(); // Call the Connect function to initialize web3

var abi =[
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

var contract = new web3.eth.Contract(abi, address);


document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('getLocationBtn').addEventListener('click', async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = Math.floor(position.coords.latitude); // Convert latitude to integer
        const longitude = Math.floor(position.coords.longitude); // Convert longitude to integer
        
        try {
          document.getElementById('locationInfo').innerHTML = `Latitude: ${latitude}, Longitude: ${longitude}`;

          // Log the values to check if they are within the expected range
          console.log('Latitude:', latitude);
          console.log('Longitude:', longitude);

          // Send the location to the smart contract
          await contract.methods.setLocation(latitude, longitude).send({ from: web3.eth.defaultAccount });
          
          alert('Location sent to smart contract!');
        } catch (error) {
          console.error('Error sending location to smart contract:', error);
          alert('Error sending location to smart contract: ' + error.message);
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });

  document.getElementById('retrieveLocationBtn').addEventListener('click', async () => {
    try {
      const locationData = await contract.methods.getLocation().call();
      const latitude = locationData[0];
      const longitude = locationData[1];

      console.log(`Retrieved location from blockchain: Latitude ${latitude}, Longitude ${longitude}`);
      alert(`Retrieved location from blockchain: Latitude ${latitude}, Longitude ${longitude}`);
    } catch (error) {
      console.error('Error retrieving location:', error);
      alert('Error retrieving location from smart contract: ' + error.message);
    }
  });
});
