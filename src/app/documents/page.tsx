"use client";

import { useDocumentsByIntegration } from "./hooks/useDocumentsByIntegration";
import { DocumentList } from "./components/document-list";
import { FilterBar } from "./components/filter-bar";
import { useState, useMemo } from "react";
import { useIntegrations } from "@integration-app/react";
import { ACCOUNTING_APPS } from "@/lib/constants";

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 animate-in fade-in-50">
      <div className="h-10 w-48 bg-gray-200 rounded-md mb-8 animate-pulse" />

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
        ))}
      </div>

      {/* Document cards skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border rounded-lg p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 w-64 bg-gray-200 rounded-md mb-2" />
                <div className="flex items-center gap-4">
                  <div className="h-4 w-32 bg-gray-200 rounded-md" />
                  <div className="h-4 w-20 bg-gray-200 rounded-md" />
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <div className="h-8 w-16 bg-gray-200 rounded-md" />
                <div className="h-8 w-16 bg-gray-200 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const { integrations, loading: integrationsLoading, error: integrationsError } = useIntegrations();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  // Extract integration keys from the integrations list, excluding account apps
  const integrationKeys = useMemo(() => {
    return integrations
      .map(integration => integration.key)
      .filter(key => !ACCOUNTING_APPS.includes(key))
      .sort();
  }, [integrations]);

  // Set default selection when integrations load
  useMemo(() => {
    if (integrationKeys.length > 0 && !selectedIntegration) {
      setSelectedIntegration(integrationKeys[0]);
    }
  }, [integrationKeys, selectedIntegration]);

  // Fetch documents for the selected integration
  const { documents, loading: documentsLoading, error: documentsError, refresh } = useDocumentsByIntegration(selectedIntegration);

  const loading = documentsLoading || integrationsLoading;
  const error = documentsError || integrationsError;

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          Failed to load: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Documents</h1>

      <FilterBar
        integrations={integrationKeys}
        selectedIntegration={selectedIntegration}
        onIntegrationSelect={setSelectedIntegration}
      />

      <DocumentList
        appKey={selectedIntegration || ""}
        documents={documents}
        onDocumentsChange={refresh} />
    </div>
  );
}
