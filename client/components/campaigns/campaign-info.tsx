import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface CampaignInfoProps {
  Icon: LucideIcon;
  iconClassName?: string;
  title: string;
  body: ReactNode;
}

export default function CampaignInfo({
  Icon,
  iconClassName,
  title,
  body,
}: CampaignInfoProps) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconClassName}`} />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
