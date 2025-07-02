import useSWR from "swr";
import { useAuth } from "@/hooks/use-auth";
import { useIntegrationApp } from "@integration-app/react";

export const useJournalEntriesByIntegration = (
  integrationKey: string | null
) => {
  const { customerId } = useAuth();

  const client = useIntegrationApp();

  const { data, error, isLoading, mutate } = useSWR(
    integrationKey && customerId ? `journal-entries-${integrationKey}` : null,
    async () => {
      try {
        if (!integrationKey || !customerId) {
          throw new Error("Missing integration key or customer ID");
        }

        const connection = client.connection(integrationKey);
        const response = await connection.action("list-journal-entries").run();

        if (!response.output) {
          throw new Error(
            "Failed to fetch journal entries: No output received"
          );
        }

        return response.output.records || [];
      } catch (err) {
        // Just store the error message, don't care about the type
        throw new Error(err instanceof Error ? err.message : String(err));
      }
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    journalEntries: data || [],
    loading: isLoading,
    error: error?.message || null,
    refresh: () => mutate(),
  };
};
