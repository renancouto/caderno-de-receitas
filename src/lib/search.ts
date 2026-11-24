import { slugFromUrl } from "./catalogue-view";
import { url } from "./paths";

export type RecipeSearch = (query: string) => Promise<ReadonlySet<string>>;

type Pagefind = {
  search: (query: string) => Promise<{ results: { data: () => Promise<{ url: string }> }[] }>;
};

let pagefind: Promise<Pagefind> | undefined;

// Pagefind writes its files next to the built pages, so the script is loaded from the site's base path.
export const searchWithPagefind: RecipeSearch = async (query) => {
  pagefind ??= import(/* @vite-ignore */ url("/pagefind/pagefind.js"));
  const { results } = await (await pagefind).search(query);
  const pages = await Promise.all(results.map((result) => result.data()));
  return new Set(pages.map((page) => slugFromUrl(page.url)));
};
