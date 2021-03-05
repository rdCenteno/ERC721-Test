const { expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const PaintingItem = artifacts.require("./PaintingItem.sol");

const TOKEN_NAME = "PaintingItem";
const SYMBOL = "PIT";
const AUTHOR_NAME = "DiegoVelazquez";
const BASE_URI = "https://api.com/v1/";
const FIRST_NAME = "LasMeninas";
const FIRST_URI = BASE_URI + FIRST_NAME;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

contract("PaintingItem", (accounts) => {

    const [author1, author2, author3] = accounts;
    let firstToken;

    describe("test for ERC721 token", () => {

        beforeEach(async () => {
            this.token = await PaintingItem.deployed();
        });

        it("has a name", async () => {
            expect(await this.token.name()).to.be.equal(TOKEN_NAME);
        });

        it("has a symbol", async () => {
            expect(await this.token.symbol()).to.be.equal(SYMBOL);
        });

        it("create a new token and checks the owner ", async () => {
            const tx = await this.token.newPainting(AUTHOR_NAME, FIRST_NAME, FIRST_URI, { from: author1 });
            firstToken = tx.logs[0].args.tokenId;
            expect(await this.token.ownerOf(firstToken)).to.be.equal(author1);
            expectEvent.inLogs(tx.logs, "Transfer", { from: ZERO_ADDRESS, to: author1, tokenId: firstToken });
        });

        it("check variables of the fist token", async () => {
            expect(await this.token.tokenURI(firstToken)).to.be.equal(FIRST_URI);
        });

        it("check first token details", async () => {
            const firstPainting = await this.token.getPainting(firstToken);
            expect(firstPainting[0]).to.be.equal(AUTHOR_NAME);
            expect(firstPainting[1]).to.be.equal(FIRST_NAME);
        });

        it("creates two new paintings and checks the balance of the user", async () => {
            const auxPaintings = ["LaFraguaDeVulcano", "LaRendicionDeBreda"];

            const promises = auxPaintings.map(auxName => 
                this.token.newPainting(AUTHOR_NAME, auxName, BASE_URI + auxName, { from: author2 })
            );
            await Promise.all(promises);
            const userCount = auxPaintings.length.toString();
            expect(await this.token.balanceOf(author2)).to.be.bignumber.equal(userCount);
        });

        it("check user does not own any painting", async () => {
            expect(await this.token.balanceOf(author3)).to.be.bignumber.equal("0");
        });

    });

});