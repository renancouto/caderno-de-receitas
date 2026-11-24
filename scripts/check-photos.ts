import { findPhotosWithLocation, listCommittedPhotos } from "../src/lib/photo-location.ts";

const located = await findPhotosWithLocation(listCommittedPhotos());
if (located.length === 0) {
  console.log("No committed Photo has location metadata.");
} else {
  console.error("These Photos have location metadata; the repository is public:");
  for (const path of located) console.error(`- ${path}`);
  console.error("Fix with: pnpm strip:location <photo>...");
  process.exit(1);
}
