import CampaignForm from "./_components/campaign-form";

export default function Page() {
  return (
    <main>
      <header>
        <h1 className="sr-only">Create a New Campaign</h1>
      </header>
      <CampaignForm />
    </main>
  );
}
