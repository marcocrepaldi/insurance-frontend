import useSWR from "swr";
import { InsuranceQuote } from "@/types/insuranceQuotesType";
import { fetcherWithToken } from "@/lib/fetcherWithToken";

export function useQuotes() {
  const { data, error, isValidating, mutate } = useSWR<InsuranceQuote[]>(
    "/insurance-quotes",
    fetcherWithToken
  );

  const isLoading = !data && !error;

  return {
    quotes: data,
    isLoading,
    isValidating,
    mutate,
    error,
  };
}