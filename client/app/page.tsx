import Campaigns from "./_home/_components/campaigns";
import Header from "./_home/_components/header";
import HowItWorks from "./_home/_components/how-it-works";
import Ready from "./_home/_components/ready";
import Reasons from "./_home/_components/reasons";
import Donations from "./_home/_components/donations";
import Cause from "./_home/_components/cause";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-4">
        <Donations />
        <Campaigns />
        <Cause />
        <HowItWorks />
        <Reasons />
        <Ready />
      </main>
    </>
  );
}
