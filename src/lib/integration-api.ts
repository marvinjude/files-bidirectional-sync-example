import { getAuthHeaders } from "@/app/auth-provider";

export async function startSync(integrationKey: string) {
  const response = await fetch(`/api/integrations/${integrationKey}/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to start sync");
  }

  return response.json();
}
