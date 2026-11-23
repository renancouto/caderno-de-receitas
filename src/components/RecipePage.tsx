import type { ComponentChildren } from "preact";
import { url } from "../lib/paths";
import type { Recipe } from "../lib/recipe-rules";
import { CookLog } from "./CookLog";
import { FactsStrip } from "./FactsStrip";
import { IngredientList } from "./IngredientList";
import { RecipeNotes } from "./RecipeNotes";
import { SourceCredit } from "./SourceCredit";
import { StepList } from "./StepList";
import "./RecipePage.css";

type RecipePageProps = {
  recipe: Recipe;
  // Astro passes hydrated islands for the tickable lists through these slots.
  ingredients?: ComponentChildren;
  steps?: ComponentChildren;
};

export function RecipePage({ recipe, ingredients, steps }: RecipePageProps) {
  return (
    <main>
      <header class="recipe-header">
        <div class="recipe-wide">
          <a class="link label" href={url("/")}>
            ← Todas as receitas
          </a>
          <h1 class="recipe-title">{recipe.title}</h1>
          {recipe.tags && recipe.tags.length > 0 && (
            <ul class="plain-list recipe-tags" aria-label="Tags">
              {recipe.tags.map((tag) => (
                <li key={tag} class="label recipe-tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <div class="recipe-wide">
        <FactsStrip recipe={recipe} />
        <div class="recipe-columns">
          {ingredients ?? <IngredientList groups={recipe.ingredients} />}
          <div>
            {steps ?? <StepList steps={recipe.steps} />}
            {recipe.notes && <RecipeNotes notes={recipe.notes} />}
          </div>
        </div>
        {recipe.log && recipe.log.length > 0 && <CookLog log={recipe.log} />}
        {recipe.sources && recipe.sources.length > 0 && <SourceCredit sources={recipe.sources} />}
      </div>
    </main>
  );
}
