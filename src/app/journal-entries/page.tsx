"use client";

import { useJournalEntriesByIntegration } from "./hooks/useJournalEntriesByIntegration";
import { JournalEntriesList } from "./components/journal-entries-list";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ACCOUNTING_APPS } from "@/lib/constants";

function FilterBar({
  selectedIntegration,
  onIntegrationSelect,
  error,
}: {
  selectedIntegration: string | null;
  onIntegrationSelect: (integration: string) => void;
  error?: string | null;
}) {
  const integrations = ACCOUNTING_APPS;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {integrations.map((integration) => (
          <Button
            key={integration}
            variant={selectedIntegration === integration ? "default" : "outline"}
            size="sm"
            onClick={() => onIntegrationSelect(integration)}
            className="text-sm capitalize"
          >
            {integration}
          </Button>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Connection Error</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}

export default function JournalEntriesPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>("xero");

  // Fetch journal entries for the selected integration
  const { journalEntries, loading, error } = useJournalEntriesByIntegration(selectedIntegration);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Journal Entries</h1>

      <FilterBar
        selectedIntegration={selectedIntegration}
        onIntegrationSelect={setSelectedIntegration}
        error={error}
      />

      <JournalEntriesList
        journalEntries={journalEntries}
        error={error}
        loading={loading}
      />
    </div>
  );
} 