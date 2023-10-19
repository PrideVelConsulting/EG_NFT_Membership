// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract WEB3Tech_HappyGeeks is Ownable, ERC1155Supply {
    using Strings for uint256;

    string private _name;
    string private _symbol;

    uint8 perUser = 1;
    uint8 idStartNum = 1;
    uint8 idEndNum = 20;
    uint8 perIdAllowed = 25;

    bool public STOP_MINTING;

    mapping(address => bool) internal userBalancedata;
    mapping(uint256 => uint256) internal idRecord;

    event NewURI(address indexed ownerAddr, string newuri);
    event NewMint(address indexed _idOwner, uint256 tokenId);

    constructor()
        ERC1155("ipfs://QmTrHhpbL764Qh4udhoPaAyKF1KSJBTd7pX2vfUTKBHZ1d/")
        Ownable(msg.sender)
    {
        // @dev Set the name and symbol of the token.
        _name = "HappyGeeks";
        _symbol = "GEEKS";
    }

    // @dev returns name of Collection.
    function name() public view returns (string memory) {
        return _name;
    }

    // @dev return symbol of collection.
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // @dev return newURI of the collection
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
        emit NewURI(msg.sender, newuri);
    }

    function restartMinting() public onlyOwner {
        require(STOP_MINTING == true, "Public Minting is Already Active");
        STOP_MINTING = false;
    }

    // @dev mint new token of the collection.
    function mint(uint256 id) public {
        require(
            STOP_MINTING == false,
            "Public Minting Has Been Paused By Admin"
        );
        require(id >= idStartNum, "Exclusive Id allowed!");
        require(id <= idEndNum, "Exclusive Id allowed!");
        require(userBalancedata[msg.sender] == false, "User Already Minted!");
        require(idRecord[id] < perIdAllowed, "Per Id only 25 Allowed");
        _mint(msg.sender, id, perUser, "");
        userBalancedata[msg.sender] = true;
        idRecord[id] += perUser;
        emit NewMint(msg.sender, id);
    }

    // @dev set Royalty information of the collection.
    function uri(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory tokenuri)
    {
        return
            string(
                abi.encodePacked(
                    "ipfs://QmTrHhpbL764Qh4udhoPaAyKF1KSJBTd7pX2vfUTKBHZ1d/",
                    Strings.toString(tokenId),
                    ".json"
                )
            );
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public onlyOwner {
        require(to != address(0), "ERC1155: mint to the zero address");
        require(
            ids.length == amounts.length,
            "ERC1155: ids and amounts length mismatch"
        );
        _mintBatch(to, ids, amounts, "");
    }

    // @dev returns total no of NFTs minted for each batch of 20 unique NFTs
    function getSupplyBalance()
        public
        view
        returns (uint256[] memory tokentotalSupply)
    {
        uint256[] memory result = new uint256[](20);
        for (uint256 i = 0; i < 20; ) {
            result[i] = totalSupply(i + 1);
            unchecked {
                i++;
            }
        }
        return result;
    }

    function stopMinting() public onlyOwner {
        require(
            STOP_MINTING == false,
            "Public Minting has already been Paused By Admin"
        );
        STOP_MINTING = true;
    }
}
