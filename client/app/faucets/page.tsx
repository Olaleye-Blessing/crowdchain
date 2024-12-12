import "./_components/page.css";
import Instructions from "./_components/instructions";
import Availability from "./_components/availability";

export default function Page() {
  return (
    <div className="layout faucets__page">
      <header>
        <h1>Testnet Token Faucets for Base Sepolia</h1>
        <p className="max-w-4xl">
          To test this crowdfunding platform on the Base Sepolia testnet,
          you&apos;ll need to obtain test tokens for the cryptocurrencies
          supported: ETH, USDC, and LINK. Follow the instructions below for each
          token.
        </p>
      </header>
      <main className="mt-8">
        <Instructions />
        <Availability />
        <p className="italic font-semibold">
          <span>Last Updated:</span>
          <time dateTime="2024-12-11">December 12th, 2024</time>
        </p>
      </main>
    </div>
  );
}
