// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HouseItem is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewHouse(uint256 houseId, string country, uint256 zipCode);

    struct House {
        string country;
        string tokenURI;
        uint256 zipCode;
    }

    mapping (uint256 => House) private _houses;

    constructor() public ERC721("HouseItem", "HIT") {}
    
    function newHouse(string memory _country, string memory _tokenURI, uint256 _zipCode) public returns (uint256) {
        _tokenIds.increment();
        uint256 newHouseId = _tokenIds.current();
        _mint(msg.sender, newHouseId);
        _setTokenURI(newHouseId, _tokenURI);
        _houses[newHouseId] = House(_country, _tokenURI, _zipCode);
        return newHouseId;
    }

}
