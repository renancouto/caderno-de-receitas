import type { Order } from "../lib/catalogue-view";
import { formatDate, formatMinutes, formatNumber, formatTimesMade } from "../lib/format";
import { url } from "../lib/paths";
import "./IndexEntry.css";

export type IndexRecipe = {
  slug: string;
  title: string;
  rating?: number;
  totalMinutes?: number;
  timesMade: number;
  lastMade?: string;
  tags?: string[];
};

function timesMadeValue(recipe: IndexRecipe): string {
  return recipe.timesMade === 0 ? "—" : `${formatNumber(recipe.timesMade)}×`;
}

function lastMadeValue(recipe: IndexRecipe): string {
  return recipe.lastMade ? formatDate(recipe.lastMade) : "—";
}

function RatingValue({ rating }: { rating?: number }) {
  return (
    <span class="index-entry-value">
      <span aria-hidden="true">{rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "—"}</span>
      <span class="visually-hidden">{rating ? `Nota ${rating} de 5` : "Sem nota"}</span>
    </span>
  );
}

function Value({ recipe, order }: { recipe: IndexRecipe; order: Order }) {
  if (order === "times-made")
    return <span class="index-entry-value">{timesMadeValue(recipe)}</span>;
  if (order === "least-recent")
    return <span class="index-entry-value">{lastMadeValue(recipe)}</span>;
  return <RatingValue rating={recipe.rating} />;
}

export function IndexEntry({
  recipe,
  order = "alphabetical",
}: {
  recipe: IndexRecipe;
  order?: Order;
}) {
  const details = [
    recipe.totalMinutes === undefined ? undefined : formatMinutes(recipe.totalMinutes),
    formatTimesMade(recipe.timesMade),
  ].filter(Boolean);
  return (
    <li class="index-entry">
      <a class="index-entry-link" href={url(`/recipes/${recipe.slug}`)}>
        <span class="index-entry-title">{recipe.title}</span>
        <span class="index-entry-leader" aria-hidden="true" />
        <Value recipe={recipe} order={order} />
      </a>
      <p class="index-entry-details">{details.join(" · ")}</p>
    </li>
  );
}
