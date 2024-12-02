let provider, signer, contract;
let contractAddress = ""; // Địa chỉ hợp đồng sẽ được tải từ file JSON
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "userId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "health",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "strength",
            "type": "uint256"
          }
        ],
        "name": "UserAdded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "userId",
            "type": "uint256"
          }
        ],
        "name": "UserDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "userId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "health",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "strength",
            "type": "uint256"
          }
        ],
        "name": "UserUpdated",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_health",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_strength",
            "type": "uint256"
          }
        ],
        "name": "addUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_index",
            "type": "uint256"
          }
        ],
        "name": "deleteUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_index",
            "type": "uint256"
          }
        ],
        "name": "getUser",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getUsersCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_index",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_health",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_strength",
            "type": "uint256"
          }
        ],
        "name": "updateUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "users",
        "outputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "health",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "strength",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
]; 

// Tải địa chỉ hợp đồng từ file JSON
async function loadContractAddress() {
    try {
        const response = await fetch('./deployedAddress.json'); // Đọc file JSON
        const data = await response.json();
        contractAddress = data.contractAddress;
        console.log("Loaded Contract Address:", contractAddress);
    } catch (error) {
        console.error("Error loading contract address:", error);
    }
}

// Kết nối blockchain qua MetaMask
async function connectToBlockchain() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Yêu cầu quyền kết nối MetaMask
            signer = provider.getSigner();

            // Đảm bảo địa chỉ hợp đồng đã được tải
            if (!contractAddress) {
                await loadContractAddress();
            }

            contract = new ethers.Contract(contractAddress, abi, signer); // Kết nối hợp đồng
            console.log("Blockchain connected successfully.");
        } catch (error) {
            console.error("Error connecting to blockchain:", error);
            alert("Failed to connect to MetaMask.");
        }
    } else {
        alert("Please install MetaMask.");
    }
}

// Hàm lưu người dùng
async function saveUser() {
    if (!contract) {
        alert("Contract is not initialized. Please connect your wallet.");
        return;
    }

    const userName = document.getElementById('userName').value;
    const userHealth = parseInt(document.getElementById('userHealth').value);
    const userStrength = parseInt(document.getElementById('userStrength').value);

    if (!userName || isNaN(userHealth) || isNaN(userStrength)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    try {
        console.log("Sending transaction to save user...");
        const tx = await contract.addUser(userName, userHealth, userStrength);
        await tx.wait(); // Chờ giao dịch được xác nhận
        alert("User saved successfully!");
        window.location.href = "user_management.html"; // Chuyển hướng sau khi lưu
    } catch (error) {
        console.error("Error saving user:", error);
        alert("Error saving user: " + error.message);
    }
}

// Điều hướng về trang quản lý người dùng khi nhấn "Cancel"
function cancelUser() {
    console.log("Cancel button clicked");
    window.location.href = "user_management.html";
}

// Thêm sự kiện cho nút Save và Cancel khi trang tải
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("save").addEventListener("click", saveUser);
    document.getElementById("cancel").addEventListener("click", cancelUser);
    connectToBlockchain(); // Kết nối blockchain
});
