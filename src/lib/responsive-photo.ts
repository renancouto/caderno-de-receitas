import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

export type ResponsivePhoto = {
  /** Fallback for browsers that ignore `sources`. */
  src: string;
  width: number;
  height: number;
  sources: { type: string; srcset: string }[];
};

const formats = ["avif", "webp"] as const;
const widths = [480, 800, 1200, 1600];

/** Resizes a Photo with Astro's image processing into modern formats at several widths. */
export async function responsivePhoto(source: ImageMetadata): Promise<ResponsivePhoto> {
  const sizes = [...widths.filter((width) => width < source.width), source.width];
  const sources = await Promise.all(
    formats.map(async (format) => {
      const images = await Promise.all(
        sizes.map((width) => getImage({ src: source, width, format })),
      );
      return {
        type: `image/${format}`,
        srcset: images.map((image, i) => `${image.src} ${sizes[i]}w`).join(", "),
      };
    }),
  );
  const fallback = await getImage({
    src: source,
    width: Math.min(source.width, 800),
    format: "webp",
  });
  return { src: fallback.src, width: source.width, height: source.height, sources };
}
