import { formatMinutes, formatTimesMade } from "../lib/format";
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

function Rating({ rating }: { rating?: number }) {
  return (
    <span class={rating ? "index-entry-rating" : "index-entry-rating-none"}>
      <span aria-hidden="true">{rating ? `${rating}/5` : "–/5"}</span>
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
        <Rating rating={recipe.rating} />
      </a>
      <p class="index-entry-details">{details.join(" · ")}</p>
    </li>
  );
}
