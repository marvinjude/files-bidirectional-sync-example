import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/server-auth";
import { generateCustomerAccessToken } from "@/lib/integration-token";
import connectDB from "@/lib/mongodb";
import { syncDocuments } from "./syncDocuments";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ integrationKey: string }> }
): Promise<NextResponse<{ success: boolean }>> {
  try {
    const integrationKey = (await params).integrationKey;

    const auth = getAuthFromRequest(request);
    const token = await generateCustomerAccessToken(auth);

    await connectDB();

    await syncDocuments({
      token,
      userId: auth.customerId,
      integrationKey
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to start sync:", error);
    return NextResponse.json(
      { success: false, message: "Failed to start sync" },
      { status: 500 }
    );
  }
}
