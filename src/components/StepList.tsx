import { TickItem } from "./TickItem";
import { useTicks } from "./useTicks";
import "./RecipeLists.css";

export function StepList({ steps }: { steps: string[] }) {
  const { ready, isTicked, toggle } = useTicks();
  return (
    <section class="recipe-section" aria-labelledby="steps-heading">
      <h2 id="steps-heading" class="section-title">
        Preparo
      </h2>
      <ol class="plain-list steps" data-pagefind-body>
        {steps.map((step, index) => (
          <TickItem
            key={index}
            class="step"
            ready={ready}
            ticked={isTicked(String(index))}
            onToggle={() => toggle(String(index))}
          >
            {step}
          </TickItem>
        ))}
      </ol>
    </section>
  );
}
