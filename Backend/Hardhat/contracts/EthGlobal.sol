// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC721, ERC721Enumerable, Ownable {
    uint256 private _nextTokenId = 1;
    string private _baseTokenURI;
    uint256 private maxSupply;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI,
        address initialOwner,
        uint256 _maxSupply
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _baseTokenURI = baseTokenURI;
        maxSupply = _maxSupply;
    }

    function setBaseTokenURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    function batchMint(address[] memory to) public onlyOwner {
        for (uint256 i; i < to.length; ) {
            safeMint(to[i]);
            unchecked {
                ++i;
            }
        }
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        require(totalSupply()+1 <= maxSupply, "Max token Minted!");
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function CollectionMaxSupply() public view returns (uint256) {
        return maxSupply;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireOwned(tokenId);
        return
            string(
                abi.encodePacked(
                    _baseTokenURI,
                    Strings.toString(tokenId),
                    ".json"
                )
            );
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
