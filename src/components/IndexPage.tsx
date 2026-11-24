import { useEffect, useState } from "preact/hooks";
import { allTags, catalogueView, parseView, viewSearch, type View } from "../lib/catalogue-view";
import { formatNumber } from "../lib/format";
import { IndexControls } from "./IndexControls";
import { IndexEntry, type IndexRecipe } from "./IndexEntry";
import "./IndexPage.css";

export type { IndexRecipe };

type IndexPageProps = {
  recipes: IndexRecipe[];
  // Search (ticket 10) passes the Recipes that match here; the view narrows to them.
  slugs?: ReadonlySet<string>;
};

export function IndexPage({ recipes, slugs }: IndexPageProps) {
  // The server renders the default view; the island reads the page address once it runs.
  const [view, setView] = useState<View>({ order: "alphabetical" });
  const [search, setSearch] = useState("");
  useEffect(() => {
    const read = () => {
      setSearch(window.location.search);
      setView(parseView(window.location.search));
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  const change = (next: View) => {
    const nextSearch = viewSearch(search, next);
    window.history.pushState(null, "", `${window.location.pathname}${nextSearch}`);
    setSearch(nextSearch);
    setView(next);
  };
  const shown = catalogueView(recipes, { ...view, slugs });
  const count =
    shown.kind === "grouped"
      ? shown.groups.reduce((total, group) => total + group.recipes.length, 0)
      : shown.recipes.length;
  const groups = shown.kind === "grouped" ? shown.groups : [];
  return (
    <main class="index-page">
      <header class="index-header">
        <p class="index-site-name">Caderno de receitas</p>
        <h1 class="index-title">Índice</h1>
        <p class="index-count">Receitas · {formatNumber(count)}</p>
        <IndexControls view={view} tags={allTags(recipes)} search={search} onChange={change} />
        {shown.kind === "grouped" && (
          <nav class="index-letters" aria-label="Letras">
            {groups.map((group) => (
              <a key={group.letter} class="index-letter-link" href={`#letter-${group.letter}`}>
                {group.letter}
              </a>
            ))}
          </nav>
        )}
      </header>
      {shown.kind === "grouped" ? (
        <div class="index-columns">
          {groups.map((group) => (
            <section
              key={group.letter}
              class="index-group"
              id={`letter-${group.letter}`}
              aria-labelledby={`letter-${group.letter}-title`}
            >
              <h2 class="index-group-letter" id={`letter-${group.letter}-title`}>
                {group.letter}
              </h2>
              <ul class="plain-list">
                {group.recipes.map((recipe) => (
                  <IndexEntry key={recipe.slug} recipe={recipe} order={view.order} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul class="plain-list index-flat">
          {shown.recipes.map((recipe) => (
            <IndexEntry key={recipe.slug} recipe={recipe} order={view.order} />
          ))}
        </ul>
      )}
      {count === 0 && <p class="index-empty">Nenhuma receita.</p>}
    </main>
  );
}
