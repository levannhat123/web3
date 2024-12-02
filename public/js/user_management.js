let provider, signer, contract;
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
let contractAddress = "";

// Tải địa chỉ hợp đồng từ file JSON
async function loadContractAddress() {
    try {
        const response = await fetch('./deployedAddress.json');
        const data = await response.json();
        contractAddress = data.contractAddress;
        console.log("Loaded Contract Address:", contractAddress);
    } catch (error) {
        showToast("Error loading contract address.", true);
        console.error("Error loading contract address:", error);
    }
}

// Kết nối ví MetaMask và hợp đồng
async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Yêu cầu kết nối ví
            signer = provider.getSigner();

            if (!contractAddress) {
                await loadContractAddress(); // Đảm bảo địa chỉ hợp đồng đã được tải
            }

            contract = new ethers.Contract(contractAddress, abi, signer);

            const address = await signer.getAddress();
            document.getElementById("walletAddress").innerText = `Wallet: ${address}`;
            showToast("Connected successfully!");
        } catch (error) {
            showToast("Failed to connect wallet.", true);
            console.error("Error connecting wallet:", error);
        }
    } else {
        showToast("MetaMask not installed. Please install MetaMask.", true);
    }
}

// Hiển thị danh sách người dùng
async function loadUsers() {
    try {
        const usersCount = await contract.getUsersCount();
        const userList = document.getElementById("userList");
        userList.innerHTML = "";

        if (usersCount === 0) {
            userList.innerHTML = "<div class='empty-list'>No users available. Please add a user.</div>";
            return;
        }

        for (let i = 0; i < usersCount; i++) {
            const user = await contract.getUser(i);
            const userDiv = document.createElement("div");
            userDiv.className = "user-row";
            userDiv.innerHTML = `
                <div>${i + 1}. ${user[0]}</div>
                <div>
                    <button class="update-button" onclick="updateUser(${i})">Update</button>
                    <button class="delete-button" onclick="deleteUse(${i}, '${user[0]}')">Delete</button>
                </div>
            `;
            userList.appendChild(userDiv);
        }
    } catch (error) {
        showToast("Failed to load users.", true);
        console.error("Error loading users:", error);
    }
}

// Chuyển hướng tới form thêm người dùng
document.getElementById("addUser").onclick = () => {
    window.location.href = "user_form.html";
};







// Cập nhật người dùng
async function updateUser(index, currentName, currentHealth, currentStrength) {
  // Hiển thị form chỉnh sửa người dùng
  const newName = prompt("Enter new name:", currentName);
  const newHealth = parseInt(prompt("Enter new health:", currentHealth));
  const newStrength = parseInt(prompt("Enter new strength:", currentStrength));

  if (!newName || isNaN(newHealth) || isNaN(newStrength)) {
      showToast("Invalid input. Please try again.", true);
      return;
  }

  try {
      const tx = await contract.updateUser(index, newName, newHealth, newStrength);
      await tx.wait();
      showToast("User updated successfully!");
      loadUsers();
  } catch (error) {
      showToast("Error updating user.", true);
      console.error("Error updating user:", error);
  }
}

// Xóa người dùng
async function deleteUse(index, userName) {
  if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;

  try {
      const tx = await contract.deleteUser(index);
      await tx.wait();
      showToast("User deleted successfully!");
      loadUsers(); // Cập nhật danh sách người dùng sau khi xóa
  } catch (error) {
      showToast("Error deleting user.", true);
      console.error("Error deleting user:", error);
  }
}

// Hiển thị thông báo toast
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.backgroundColor = isError ? "#dc3545" : "#28a745";
  toast.className = "toast show";
  setTimeout(() => {
      toast.className = "toast";
  }, 3000);
}

// Hiển thị thông báo toast
function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.backgroundColor = isError ? "#dc3545" : "#28a745";
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

// Ngắt kết nối ví
document.getElementById("disconnectWallet").onclick = () => {
    localStorage.removeItem("connectedWallet");
    window.location.href = "index.html";
};

// Tải trang và thực hiện kết nối
window.onload = async () => {
    await connectWallet();
    loadUsers();
};
