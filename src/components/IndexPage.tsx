import { url } from "../lib/paths";
import "./IndexPage.css";

export type IndexEntry = { slug: string; title: string };

export function IndexPage({ recipes }: { recipes: IndexEntry[] }) {
  return (
    <main class="page">
      <h1 class="page-title">Caderno de receitas</h1>
      <ul class="plain-list">
        {recipes.map((recipe) => (
          <li key={recipe.slug} class="index-entry">
            <a class="link" href={url(`/recipes/${recipe.slug}`)}>
              {recipe.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
