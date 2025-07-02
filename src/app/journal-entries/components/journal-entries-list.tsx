"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JournalEntriesListProps {
  journalEntries: [];
  error?: string | null;
  loading?: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border rounded-lg p-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-6 w-64 bg-gray-200 rounded-md mb-2" />
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 bg-gray-200 rounded-md" />
                <div className="h-4 w-20 bg-gray-200 rounded-md" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-6 w-24 bg-gray-200 rounded-md mb-1" />
              <div className="h-4 w-16 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded-md" />
            <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function JournalEntriesList({ journalEntries, loading }: JournalEntriesListProps) {


  // Show loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (journalEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No journal entries found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {journalEntries.map((entry, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Journal Entry #{index + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(entry, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 