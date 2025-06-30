import { IntegrationAppClient } from "@integration-app/sdk";
import { DocumentModel, Document } from "@/models/document";
import connectDB from "@/lib/mongodb";

interface ListDocumentsActionRecord {
  fields: Exclude<Document, "userId">;
}

export async function syncDocuments(props: {
  userId: string;
  token: string;
  integrationKey: string;
}): Promise<{ success: boolean; totalDocumentsSynced: number }> {
  const { userId, token, integrationKey } = props;

  let totalDocumentsSynced = 0;

  const MAX_DOCUMENTS = 1000; // Maximum number of documents to sync

  await connectDB();

  const integrationApp = new IntegrationAppClient({ token });
  let cursor: string | undefined;

  try {
    // Sync all documents in batches
    while (true) {
      console.info("Fetching documents batch");

      const result = await integrationApp
        .connection(integrationKey)
        .action("list-content-items")
        .run({ cursor });

      const records = (result.output?.records ??
        []) as ListDocumentsActionRecord[];

      const docsToSave = records.map((doc) => ({
        ...doc.fields,
        appKey: integrationKey,
        userId,
        source: "external", // Always set source to external when syncing
      }));

      // Check if adding these documents would exceed our limit
      if (totalDocumentsSynced + docsToSave.length > MAX_DOCUMENTS) {
        const remainingSlots = MAX_DOCUMENTS - totalDocumentsSynced;
        docsToSave.splice(remainingSlots);
      }

      if (docsToSave.length) {
        await DocumentModel.bulkWrite(
          docsToSave.map((doc) => ({
            updateOne: {
              filter: { id: doc.id, appKey: integrationKey },
              update: { $set: doc },
              upsert: true,
            },
          }))
        );

        totalDocumentsSynced += docsToSave.length;
      }

      // Break if we've reached the maximum number of documents
      if (totalDocumentsSynced >= MAX_DOCUMENTS) {
        break;
      }

      // Only continue if there's more data to fetch
      cursor = result.output.cursor;
      if (!cursor) break;
    }

    return { success: true, totalDocumentsSynced };
  } catch (error) {
    console.error("Error in syncDocuments:", error);
    throw error;
  }
}
