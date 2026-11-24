const collator = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });

export function byTitle<T extends { title: string }>(recipes: readonly T[]): T[] {
  return [...recipes].sort((a, b) => collator.compare(a.title, b.title));
}

export type Order = "alphabetical" | "rating" | "times-made" | "least-recent" | "quickest";
export type View = { order: Order; tag?: string };
export type ViewInput = View & { slugs?: ReadonlySet<string> };

// Alphabetical is the default and has no control of its own.
export const orders: readonly Exclude<Order, "alphabetical">[] = [
  "rating",
  "times-made",
  "least-recent",
  "quickest",
];

type Sortable = {
  slug: string;
  title: string;
  tags?: string[];
  rating?: number;
  totalMinutes?: number;
  timesMade: number;
  lastMade?: string;
};

// Each order ranks Recipes by a number (lower first); Recipes without a value rank undefined and go last.
const rank: Record<
  Exclude<Order, "alphabetical">,
  (recipe: Sortable) => number | string | undefined
> = {
  rating: (recipe) => (recipe.rating === undefined ? undefined : -recipe.rating),
  "times-made": (recipe) => (recipe.timesMade === 0 ? undefined : -recipe.timesMade),
  "least-recent": (recipe) => recipe.lastMade,
  quickest: (recipe) => recipe.totalMinutes,
};

export function catalogueView<T extends Sortable>(
  recipes: readonly T[],
  { order, tag, slugs }: ViewInput,
): T[] {
  const shown = recipes.filter(
    (recipe) => (!tag || recipe.tags?.includes(tag)) && (!slugs || slugs.has(recipe.slug)),
  );
  if (order === "alphabetical") return byTitle(shown);
  const key = rank[order];
  return byTitle(shown).sort((a, b) => {
    const left = key(a);
    const right = key(b);
    if (left === right) return 0;
    if (left === undefined) return 1;
    if (right === undefined) return -1;
    return left < right ? -1 : 1;
  });
}

export function allTags(recipes: readonly { tags?: string[] }[]): string[] {
  return [...new Set(recipes.flatMap((recipe) => recipe.tags ?? []))].sort(collator.compare);
}

export function parseView(search: string): View {
  const params = new URLSearchParams(search);
  const order = orders.find((candidate) => candidate === params.get("order")) ?? "alphabetical";
  const tag = params.get("tag");
  return tag ? { order, tag } : { order };
}

// Other parameters (such as the search text) are kept untouched.
export function viewSearch(currentSearch: string, { order, tag }: View): string {
  const params = new URLSearchParams(currentSearch);
  params.delete("order");
  params.delete("tag");
  if (order !== "alphabetical") params.set("order", order);
  if (tag) params.set("tag", tag);
  const text = params.toString();
  return text ? `?${text}` : "";
}

export function parseQuery(search: string): string {
  return new URLSearchParams(search).get("q") ?? "";
}

export function queryParam(currentSearch: string, query: string): string {
  const params = new URLSearchParams(currentSearch);
  params.delete("q");
  if (query.trim()) params.set("q", query);
  const text = params.toString();
  return text ? `?${text}` : "";
}

export function slugFromUrl(url: string): string {
  return (
    url
      .replace(/\/$/, "")
      .replace(/\.html$/, "")
      .split("/")
      .at(-1) ?? ""
  );
}
