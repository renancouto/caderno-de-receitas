import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { isPhotoFile } from "./photo-files.ts";

const gpsPointerTag = 0x8825;
const xmpLocation =
  /exif:GPS|photoshop:(City|State|Country)|Iptc4xmpCore:(Location|CountryCode)|Iptc4xmpExt:(LocationShown|LocationCreated)/;
// IPTC datasets (record 2): sublocation, city, province/state, country code, country name.
const iptcLocationDatasets = [90, 92, 95, 100, 101];

function exifHasGps(exif: Buffer): boolean {
  const tiff = exif.subarray(
    exif.indexOf("II*\0") >= 0 ? exif.indexOf("II*\0") : exif.indexOf("MM\0*"),
  );
  if (tiff.length < 8) return false;
  const little = tiff.toString("latin1", 0, 2) === "II";
  const u16 = (at: number) => (little ? tiff.readUInt16LE(at) : tiff.readUInt16BE(at));
  const u32 = (at: number) => (little ? tiff.readUInt32LE(at) : tiff.readUInt32BE(at));
  const ifd = u32(4);
  if (ifd + 2 > tiff.length) return false;
  const count = u16(ifd);
  for (let i = 0; i < count && ifd + 2 + i * 12 + 12 <= tiff.length; i++) {
    if (u16(ifd + 2 + i * 12) === gpsPointerTag) return true;
  }
  return false;
}

const iptcHasLocation = (iptc: Buffer): boolean =>
  iptc.some(
    (byte, i) =>
      byte === 0x1c && iptc[i + 1] === 2 && iptcLocationDatasets.includes(iptc[i + 2] ?? 0),
  );

/** True when the image carries GPS coordinates or a named place in its EXIF, XMP or IPTC metadata. */
export async function hasLocationMetadata(image: Buffer): Promise<boolean> {
  const { exif, xmp, iptc } = await sharp(image).metadata();
  return (
    (exif !== undefined && exifHasGps(exif)) ||
    (xmp !== undefined && xmpLocation.test(xmp.toString("utf8"))) ||
    (iptc !== undefined && iptcHasLocation(iptc))
  );
}

/** Re-encodes the image without any metadata, after applying its orientation so it still looks upright. */
export async function stripLocationMetadata(image: Buffer): Promise<Buffer> {
  return sharp(image).rotate().toBuffer();
}

export async function findPhotosWithLocation(paths: readonly string[]): Promise<string[]> {
  const flags = await Promise.all(
    paths.map(async (path) => hasLocationMetadata(await readFile(path))),
  );
  return paths.filter((_, i) => flags[i]);
}

// Includes new files not yet added to git, so a Photo is caught before it is committed.
// Test fixtures hold Photos with location metadata on purpose, so they're left out.
export function listCommittedPhotos(): string[] {
  return execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
    encoding: "utf8",
  })
    .split("\0")
    .filter((path) => isPhotoFile(path) && !path.startsWith("tests/fixtures/"));
}
