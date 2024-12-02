// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Hợp đồng quản lý người dùng
contract UserManager {
    // Cấu trúc thông tin của một người dùng
    struct User {
        string name; // Tên người dùng
        uint health; // Số liệu về sức khỏe
        uint strength; // Số liệu về sức mạnh
    }

    User[] public users; // Danh sách người dùng
    address public owner; // Chủ sở hữu hợp đồng

    // Các sự kiện để thông báo khi có thay đổi dữ liệu
    event UserAdded(uint indexed userId, string name, uint health, uint strength);
    event UserUpdated(uint indexed userId, string name, uint health, uint strength);
    event UserDeleted(uint indexed userId);

    // Modifier: Chỉ cho phép chủ sở hữu thực hiện một số hành động
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    // Hàm khởi tạo, thiết lập chủ sở hữu là người triển khai hợp đồng
    constructor() {
        owner = msg.sender;
    }

    // Thêm một người dùng mới
    function addUser(string memory _name, uint _health, uint _strength) public onlyOwner {
        users.push(User(_name, _health, _strength)); // Thêm vào danh sách
        emit UserAdded(users.length - 1, _name, _health, _strength); // Phát sự kiện
    }

    // Cập nhật thông tin người dùng
    function updateUser(uint _index, string memory _name, uint _health, uint _strength) public onlyOwner {
        require(_index < users.length, "User does not exist."); // Kiểm tra người dùng tồn tại
        users[_index] = User(_name, _health, _strength); // Cập nhật thông tin
        emit UserUpdated(_index, _name, _health, _strength); // Phát sự kiện
    }
////
    function deleteUser(uint _index) public onlyOwner {
    require(_index < users.length, "User does not exist.");
    if (_index < users.length - 1) {
        users[_index] = users[users.length - 1];
    }
    users.pop();
    emit UserDeleted(_index);
    
    // DEBUG: Log trạng thái của mảng users
    for (uint i = 0; i < users.length; i++) {
        console.log(users[i].name);
    }
}


    // Lấy tổng số lượng người dùng
    function getUsersCount() public view returns (uint) {
        return users.length;
    }

    // Lấy thông tin người dùng theo chỉ số
    function getUser(uint _index) public view returns (string memory, uint, uint) {
        require(_index < users.length, "User does not exist.");
        User memory user = users[_index];
        return (user.name, user.health, user.strength);
    }
}
