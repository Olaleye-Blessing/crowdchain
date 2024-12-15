import Campaigns from "./_home/_components/campaigns";
import Header from "./_home/_components/header";
import HowItWorks from "./_home/_components/how-it-works";
import Ready from "./_home/_components/ready";
import Reasons from "./_home/_components/reasons";
import Donations from "./_home/_components/donations";
import Cause from "./_home/_components/cause";
import RecentUpdates from "./_home/_components/recent-updates";
import "./_home/home.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className="homePage">
        <Donations />
        <Campaigns />
        <Cause />
        <HowItWorks />
        <RecentUpdates />
        <Reasons />
        <Ready />
      </main>
    </>
  );
}
