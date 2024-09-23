import Campaigns from "./_home/_components/campaigns";
import Header from "./_home/_components/header";
import HowItWorks from "./_home/_components/how-it-works";
import Ready from "./_home/_components/ready";
import Reasons from "./_home/_components/reasons";
import "./_home/page.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-4 [&>section]:mb-8">
        <Campaigns />
        <HowItWorks />
        <Reasons />
        <Ready />
      </main>
    </>
  );
}
