import { letterGroups } from "../lib/catalogue-view";
import { formatNumber } from "../lib/format";
import { IndexEntry, type IndexRecipe } from "./IndexEntry";
import "./IndexPage.css";

export type { IndexRecipe };

export function IndexPage({ recipes }: { recipes: IndexRecipe[] }) {
  const groups = letterGroups(recipes);
  return (
    <main class="index-page">
      <header class="index-header">
        <p class="index-site-name">Caderno de receitas</p>
        <h1 class="index-title">Índice</h1>
        <p class="index-count">Receitas · {formatNumber(recipes.length)}</p>
        <nav class="index-letters" aria-label="Letras">
          {groups.map((group) => (
            <a key={group.letter} class="index-letter-link" href={`#letter-${group.letter}`}>
              {group.letter}
            </a>
          ))}
        </nav>
      </header>
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
                <IndexEntry key={recipe.slug} recipe={recipe} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
