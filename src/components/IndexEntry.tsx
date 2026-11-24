import { formatMinutes, formatTimesMade } from "../lib/format";
import { url } from "../lib/paths";
import "./IndexEntry.css";

export type IndexRecipe = {
  slug: string;
  title: string;
  rating?: number;
  totalMinutes?: number;
  timesMade: number;
};

function Rating({ rating }: { rating?: number }) {
  return (
    <span class="index-entry-value">
      <span aria-hidden="true">{rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "—"}</span>
      <span class="visually-hidden">{rating ? `Nota ${rating} de 5` : "Sem nota"}</span>
    </span>
  );
}

export function IndexEntry({ recipe }: { recipe: IndexRecipe }) {
  const details = [
    recipe.totalMinutes === undefined ? undefined : formatMinutes(recipe.totalMinutes),
    formatTimesMade(recipe.timesMade),
  ].filter(Boolean);
  return (
    <li class="index-entry">
      <a class="index-entry-link" href={url(`/recipes/${recipe.slug}`)}>
        <span class="index-entry-title">{recipe.title}</span>
        <span class="index-entry-leader" aria-hidden="true" />
        <Rating rating={recipe.rating} />
      </a>
      <p class="index-entry-details">{details.join(" · ")}</p>
    </li>
  );
}
