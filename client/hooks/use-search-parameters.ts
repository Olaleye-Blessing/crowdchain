import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useSearchParameters = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function getParam(key: string) {
    return searchParams.get(key);
  }

  function updateParams({
    params,
    scroll = false,
  }: {
    params: { [key: string]: string };
    scroll?: boolean;
  }) {
    const search = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(params).forEach(([key, value]) => {
      search.set(key, value);
    });

    router.push(`${pathname}?${search.toString()}`, { scroll });
  }

  function deleteParams({
    params,
    scroll = false,
  }: {
    params: string[];
    scroll?: boolean;
  }) {
    const search = new URLSearchParams(Array.from(searchParams.entries()));

    params.forEach((key) => search.delete(key));

    router.push(`${pathname}?${search.toString()}`, { scroll });
  }

  return { deleteParams, getParam, updateParams };
};
