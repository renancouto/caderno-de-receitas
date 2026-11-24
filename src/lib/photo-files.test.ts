import { describe, expect, it } from "vitest";
import { photoProblems } from "./photo-files";

const exists =
  (...present: string[]) =>
  (path: string) =>
    present.includes(path);

describe("photoProblems", () => {
  it("accepts a Photo in the recipes folder or in the folder named after the Recipe", () => {
    expect(
      photoProblems(["cake.jpg", "cake/top.webp"], "cake", exists("cake.jpg", "cake/top.webp")),
    ).toEqual([]);
  });

  it("rejects a Photo that doesn't exist", () => {
    expect(photoProblems(["cake/top.jpg"], "cake", exists())).toEqual([
      'Photo "cake/top.jpg" does not exist.',
    ]);
  });

  it("rejects a Photo in another Recipe's folder", () => {
    expect(photoProblems(["pie/top.jpg"], "cake", exists("pie/top.jpg"))).toEqual([
      'Photo "pie/top.jpg" must be next to the Recipe: in the recipes folder or in the folder "cake".',
    ]);
  });

  it("rejects paths that climb out of the folder", () => {
    expect(
      photoProblems(["cake/../../secret.jpg"], "cake", exists("cake/../../secret.jpg")),
    ).toEqual([
      'Photo "cake/../../secret.jpg" must be next to the Recipe: in the recipes folder or in the folder "cake".',
    ]);
  });

  it("rejects files that aren't images Astro can process", () => {
    expect(photoProblems(["cake/notes.txt"], "cake", exists("cake/notes.txt"))).toEqual([
      'Photo "cake/notes.txt" must be a .jpg, .jpeg, .png, .webp or .avif file.',
    ]);
  });

  it("names the kind of image in the message", () => {
    expect(photoProblems(["cake/s1.jpg"], "cake", exists(), "Step image")).toEqual([
      'Step image "cake/s1.jpg" does not exist.',
    ]);
  });
});
