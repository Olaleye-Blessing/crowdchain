import FetchedData from "@/components/fetched-data";
import { IContributionSystem } from "@/interfaces/contribution-system";
import { IFetch } from "@/interfaces/fetch";
import { formatAddress } from "@/utils/format-address";

interface DonatorsProps {
  donors: IFetch<IContributionSystem | null>;
}

export default function Donators({ donors }: DonatorsProps) {
  const donorsList = donors.data && Object.entries(donors.data);

  return (
    <section className="border text-card-foreground shadow bg-card py-4 rounded-lg">
      <h2 className="px-4">Donors</h2>
      <FetchedData item={donors}>
        {donorsList && (
          <>
            {donorsList.length === 0 ? (
              <p className="px-4">There are no donors yet!</p>
            ) : (
              <ul className="px-4 overflow-y-auto max-h-[20rem] flex flex-col space-y-2">
                {donorsList.map(([donor, amount]) => {
                  return (
                    <li
                      key={donor}
                      className="flex items-center justify-between"
                    >
                      <span
                        title={donor}
                        className="text-gray-500 font-semibold"
                      >
                        {formatAddress(donor)}
                      </span>
                      <span>{amount}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </FetchedData>
    </section>
  );
}
