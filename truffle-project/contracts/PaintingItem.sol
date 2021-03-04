// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PaintingItem is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewPainting(uint256 houseId, string country, uint256 zipCode);

    struct Painting {
        string author;
        string name;
    }

    mapping (uint256 => Painting) private _paintings;

    constructor() public ERC721("PaintingItem", "PIT") {}
    
    function newPainting(string memory _author, string memory _name, string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newPaintingId = _tokenIds.current();
        _mint(msg.sender, newPaintingId);
        _setTokenURI(newPaintingId, _tokenURI);
        _paintings[newPaintingId] = Painting(_author, _name);
        return newPaintingId;
    }

}
