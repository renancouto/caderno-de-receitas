import { orders, viewSearch, type Order, type View } from "../lib/catalogue-view";
import "./IndexControls.css";

const orderLabels: Record<Exclude<Order, "alphabetical">, string> = {
  rating: "Nota",
  "times-made": "Mais feitas",
  "least-recent": "Há mais tempo",
  quickest: "Mais rápidas",
};

type IndexControlsProps = {
  view: View;
  tags: string[];
  search: string;
  query: string;
  onQuery: (query: string) => void;
  onChange: (view: View) => void;
  onClear: () => void;
};

export function IndexControls({
  view,
  tags,
  search,
  query,
  onQuery,
  onChange,
  onClear,
}: IndexControlsProps) {
  const choose = (next: View) => (event: MouseEvent) => {
    event.preventDefault();
    onChange(next);
  };
  const active = view.order !== "alphabetical" || view.tag || query.trim();
  return (
    <div class="index-controls">
      <input
        class="index-search"
        type="search"
        name="q"
        aria-label="Buscar receitas"
        placeholder="Buscar receitas"
        autocomplete="off"
        value={query}
        onInput={(event) => onQuery(event.currentTarget.value)}
      />
      <div class="index-control-groups">
        <nav class="index-control-group" aria-label="Ordem">
          <span class="index-control-label">Ordenar por:</span>
          {orders.map((order) => (
            <a
              key={order}
              class="index-control"
              href={viewSearch(search, { ...view, order }) || "?"}
              aria-current={view.order === order ? "true" : undefined}
              onClick={choose({ ...view, order })}
            >
              {orderLabels[order]}
            </a>
          ))}
        </nav>
        {tags.length > 0 && (
          <nav class="index-control-group" aria-label="Etiquetas">
            <span class="index-control-label">Tags:</span>
            {tags.map((tag) => (
              <a
                key={tag}
                class="index-control"
                href={viewSearch(search, { ...view, tag }) || "?"}
                aria-current={view.tag === tag ? "true" : undefined}
                onClick={choose({ ...view, tag })}
              >
                {tag}
              </a>
            ))}
          </nav>
        )}
        {active && (
          <a
            class="index-control-clear"
            href="?"
            onClick={(event) => {
              event.preventDefault();
              onClear();
            }}
          >
            Limpar
          </a>
        )}
      </div>
    </div>
  );
}
