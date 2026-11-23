import { url } from "../lib/paths";

export type IndexEntry = { slug: string; title: string };

export function IndexPage({ recipes }: { recipes: IndexEntry[] }) {
  return (
    <main>
      <h1>Caderno de receitas</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.slug}>
            <a href={url(`/recipes/${recipe.slug}`)}>{recipe.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
