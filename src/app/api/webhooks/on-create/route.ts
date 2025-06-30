import { verifyIntegrationAppToken } from "@/lib/integration-app-auth";
import { NextRequest, NextResponse } from "next/server";
import { DocumentModel } from "@/models/document";
import connectDB from "@/lib/mongodb";
import { z } from "zod";

const webhookSchema = z.object({
  userId: z.string(),
  fields: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    parentId: z.string().optional(),
    canHaveChildren: z.boolean(),
    resourceURI: z.string().url(),
  }),
});

/**
 * This webhook is triggered when a document is created on external apps
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("Body:", body);

  const verificationResult = await verifyIntegrationAppToken(request);

  if (!verificationResult) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const payload = webhookSchema.safeParse(body);

  if (!payload.success) {
    console.error("Invalid webhook payload:", payload.error);
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 }
    );
  }

  const { fields, userId } = payload.data;

  if (!userId) {
    console.error("User ID not found for connection:", userId);
    return NextResponse.json(
      { error: "User ID not found for connection" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const existingDoc = await DocumentModel.findOne({
      id: fields.id,
      userId,
    });

    if (!existingDoc) {
      await DocumentModel.bulkWrite([
        {
          insertOne: {
            document: {
              ...fields,
              userId,
            },
          },
        },
      ]);
    } else {
      console.log(`Document with id ${fields.id} already exists`);
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
