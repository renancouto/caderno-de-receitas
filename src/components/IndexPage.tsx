import { useEffect, useState } from "preact/hooks";
import {
  allTags,
  catalogueView,
  parseQuery,
  parseView,
  queryParam,
  viewSearch,
  type View,
} from "../lib/catalogue-view";
import { formatNumber } from "../lib/format";
import { searchWithPagefind, type RecipeSearch } from "../lib/search";
import { IndexControls } from "./IndexControls";
import { IndexEntry, type IndexRecipe } from "./IndexEntry";
import "./IndexPage.css";

export type { IndexRecipe };

type IndexPageProps = {
  recipes: IndexRecipe[];
  // Finds the slugs of the Recipes matching a text; stories replace it with a stub.
  search?: RecipeSearch;
};

export function IndexPage({ recipes, search: find = searchWithPagefind }: IndexPageProps) {
  // The server renders the default view; the island reads the page address once it runs.
  const [view, setView] = useState<View>({ order: "alphabetical" });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [slugs, setSlugs] = useState<ReadonlySet<string>>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const read = () => {
      setSearch(window.location.search);
      setView(parseView(window.location.search));
      setQuery(parseQuery(window.location.search));
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  useEffect(() => {
    if (!query.trim()) {
      setSlugs(undefined);
      setFailed(false);
      return;
    }
    let current = true;
    find(query).then(
      (found) => {
        if (!current) return;
        setSlugs(found);
        setFailed(false);
      },
      () => current && setFailed(true),
    );
    return () => {
      current = false;
    };
  }, [query, find]);
  const type = (text: string) => {
    const nextSearch = queryParam(search, text);
    window.history.replaceState(null, "", `${window.location.pathname}${nextSearch}`);
    setSearch(nextSearch);
    setQuery(text);
  };
  const change = (next: View) => {
    const nextSearch = viewSearch(search, next);
    window.history.pushState(null, "", `${window.location.pathname}${nextSearch}`);
    setSearch(nextSearch);
    setView(next);
  };
  const clear = () => {
    window.history.pushState(null, "", window.location.pathname);
    setSearch("");
    setQuery("");
    setView({ order: "alphabetical" });
  };
  const shown = catalogueView(recipes, { ...view, slugs });
  const count = shown.length;
  return (
    <main class="index-page">
      <header class="index-header">
        <h1 class="index-title">Minhas receitas</h1>
        <p class="index-section">
          Índice · <span class="index-count">{formatNumber(count)}</span>
        </p>
        <IndexControls
          view={view}
          tags={allTags(recipes)}
          search={search}
          query={query}
          onQuery={type}
          onChange={change}
          onClear={clear}
        />
      </header>
      <ul class="plain-list index-list">
        {shown.map((recipe) => (
          <IndexEntry key={recipe.slug} recipe={recipe} />
        ))}
      </ul>
      {failed && <p class="index-empty">A busca não está disponível.</p>}
      {!failed && count === 0 && (
        <p class="index-empty">
          {query.trim() ? "Nenhuma receita encontrada." : "Nenhuma receita."}
        </p>
      )}
    </main>
  );
}
