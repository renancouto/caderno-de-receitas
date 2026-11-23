import { formatQuantity } from "../lib/format";
import type { IngredientGroup } from "../lib/recipe-rules";
import { TickItem } from "./TickItem";
import { useTicks } from "./useTicks";
import "./RecipeLists.css";

export function IngredientList({ groups }: { groups: IngredientGroup[] }) {
  const { ready, isTicked, toggle } = useTicks();
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
              <TickItem
                key={ingredient.name}
                class="ingredient"
                ready={ready}
                ticked={isTicked(ingredient.name)}
                onToggle={() => toggle(ingredient.name)}
              >
                <span>{ingredient.name}</span>
                <span class={isTicked(ingredient.name) ? "quantity quantity-ticked" : "quantity"}>
                  {formatQuantity(ingredient)}
                </span>
              </TickItem>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
