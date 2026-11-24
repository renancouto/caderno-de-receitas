import { newestFirst } from "../lib/cook-log";
import { formatDate } from "../lib/format";
import type { Cook } from "../lib/recipe-rules";

export function CookLog({ log }: { log: Cook[] }) {
  return (
    <section class="recipe-section" aria-labelledby="log-heading">
      <h2 id="log-heading" class="section-title">
        Histórico
      </h2>
      <ol class="plain-list cook-log">
        {newestFirst(log).map((cook, index) => (
          <li key={`${cook.date}-${index}`} class="cook">
            <time class="label" dateTime={cook.date}>
              {formatDate(cook.date)}
            </time>
            {cook.note && (
              <p class="cook-note" data-pagefind-body>
                {cook.note}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
