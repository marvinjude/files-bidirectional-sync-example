import useSWR from "swr";
import { getAuthHeaders } from "@/app/auth-provider";
import { Document } from "@/models/document";

export const useDocumentsByIntegration = (integrationKey: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<Document[]>(
    integrationKey
      ? `/api/documents?integrationKey=${encodeURIComponent(integrationKey)}`
      : null,
    async (url: string) => {
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      return (await response.json()) as Document[];
    },
    {
      revalidateOnFocus: false,
      onError: (err: Error) => {
        console.error("Error fetching documents:", err);
      },
    }
  );

  return {
    documents: data || [],
    loading: isLoading,
    error: error?.message || null,
    refresh: () => mutate(),
  };
};
