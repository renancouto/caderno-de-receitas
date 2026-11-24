import type { ComponentChildren } from "preact";
import type { ResponsivePhoto } from "../lib/responsive-photo";
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
  photo?: ResponsivePhoto;
  // Astro passes hydrated islands for the tickable lists through these slots.
  ingredients?: ComponentChildren;
  steps?: ComponentChildren;
};

export function RecipePage({ recipe, photo, ingredients, steps }: RecipePageProps) {
  return (
    <main>
      <header class={photo ? "recipe-header has-photo" : "recipe-header"}>
        {photo && (
          <picture>
            {photo.sources.map((source) => (
              <source key={source.type} type={source.type} srcset={source.srcset} sizes="100vw" />
            ))}
            <img
              class="recipe-photo"
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt=""
              fetchpriority="high"
            />
          </picture>
        )}
        <div class="recipe-wide">
          <a class="recipe-back" href={url("/")}>
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
