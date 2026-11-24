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
