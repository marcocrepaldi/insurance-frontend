import { useState } from "react";
import useSWR from "swr";
import type { InsuranceQuote } from "@/types/insurance-quote";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useQuotes() {
  const { data: quotes = [], error, isValidating, mutate } = useSWR<InsuranceQuote[]>(`${API_URL}/insurance-quotes`);
  const [localQuotes, setLocalQuotes] = useState<InsuranceQuote[]>(quotes);

  const setQuotes = (updatedQuotes: InsuranceQuote[]) => {
    setLocalQuotes(updatedQuotes);
    mutate(updatedQuotes, false); // Atualiza o cache do SWR
  };

  return {
    quotes: localQuotes,
    setQuotes,
    isLoading: !error && !quotes,
    isValidating,
    isError: !!error,
    mutate,
  };
}
