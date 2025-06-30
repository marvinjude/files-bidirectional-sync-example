import { DocumentModel } from "@/models/document";
import { NextResponse } from "next/server";
import { z } from "zod";

const webhookSchema = z.object({
  userId: z.string().min(1).max(100),
  fields: z.object({
    id: z.string().min(1).max(100),
    title: z.string().min(1).max(255),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    parentId: z.string().optional(),
    canHaveChildren: z.boolean(),
    resourceURI: z.string().url().max(2048),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("body", body);

    const payload = webhookSchema.safeParse(body);

    if (!payload.success) {
      console.error("Invalid webhook payload:", payload.error);
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    const { fields, userId } = payload.data;

    const doc = await DocumentModel.findOne({ id: fields.id, userId });

    if (!doc) {
      console.log(`Document with id ${fields.id} not found`);
      return NextResponse.json(
        { message: "Document not found" },
        { status: 200 }
      );
    }

    await doc.updateOne({
      $set: {
        title: fields.title,
        updatedAt: fields.updatedAt,
        resourceURI: fields.resourceURI,
        parentId: fields.parentId,
      },
    });

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    console.error("Error in on-update webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
