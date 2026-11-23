import type { Ingredient, Recipe } from "../lib/recipe-rules";
import "./RecipePage.css";

const unitLabels = { g: "g", ml: "ml", l: "L", cup: "xícara" } as const;

function formatQuantity(ingredient: Ingredient): string {
  if ("toTaste" in ingredient) return "a gosto";
  const amount = ingredient.quantity.toLocaleString("pt-BR");
  if (!ingredient.unit) return amount;
  const unit = unitLabels[ingredient.unit];
  return `${amount} ${ingredient.unit === "cup" && ingredient.quantity > 1 ? `${unit}s` : unit}`;
}

export function RecipePage({ recipe }: { recipe: Recipe }) {
  return (
    <main class="recipe-page">
      <a href="/">← Todas as receitas</a>
      <h1>{recipe.title}</h1>
      <section aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading">Ingredientes</h2>
        {recipe.ingredients.map((group, index) => (
          <ul key={group.name ?? index}>
            {group.items.map((ingredient) => (
              <li key={ingredient.name} class="ingredient">
                <span>{ingredient.name}</span>
                <span class="quantity">{formatQuantity(ingredient)}</span>
              </li>
            ))}
          </ul>
        ))}
      </section>
      <section aria-labelledby="steps-heading">
        <h2 id="steps-heading">Preparo</h2>
        <ol>
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
