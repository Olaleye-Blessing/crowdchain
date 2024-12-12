export default function Availability() {
  return (
    <section className="my-4">
      <header>
        <h2>Tokens Support</h2>
      </header>
      <p>
        Tokens support is determined by if there is a price feed from the{" "}
        <a
          href="https://docs.chain.link/data-feeds/price-feeds/addresses?network=base&page=1#base-sepolia-testnet"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chainlink aggregator
        </a>{" "}
        and if there are sites that give these tokens.
      </p>
    </section>
  );
}
