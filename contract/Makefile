include .env

.PHONY: deploy-to-sepolia
deploy-to-sepolia:
	forge script script/DeployCrowdFunding.s.sol --rpc-url $(ETH_SEPOLIA_RPC_URL) --private-key $(METAMASK_PRIVATE_KEY) --broadcast
