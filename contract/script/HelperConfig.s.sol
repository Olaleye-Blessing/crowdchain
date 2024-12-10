// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {ERC20Mock} from "./../test/mocks/ERC20Mock.sol";
import {MockV3Aggregator} from "./../test/mocks/MockV3Aggregator.sol";

contract HelperConfig is Script {
    Config private activeConfig;
    uint256 public BASE_SEPOLIA_CHAINID = 84532;
    address public ETH_ADDRESS = address(0);

    struct Config {
        address[] supportedCoins;
        address[] coinPriceFeeds;
    }

    constructor() {
        if (block.chainid == BASE_SEPOLIA_CHAINID) {
            activeConfig = getBaseSepoliaChainId();
        } else {
            activeConfig = getOrCreateAnvilConfig();
        }
    }

    function getConfig() public view returns (Config memory) {
        return activeConfig;
    }

    function getBaseSepoliaChainId() public view returns (Config memory config) {
        address[] memory supportedCoins = new address[](3);
        supportedCoins[0] = ETH_ADDRESS;
        supportedCoins[1] = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // usdc
        supportedCoins[2] = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410; // link

        address[] memory coinPriceFeeds = new address[](3);
        coinPriceFeeds[0] = 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1; // eth
        coinPriceFeeds[1] = 0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165; // usdc
        coinPriceFeeds[2] = 0xb113F5A928BCfF189C998ab20d753a47F9dE5A61; // link

        config = Config({supportedCoins: supportedCoins, coinPriceFeeds: coinPriceFeeds});
    }

    function getOrCreateAnvilConfig() public returns (Config memory config) {
        address DEPLOYER = 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38; // default from foundry
        int256 ETH_MOCK_INITIAL_PRICE = 3000_00_000_000; // $3000.00
        int256 DAI_MOCK_INITIAL_PRICE = 1_00_000_000; // $1
        int256 USDC_MOCK_INITIAL_PRICE = 1_00_000_000; // $1
        uint8 USDC_DECIMALS = 8;
        uint8 DAI_DECIMALS = 18;

        vm.startBroadcast();

        ERC20Mock usdc = new ERC20Mock("USDC", "usdc", DEPLOYER, 100_000e18, USDC_DECIMALS);
        ERC20Mock dai = new ERC20Mock("DAI", "dai", DEPLOYER, 100_000e18, DAI_DECIMALS);

        vm.stopBroadcast();

        address[] memory supportedCoins = new address[](3);
        supportedCoins[0] = ETH_ADDRESS;
        supportedCoins[1] = address(usdc);
        supportedCoins[2] = address(dai);

        address[] memory coinPriceFeeds = new address[](3);

        vm.startBroadcast();

        coinPriceFeeds[0] = address(new MockV3Aggregator(8, ETH_MOCK_INITIAL_PRICE)); // eth
        coinPriceFeeds[1] = address(new MockV3Aggregator(8, USDC_MOCK_INITIAL_PRICE)); // usdc
        coinPriceFeeds[2] = address(new MockV3Aggregator(8, DAI_MOCK_INITIAL_PRICE)); // dai

        vm.stopBroadcast();

        _mintTokensToAnvilAddresses(address(usdc), address(dai));

        config = Config({supportedCoins: supportedCoins, coinPriceFeeds: coinPriceFeeds});
    }

    function _mintTokensToAnvilAddresses(address usdc, address dai) private {
        // Needed in the frontend
        address[] memory anvilAccounts = new address[](20);

        anvilAccounts[0] = 0x1BcB8e569EedAb4668e55145Cfeaf190902d3CF2;
        anvilAccounts[1] = 0x8263Fce86B1b78F95Ab4dae11907d8AF88f841e7;
        anvilAccounts[2] = 0xcF2d5b3cBb4D7bF04e3F7bFa8e27081B52191f91;
        anvilAccounts[3] = 0x86c53Eb85D0B7548fea5C4B4F82b4205C8f6Ac18;
        anvilAccounts[4] = 0x1aac82773CB722166D7dA0d5b0FA35B0307dD99D;
        anvilAccounts[5] = 0x2f4f06d218E426344CFE1A83D53dAd806994D325;
        anvilAccounts[6] = 0x1003ff39d25F2Ab16dBCc18EcE05a9B6154f65F4;
        anvilAccounts[7] = 0x9eAF5590f2c84912A08de97FA28d0529361Deb9E;
        anvilAccounts[8] = 0x11e8F3eA3C6FcF12EcfF2722d75CEFC539c51a1C;
        anvilAccounts[9] = 0x7D86687F980A56b832e9378952B738b614A99dc6;
        anvilAccounts[10] = 0x9eF6c02FB2ECc446146E05F1fF687a788a8BF76d;
        anvilAccounts[11] = 0x08A2DE6F3528319123b25935C92888B16db8913E;
        anvilAccounts[12] = 0xe141C82D99D85098e03E1a1cC1CdE676556fDdE0;
        anvilAccounts[13] = 0x4b23D303D9e3719D6CDf8d172Ea030F80509ea15;
        anvilAccounts[14] = 0xC004e69C5C04A223463Ff32042dd36DabF63A25a;
        anvilAccounts[15] = 0x5eb15C0992734B5e77c888D713b4FC67b3D679A2;
        anvilAccounts[16] = 0x7Ebb637fd68c523613bE51aad27C35C4DB199B9c;
        anvilAccounts[17] = 0x3c3E2E178C69D4baD964568415a0f0c84fd6320A;
        anvilAccounts[18] = 0x35304262b9E87C00c430149f28dD154995d01207;
        anvilAccounts[19] = 0xD4A1E660C916855229e1712090CcfD8a424A2E33;

        uint256 mintAmount = 10000 * 10 ** 18;

        vm.startBroadcast();

        for (uint256 i = 0; i < anvilAccounts.length; i++) {
            ERC20Mock(usdc).mint(anvilAccounts[i], mintAmount);
            ERC20Mock(dai).mint(anvilAccounts[i], mintAmount);
        }

        vm.stopBroadcast();
    }
}

// 96869,00_000_000 => BTC/USD
// 100_021_414 -> 1e8 => DAI/USD
// 99_993_710 => USDC/USD
// 3740,47_000_000
