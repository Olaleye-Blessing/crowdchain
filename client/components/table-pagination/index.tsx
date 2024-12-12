import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";

interface TablePaginationProps {
  perPage: number;
  onSelectPerPage(perPage: number): void;
  onPageChange: (diff: number) => void;
  totalItems: number;
  currentPage: number;
}

const perPages =
  process.env.NODE_ENV === "production"
    ? ["10", "25", "50", "100"]
    : ["2", "4", "8", "10"];

export default function TablePagination({
  perPage,
  totalItems,
  currentPage,
  onSelectPerPage,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center justify-start">
        <p className="flex-shrink-0 mr-[0.5rem]">Show rows:</p>
        <Select
          defaultValue={`${perPage}`}
          onValueChange={(newPage) => {
            onSelectPerPage(+newPage);
          }}
        >
          <SelectTrigger className="w-full max-w-20 text-center">
            <SelectValue placeholder="Select rows" className="text-center" />
          </SelectTrigger>
          <SelectContent>
            {perPages.map((page) => (
              <SelectItem key={page} value={page}>
                {page}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-center">
        <ControlButton
          disabled={currentPage === 0}
          Icon={ChevronLeft}
          onClick={() => onPageChange(-1)}
        />
        <p className="flex items-center justify-center bg-[#f8f9fa] border-[#e9ecef] border rounded-md px-3 pt-[0.2rem] pb-[0.3rem] mx-1">
          <span>{currentPage + 1}</span>
          <span className="mx-[0.4rem]">of</span>
          <span>{totalPages}</span>
        </p>
        <ControlButton
          disabled={currentPage + 1 === totalPages}
          Icon={ChevronRight}
          onClick={() => onPageChange(+1)}
        />
      </div>
    </div>
  );
}

function ControlButton({
  disabled,
  Icon,
  onClick,
}: {
  disabled: boolean;
  Icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="bg-card px-[0.15rem] rounded-md border-border disabled:bg-[#f8f9fa] hover:bg-primary hover:disabled:bg-[#f8f9fa] self-stretch transition-colors duration-150"
    >
      <Icon />
    </button>
  );
}
