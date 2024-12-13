import DonateSystem, { type DonateSystemProps } from "./donate-system";
import Info from "./info";
import Header from "./header";

interface DetailsProps extends DonateSystemProps {}

export default function Details({ campaign }: DetailsProps) {
  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          <Header campaign={campaign} />
          <Info campaign={campaign} />
        </div>

        <DonateSystem campaign={campaign} />
      </div>
    </section>
  );
}
