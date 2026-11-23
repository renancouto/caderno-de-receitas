import { cookStats } from "../lib/cook-log";
import { formatDate, formatMinutes, formatNumber } from "../lib/format";
import type { Recipe } from "../lib/recipe-rules";

function Fact({ label, children }: { label: string; children: preact.ComponentChildren }) {
  return (
    <div class="fact">
      <dt class="fact-label">{label}</dt>
      <dd class="fact-value">{children}</dd>
    </div>
  );
}

function Rating({ rating }: { rating: number }) {
  return (
    <>
      <span aria-hidden="true" class="rating">
        {"★".repeat(rating) + "☆".repeat(5 - rating)}
      </span>
      <span class="visually-hidden">{rating} de 5</span>
    </>
  );
}

export function FactsStrip({ recipe }: { recipe: Recipe }) {
  const { timesMade, lastMade } = cookStats(recipe.log);
  return (
    <dl class="facts">
      <Fact label="Nota">{recipe.rating ? <Rating rating={recipe.rating} /> : "Sem nota"}</Fact>
      <Fact label="Vezes feita">{timesMade ? formatNumber(timesMade) : "Nunca feita"}</Fact>
      {lastMade && (
        <Fact label="Última">
          <time dateTime={lastMade}>{formatDate(lastMade)}</time>
        </Fact>
      )}
      {recipe.totalMinutes && <Fact label="Tempo">{formatMinutes(recipe.totalMinutes)}</Fact>}
      {recipe.servings && <Fact label="Porções">{formatNumber(recipe.servings)}</Fact>}
    </dl>
  );
}
