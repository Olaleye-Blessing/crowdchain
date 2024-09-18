include .env

.PHONY: deploy-to-sepolia
deploy-to-sepolia:
	forge script script/DeployCrowdFunding.s.sol --rpc-url $(ETH_SEPOLIA_RPC_URL) --private-key $(METAMASK_PRIVATE_KEY) --broadcast

.PHONY: deploy-local-anvil
deploy-local-anvil:
	forge script script/DeployCrowdFunding.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
