import Loading from "@/app/loading";
import { IFetch } from "@/interfaces/fetch";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FetchedDataProps<Data> {
  children: ReactNode;
  item: IFetch<Data | null>;
  fetchClassName?: string;
  errorClassName?: string;
}

export default function FetchedData<D>({
  item,
  children,
  fetchClassName = "",
  errorClassName = "",
}: FetchedDataProps<D>) {
  return (
    <>
      {item.data ? (
        <>{children}</>
      ) : item.error ? (
        <p className={cn("text-red-600", errorClassName)}></p>
      ) : (
        <div className={cn("flex items-center justify-center", fetchClassName)}>
          <Loading />
        </div>
      )}
    </>
  );
}
