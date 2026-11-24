export type LetterGroup<T> = { letter: string; recipes: T[] };

const collator = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });

function firstLetter(title: string): string {
  return title.trim().charAt(0).normalize("NFD").charAt(0).toLocaleUpperCase("pt-BR");
}

export function byTitle<T extends { title: string }>(recipes: readonly T[]): T[] {
  return [...recipes].sort((a, b) => collator.compare(a.title, b.title));
}

export function letterGroups<T extends { title: string }>(recipes: readonly T[]): LetterGroup<T>[] {
  const groups: LetterGroup<T>[] = [];
  for (const recipe of byTitle(recipes)) {
    const letter = firstLetter(recipe.title);
    const last = groups.at(-1);
    if (last?.letter === letter) last.recipes.push(recipe);
    else groups.push({ letter, recipes: [recipe] });
  }
  return groups;
}

export type Order = "alphabetical" | "rating" | "times-made" | "least-recent";
export type View = { order: Order; tag?: string };
export type ViewInput = View & { slugs?: ReadonlySet<string> };

export const orders: readonly Order[] = ["alphabetical", "rating", "times-made", "least-recent"];

type Sortable = {
  slug: string;
  title: string;
  tags?: string[];
  rating?: number;
  timesMade: number;
  lastMade?: string;
};

export type CatalogueView<T> =
  | { kind: "grouped"; groups: LetterGroup<T>[] }
  | { kind: "flat"; recipes: T[] };

// Each order ranks Recipes by a number (lower first); Recipes without a value rank undefined and go last.
const rank: Record<
  Exclude<Order, "alphabetical">,
  (recipe: Sortable) => number | string | undefined
> = {
  rating: (recipe) => (recipe.rating === undefined ? undefined : -recipe.rating),
  "times-made": (recipe) => (recipe.timesMade === 0 ? undefined : -recipe.timesMade),
  "least-recent": (recipe) => recipe.lastMade,
};

export function catalogueView<T extends Sortable>(
  recipes: readonly T[],
  { order, tag, slugs }: ViewInput,
): CatalogueView<T> {
  const shown = recipes.filter(
    (recipe) => (!tag || recipe.tags?.includes(tag)) && (!slugs || slugs.has(recipe.slug)),
  );
  if (order === "alphabetical") return { kind: "grouped", groups: letterGroups(shown) };
  const key = rank[order];
  const sorted = byTitle(shown).sort((a, b) => {
    const left = key(a);
    const right = key(b);
    if (left === right) return 0;
    if (left === undefined) return 1;
    if (right === undefined) return -1;
    return left < right ? -1 : 1;
  });
  return { kind: "flat", recipes: sorted };
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
