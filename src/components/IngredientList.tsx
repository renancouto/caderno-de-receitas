import { formatQuantity } from "../lib/format";
import type { IngredientGroup } from "../lib/recipe-rules";

export function IngredientList({ groups }: { groups: IngredientGroup[] }) {
  return (
    <section class="recipe-section" aria-labelledby="ingredients-heading">
      <h2 id="ingredients-heading" class="section-title">
        Ingredientes
      </h2>
      {groups.map((group, index) => (
        <div key={group.name ?? index} class="ingredient-group">
          {group.name && <h3 class="ingredient-group-title">{group.name}</h3>}
          <ul class="plain-list">
            {group.items.map((ingredient) => (
              <li key={ingredient.name} class="ingredient">
                <span>{ingredient.name}</span>
                <span class="quantity">{formatQuantity(ingredient)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
