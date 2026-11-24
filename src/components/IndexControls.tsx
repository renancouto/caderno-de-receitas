import { orders, viewSearch, type Order, type View } from "../lib/catalogue-view";
import "./IndexControls.css";

const orderLabels: Record<Order, string> = {
  alphabetical: "A–Z",
  rating: "Nota",
  "times-made": "Mais feitas",
  "least-recent": "Há mais tempo",
};

type IndexControlsProps = {
  view: View;
  tags: string[];
  search: string;
  onChange: (view: View) => void;
};

export function IndexControls({ view, tags, search, onChange }: IndexControlsProps) {
  const choose = (next: View) => (event: MouseEvent) => {
    event.preventDefault();
    onChange(next);
  };
  return (
    <div class="index-controls">
      <nav class="index-control-row" aria-label="Ordem">
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
        <nav class="index-control-row" aria-label="Etiquetas">
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
          {view.tag && (
            <a
              class="index-control index-control-clear"
              href={viewSearch(search, { order: view.order }) || "?"}
              onClick={choose({ order: view.order })}
            >
              Limpar filtro
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
