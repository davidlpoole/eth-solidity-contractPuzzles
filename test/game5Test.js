const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require("hardhat");


describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const [owner] = await ethers.getSigners();
    console.log(owner);

    return { game, owner };
  }
  it('should be a winner', async function () {
    const { game, owner } = await loadFixture(deployContractAndSetVariables);

    // convert the threshold hex value to an int
    const threshold = parseInt("0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf");
    let address = 0;

    // good luck (create random wallets until the address >= threshold)
    while (parseInt(address.address) >= threshold) {
      address = ethers.Wallet.createRandom();
    }

    // connect the wallet to provider
    const loggedInWallet = address.connect(game.provider);

    // send the wallet some ether so it can send a transaction
    await owner.sendTransaction({
      to: loggedInWallet.address,
      value: ethers.utils.parseEther("1"), // Sends exactly 1.0 ether
    });

    // call the win() function from the new wallet
    await game.connect(loggedInWallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
