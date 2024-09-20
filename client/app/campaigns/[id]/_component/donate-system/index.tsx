import { ICampaignDetail } from "@/interfaces/campaign";
import Donators from "./donators";
import RefundOrDonate from "./refund-or-donate";

export default function DonateSystem({
  campaign,
}: {
  campaign: ICampaignDetail;
}) {
  return (
    <div className="lg:w-1/3 mt-6 lg:mt-0">
      <div className="sticky top-4 grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(18.75rem,_1fr))] lg:grid-cols-1">
        <RefundOrDonate
          deadline={campaign.deadline}
          refundDeadline={campaign.refundDeadline}
          claimed={campaign.claimed}
        />
        <Donators />
      </div>
    </div>
  );
}
