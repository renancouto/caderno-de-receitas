const photoExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export const isPhotoFile = (path: string): boolean =>
  photoExtensions.some((extension) => path.toLowerCase().endsWith(extension));

// Paths are relative to the recipes folder. A Photo sits there or in a folder named after its Recipe.
const nextToRecipe = (path: string, slug: string): boolean => {
  const parts = path.split("/");
  const name = parts.at(-1) ?? "";
  const folders = parts.slice(0, -1);
  const clean = name !== "" && name !== "." && name !== ".." && !path.startsWith("/");
  return clean && (folders.length === 0 || (folders.length === 1 && folders[0] === slug));
};

/** Problems with the image paths a Recipe refers to; `kind` names them in messages ("Photo", "Step image"). */
export function photoProblems(
  paths: readonly string[],
  slug: string,
  exists: (path: string) => boolean,
  kind = "Photo",
): string[] {
  return paths.flatMap((path) => {
    if (!nextToRecipe(path, slug)) {
      return [
        `${kind} "${path}" must be next to the Recipe: in the recipes folder or in the folder "${slug}".`,
      ];
    }
    if (!isPhotoFile(path)) {
      return [`${kind} "${path}" must be a .jpg, .jpeg, .png, .webp or .avif file.`];
    }
    return exists(path) ? [] : [`${kind} "${path}" does not exist.`];
  });
}
