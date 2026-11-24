import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  findPhotosWithLocation,
  hasLocationMetadata,
  listCommittedPhotos,
  stripLocationMetadata,
} from "./photo-location";
import { isPhotoFile } from "./photo-files";

const fixtures = "tests/fixtures/photos-with-location";
const blank = () =>
  sharp({ create: { width: 16, height: 16, channels: 3, background: "#c9742e" } });

describe("hasLocationMetadata", () => {
  it("finds GPS coordinates in EXIF", async () => {
    expect(await hasLocationMetadata(await readFile(`${fixtures}/gps.jpg`))).toBe(true);
  });

  it("passes an image with no metadata", async () => {
    expect(await hasLocationMetadata(await readFile(`${fixtures}/clean.jpg`))).toBe(false);
  });

  it("passes an image with harmless EXIF", async () => {
    const photo = await blank()
      .withExif({ IFD0: { Copyright: "me" } })
      .jpeg()
      .toBuffer();
    expect(await hasLocationMetadata(photo)).toBe(false);
  });

  it("finds location in XMP", async () => {
    const xmp = '<x:xmpmeta><rdf:Description photoshop:City="Lisboa"/></x:xmpmeta>';
    const photo = await blank().withXmp(xmp).jpeg().toBuffer();
    expect(await hasLocationMetadata(photo)).toBe(true);
  });

  it("finds GPS in XMP", async () => {
    const xmp = '<x:xmpmeta><rdf:Description exif:GPSLatitude="12,20N"/></x:xmpmeta>';
    const photo = await blank().withXmp(xmp).jpeg().toBuffer();
    expect(await hasLocationMetadata(photo)).toBe(true);
  });

  it("finds GPS in a PNG", async () => {
    const photo = await blank()
      .withExif({ IFD3: { GPSLatitudeRef: "N", GPSLatitude: "12/1 20/1 0/1" } })
      .png()
      .toBuffer();
    expect(await hasLocationMetadata(photo)).toBe(true);
  });
});

describe("stripLocationMetadata", () => {
  it("removes location metadata and keeps the image", async () => {
    const stripped = await stripLocationMetadata(await readFile(`${fixtures}/gps.jpg`));
    expect(await hasLocationMetadata(stripped)).toBe(false);
    expect(await sharp(stripped).metadata()).toMatchObject({
      format: "jpeg",
      width: 160,
      height: 90,
    });
  });

  it("applies the EXIF orientation so the picture still looks upright", async () => {
    const flat = await blank()
      .resize(32, 16, { fit: "fill" })
      .withExif({ IFD3: { GPSLatitudeRef: "N", GPSLatitude: "1/1 0/1 0/1" } })
      .jpeg()
      .toBuffer();
    const tall = await sharp(flat).withMetadata({ orientation: 6 }).toBuffer();
    const stripped = await stripLocationMetadata(tall);
    expect(await sharp(stripped).metadata()).toMatchObject({ width: 16, height: 32 });
  });
});

describe("isPhotoFile", () => {
  it("recognises image files by extension, ignoring case", () => {
    expect(["a.jpg", "b/C.JPEG", "d.png", "e.webp", "f.avif"].every(isPhotoFile)).toBe(true);
    expect(["a.md", "b.svg", "c"].some(isPhotoFile)).toBe(false);
  });
});

describe("findPhotosWithLocation", () => {
  it("lists the Photos that carry location metadata", async () => {
    expect(await findPhotosWithLocation([`${fixtures}/gps.jpg`, `${fixtures}/clean.jpg`])).toEqual([
      `${fixtures}/gps.jpg`,
    ]);
  });

  it("finds no location in any committed Photo", async () => {
    expect(await findPhotosWithLocation(listCommittedPhotos())).toEqual([]);
  });

  it("reads files from disk", async () => {
    const dir = await mkdtemp(join(tmpdir(), "photos-"));
    await writeFile(join(dir, "x.jpg"), await readFile(`${fixtures}/gps.jpg`));
    expect(await findPhotosWithLocation([join(dir, "x.jpg")])).toEqual([join(dir, "x.jpg")]);
  });
});
