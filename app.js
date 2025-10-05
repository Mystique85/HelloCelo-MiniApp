// Contract info
const CONTRACT_ADDRESS = "0x88Fd392bC4d948DaD1d27B73cad89fF34507EA9B";
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "content", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "MessageSent",
    "type": "event"
  },
  {
    "inputs": [], "name": "getAllMessages",
    "outputs": [
      { "components": [
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "string", "name": "content", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct HelloCelo.Message[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  { "inputs": [], "name": "getMessageCount", "outputs": [{ "internalType": "uint256","name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "_content", "type": "string" }], "name": "sendMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

let web3;
let contract;
let accounts;

// Connect wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    document.getElementById("sendGM").disabled = false;
    fetchMessages();
  } else {
    alert("Please install a Web3 wallet like MetaMask.");
  }
});

// Send GM
document.getElementById("sendGM").addEventListener("click", async () => {
  if (!contract || !accounts) return;
  const gmMessage = "GM";
  await contract.methods.sendMessage(gmMessage).send({ from: accounts[0] });
  fetchMessages();
});

// Fetch and display messages
async function fetchMessages() {
  if (!contract) return;
  const messages = await contract.methods.getAllMessages().call();
  const messagesList = document.getElementById("messages");
  messagesList.innerHTML = "";
  messages.reverse().forEach(msg => {
    const li = document.createElement("li");
    li.textContent = `${msg.sender}: ${msg.content} (${new Date(msg.timestamp*1000).toLocaleString()})`;
    messagesList.appendChild(li);
  });
}
