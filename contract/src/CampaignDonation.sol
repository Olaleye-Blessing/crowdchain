// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {CampaignBase} from "./CampaignBase.sol";
import {ICampaignDonation, Donation} from "./interfaces/ICampaignDonation.sol";
import {IAggregatorV3} from "./interfaces/IAggregatorV3.sol";

/// @title CampaignDonation
/// @author Olaleye Blessing
/// @notice Abstract contract for campaignDonation functionality, extending CampaignBase
/// @dev Implements donation and refund mechanisms
abstract contract CampaignDonation is CampaignBase, ICampaignDonation {
    using SafeERC20 for ERC20;

    uint256 internal constant MINIMUM_DONATION = 1e18; // $1
    address internal constant ETH_ADDRESS = address(0);

    constructor(address _crowdchainTokenAddress, address[] memory _supportedCoins, address[] memory _coinPriceFeeds)
        CampaignBase(_crowdchainTokenAddress, _supportedCoins, _coinPriceFeeds)
    {}

    function donateETH(uint256 campaignId) external payable {
        _donate(campaignId, msg.value, ETH_ADDRESS);
    }

    function donateToken(uint256 campaignId, uint256 amount, address coin) external payable {
        _donate(campaignId, amount, coin);
    }

    function _donate(uint256 campaignId, uint256 amount, address coin) private campaignExists(campaignId) {
        if (amount == 0) revert CampaignDonation__EmptyDonation();

        if (!isCoinSupported(coin)) revert Campaign__CoinNotSupported(coin);

        uint256 coinValue = coinValueInUSD(coin, amount);

        if (coinValue < MINIMUM_DONATION) {
            revert CampaignDonation__DonationFailed("Donate at least 1 dollar worth of your coin");
        }

        Campaign storage campaign = campaigns[campaignId];
        if (campaign.claimed) revert CampaignDonation__CampaignAlreadyClaimed();
        if (block.timestamp > campaign.deadline) revert CampaignDonation__CampaignClosed();

        if (coin != ETH_ADDRESS) {
            ERC20 token = ERC20(coin);

            uint256 allowance = token.allowance(msg.sender, address(this));

            if (allowance < amount) revert CampaignDonation__InsufficientAllowance(coin, amount);

            token.safeTransferFrom(msg.sender, address(this), amount);
        }

        campaign.amountRaisedPerCoin[coin] += amount;
        campaign.donorTotalAmountPerCoin[msg.sender][coin] += amount;
        campaign.donations.push(Donation({donor: msg.sender, coin: coin, amount: amount, timestamp: block.timestamp}));
        if (campaign.isDonor[msg.sender] == 0) {
            campaign.isDonor[msg.sender] = 1;
            campaign.donorAddresses.push(msg.sender);
        }

        campaign.amountRaised += coinValue;

        emit NewDonation(msg.sender, campaignId, coin, amount, campaign.title);
    }

    function refundETH(uint256 campaignId, uint256 amount) external {
        refundToken(campaignId, amount, ETH_ADDRESS);
    }

    function refundToken(uint256 campaignId, uint256 amount, address coin) public campaignExists(campaignId) {
        if (!isCoinSupported(coin)) revert Campaign__CoinNotSupported(coin);

        if (amount == 0) revert CampaignDonation__WithdrawNotAllowed("Specify amount to withdraw");

        Campaign storage campaign = campaigns[campaignId];

        if (campaign.claimed) revert CampaignDonation__CampaignAlreadyClaimed();
        if (block.timestamp >= campaign.refundDeadline) revert CampaignDonation__RefundDeadlineElapsed(campaignId);

        uint256 amountDonated = campaign.donorTotalAmountPerCoin[msg.sender][coin];

        if (amountDonated == 0) revert CampaignDonation__NoDonationFound(campaignId);

        if (amountDonated < amount) revert CampaignDonation__InsufficientDonation(campaignId, amount, amountDonated);

        if (campaign.totalMilestones > 0) {
            if (campaign.currentMilestone != 0) {
                revert CampaignDonation__WithdrawNotAllowed(
                    "Refunds not allowed after the first milestone funds have been withdrawn"
                );
            }
        }

        campaign.amountRaisedPerCoin[coin] -= amount;
        campaign.donorTotalAmountPerCoin[msg.sender][coin] -= amount;
        campaign.amountRaised = _totalRaisedInUSD(campaign);

        // TODO: check if donor still has other coins donated before updating donorAddress and isDonor
        // TODO: Update amountRaised in Dollars

        bool success;

        if (coin == ETH_ADDRESS) {
            (success,) = payable(msg.sender).call{value: amount}("");
        } else {
            ERC20 token = ERC20(coin);
            token.safeTransfer(msg.sender, amount);
            success = true;
        }

        if (!success) revert CampaignDonation__RefundFailed(campaignId);

        emit DonationRefunded(msg.sender, campaignId, coin, amount);
    }

    /// @notice Withdraw from campaigns without milestones
    /// @dev Explain to a developer any extra details
    /// @param campaignId a parameter just like in doxygen (must be followed by parameter name)
    function withdraw(uint256 campaignId) public virtual campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];

        if (campaign.claimed) revert CampaignDonation__CampaignAlreadyClaimed();
        if (msg.sender != campaign.owner) revert CampaignDonation__NotCampaignOwner();

        campaign.totalMilestones == 0
            ? _withdrawCampaignFundWithNoMilestone(campaign)
            : _withdrawCampaignFundWithMilestone(campaign);
    }

    function _withdrawCampaignFundWithNoMilestone(Campaign storage campaign) private {
        if (block.timestamp < campaign.deadline) {
            revert CampaignDonation__WithdrawNotAllowed("Cannot withdraw before deadline");
        }

        if (block.timestamp < campaign.refundDeadline) {
            revert CampaignDonation__WithdrawNotAllowed("Cannot withdraw before refund deadline");
        }

        campaign.claimed = true;

        address owner = payable(campaign.owner);
        address[] memory _supportedCoins = supportedCoins;
        uint256 totalSupportedCoins = _supportedCoins.length;
        uint256 currentCoinIndex = 0;
        for (currentCoinIndex; currentCoinIndex < totalSupportedCoins; currentCoinIndex++) {
            address coin = _supportedCoins[currentCoinIndex];
            uint256 amount = campaign.amountRaisedPerCoin[coin];

            if (amount == 0) continue;

            if (coin == ETH_ADDRESS) {
                (bool success,) = owner.call{value: amount}("");

                if (!success) revert CampaignDonation__WithdrawalFailed();
            } else {
                ERC20(coin).safeTransfer(owner, amount);
            }

            emit CampaignFundWithdrawn(campaign.id, owner, coin, amount);
        }
    }

    // TODO: 2 loops are happening here. FInd a way to reduce it to 1, or none if possible.
    function _withdrawCampaignFundWithMilestone(Campaign storage campaign) private {
        Milestone storage currentMilestone = campaign.milestones[campaign.currentMilestone];

        if (block.timestamp < currentMilestone.deadline) {
            revert CampaignDonation__WithdrawNotAllowed("Cannot withdraw before milestone deadline");
        }

        address[] memory _supportedCoins = supportedCoins;
        uint256 totalSupportedCoins = _supportedCoins.length;
        uint256 totalRaisedValue = 0;
        uint256 coinIndex = 0;
        for (coinIndex; coinIndex < totalSupportedCoins; coinIndex++) {
            address coin = _supportedCoins[coinIndex];
            uint256 availableAmount = campaign.amountRaisedPerCoin[coin] - campaign.amountWithdrawnPerCoin[coin];
            if (availableAmount == 0) continue;

            totalRaisedValue += coinValueInUSD(coin, availableAmount);
        }

        uint256 amountNeeded = currentMilestone.targetAmount;
        if (campaign.currentMilestone > 0) {
            amountNeeded -= campaign.milestones[campaign.currentMilestone - 1].targetAmount;
        }

        if (totalRaisedValue < amountNeeded) revert CampaignDonation__WithdrawNotAllowed("Insufficient for Milestone");

        if (campaign.currentMilestone + 1 == campaign.totalMilestones) {
            campaign.claimed = true;
        } else {
            currentMilestone.status = MilestoneStatus.Withdrawn;
            campaign.currentMilestone += 1;
            campaign.milestones[campaign.currentMilestone].status = MilestoneStatus.Funding;
        }

        address owner = payable(campaign.owner);
        coinIndex = 0;

        for (coinIndex; coinIndex < totalSupportedCoins; coinIndex++) {
            address coin = _supportedCoins[coinIndex];
            uint256 availableAmount = campaign.amountRaisedPerCoin[coin] - campaign.amountWithdrawnPerCoin[coin];
            if (availableAmount == 0) continue;

            campaign.amountWithdrawnPerCoin[coin] += availableAmount;

            if (coin == ETH_ADDRESS) {
                (bool success,) = owner.call{value: availableAmount}("");
                if (!success) revert CampaignDonation__WithdrawNotAllowed("Failed");
            } else {
                ERC20(coin).transfer(owner, availableAmount);
            }

            emit CampaignFundWithdrawn(campaign.id, owner, coin, availableAmount);
        }
    }

    function _normalizeDigit(uint256 decimals, uint256 amount) internal pure returns (uint256) {
        if (decimals < DECIMAL_PRECISION) return amount * (10 ** (DECIMAL_PRECISION - decimals));

        if (decimals > DECIMAL_PRECISION) return amount / (10 ** (decimals - DECIMAL_PRECISION));

        return amount;
    }

    function _normalizedCoinAmount(address coin, uint256 amount) internal view returns (uint256) {
        return _normalizeDigit(coin == ETH_ADDRESS ? 18 : ERC20(coin).decimals(), amount);
    }

    function _totalRaisedInUSD(Campaign storage campaign) internal view returns (uint256 amountRaisedInUSD) {
        amountRaisedInUSD = 0;
        address[] memory _supportedCoins = supportedCoins;
        uint256 totalSupportedCoins = _supportedCoins.length;
        uint256 coinIndex = 0;

        for (coinIndex; coinIndex < totalSupportedCoins; coinIndex++) {
            address _coin = _supportedCoins[coinIndex];
            uint256 amount = campaign.amountRaisedPerCoin[_coin];
            if (amount == 0) continue;

            uint256 normalizedAmount = _normalizedCoinAmount(_coin, amount);
            uint256 price = getCoinPrice(_coin);
            uint256 valueInUSD = (normalizedAmount * price) / (10 ** DECIMAL_PRECISION);

            amountRaisedInUSD += valueInUSD;
        }

        return amountRaisedInUSD;
    }

    function coinValueInUSD(address coin, uint256 amount) public view returns (uint256) {
        return (_normalizedCoinAmount(coin, amount) * getCoinPrice(coin)) / (10 ** DECIMAL_PRECISION);
    }

    function getCoinPrice(address coin) public view returns (uint256) {
        if (!isCoinSupported(coin)) revert Campaign__CoinNotSupported(coin);

        IAggregatorV3 priceFeed = IAggregatorV3(coinPriceFeeds[coin]);

        uint256 decimals = priceFeed.decimals();

        (, int256 price,,,) = priceFeed.latestRoundData();

        if (price < 0) price = 0;

        return _normalizeDigit(decimals, uint256(price));
    }

    function totalAmountRaisedInUsd(uint256 campaignId) external view campaignExists(campaignId) returns (uint256) {
        return _totalRaisedInUSD(campaigns[campaignId]);
    }

    /// @inheritdoc ICampaignDonation
    function getCampaignDonations(uint256 campaignId, uint256 page, uint256 perPage)
        external
        view
        campaignExists(campaignId)
        validPagination(page, perPage)
        returns (Donation[] memory donations, uint256 totalDonations)
    {
        Campaign storage campaign = campaigns[campaignId];

        uint256 startIndex = page * perPage;
        uint256 endIndex = startIndex + perPage;

        totalDonations = campaign.donations.length;
        endIndex = endIndex > totalDonations ? totalDonations : endIndex;

        donations = new Donation[](endIndex - startIndex);

        for (uint256 i = startIndex; i < endIndex; i++) {
            Donation memory donation = campaign.donations[i];
            donations[i - startIndex] = Donation({
                donor: donation.donor,
                coin: donation.coin,
                amount: donation.amount,
                timestamp: donation.timestamp
            });
        }

        return (donations, totalDonations);
    }

    /// @inheritdoc ICampaignDonation
    function getTotalCampaignDonors(uint256 campaignId)
        external
        view
        campaignExists(campaignId)
        returns (address[] memory)
    {
        return campaigns[campaignId].donorAddresses;
    }

    function getAmountRaisedForCampaignInUSD(uint256 campaignId)
        external
        view
        campaignExists(campaignId)
        returns (uint256)
    {
        return _totalRaisedInUSD(campaigns[campaignId]);
    }

    function getAmountRaisedPerCoin(uint256 campaignId)
        external
        view
        campaignExists(campaignId)
        returns (address[] memory coins, uint256[] memory amount)
    {
        Campaign storage campaign = campaigns[campaignId];

        coins = supportedCoins;
        uint256 totalCoins = supportedCoins.length;
        amount = new uint256[](totalCoins);
        uint256 coinIndex = 0;

        for (coinIndex; coinIndex < totalCoins; coinIndex++) {
            amount[coinIndex] = campaign.amountRaisedPerCoin[coins[coinIndex]];
        }
    }
}
