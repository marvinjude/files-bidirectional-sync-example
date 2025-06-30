import { Schema, model, models } from "mongoose";
import { DownloadStateType, ExternalSyncStatusType } from "@/types/download";

export interface Document {
  _id: string;
  id?: string;
  title: string;
  canHaveChildren: boolean;
  canDownload: boolean;
  url?: string;
  resourceURI?: string;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  userId: string;

  appKey: string;
  source: "external" | "internal";

  // Download-related fields
  downloadState?: DownloadStateType;
  downloadError?: string;

  //External sync fields
  externalSyncStatus: ExternalSyncStatusType;
  externalSyncError?: string;
}

const documentSchema = new Schema<Document>({
  id: String,
  title: String,
  canHaveChildren: Boolean,
  canDownload: Boolean,
  url: String,
  resourceURI: String,
  createdAt: String,
  updatedAt: String,
  parentId: {
    type: String,
    default: null,
  },
  userId: String,

  appKey: String,
  source: String,

  // Download-related fields
  downloadState: String,
  downloadError: String,

  // External sync fields
  externalSyncStatus: String,
  externalSyncError: String,
});

documentSchema.index({ id: 1, appKey: 1 }, { unique: true, sparse: true });

// Check if model already exists to prevent recompilation
export const DocumentModel =
  models?.Document || model<Document>("Document", documentSchema);
