import Output from "./_components/output";
import Form from "./_components/form";

export default function Page() {
  return (
    <div className="layout pb-8">
      <header className="sr-only">
        <h1>Campaigns</h1>
      </header>
      <main className="">
        <Form />
        <Output />
      </main>
    </div>
  );
}
