import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, writeToken } from "../env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // should be false for write operations
  token: writeToken, // ✅ correct property name
});

// Optional: runtime check
if (!writeToken) {
  throw new Error("Write token not found.");
}
