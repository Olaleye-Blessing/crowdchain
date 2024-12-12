import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useCrowdchainInstance } from "./use-crowdchain-instance";
import { hanldeCrowdChainApiError } from "@/utils/handle-api-error";

export const useCrowdchainRequest = <TData = any, TError = any>({
  url,
  options,
}: {
  url: string;
  options: UseQueryOptions<TData, TError>;
}) => {
  const { crowdchainInstance } = useCrowdchainInstance();
  const result = useQuery({
    ...options,
    queryFn: async () => {
      try {
        let { data } = await crowdchainInstance().get<{ data: TData }>(url);

        return data.data;
      } catch (error) {
        throw new Error(hanldeCrowdChainApiError(error));
      }
    },
  });

  return result;
};
