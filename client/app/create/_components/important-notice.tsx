import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface ImportantNoticeProps {
  className?: string;
}

export default function ImportantNotice({ className }: ImportantNoticeProps) {
  return (
    <div
      className={cn("flex items-center space-x-2 text-yellow-600", className)}
    >
      <AlertCircle size={20} />
      <span className="text-sm">
        Please ensure all information is accurate before submitting.
      </span>
    </div>
  );
}
