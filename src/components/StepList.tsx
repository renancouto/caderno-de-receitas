import type { ResponsivePhoto } from "../lib/responsive-photo";
import { TickItem } from "./TickItem";
import { useTicks } from "./useTicks";
import "./RecipeLists.css";

export type StepView = { text: string; photo?: ResponsivePhoto };

// The Step text describes its photo, so the image itself has empty alternative text.
function StepPhoto({ photo, ticked }: { photo: ResponsivePhoto; ticked: boolean }) {
  return (
    <picture data-pagefind-ignore>
      {photo.sources.map((source) => (
        <source
          key={source.type}
          type={source.type}
          srcset={source.srcset}
          sizes="(min-width: 52rem) 30rem, 100vw"
        />
      ))}
      <img
        class={ticked ? "step-photo step-photo-ticked" : "step-photo"}
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt=""
        loading="lazy"
      />
    </picture>
  );
}

export function StepList({ steps }: { steps: StepView[] }) {
  const { ready, isTicked, toggle } = useTicks();
  return (
    <section class="recipe-section" aria-labelledby="steps-heading">
      <h2 id="steps-heading" class="section-title">
        Preparo
      </h2>
      <ol class="plain-list steps" data-pagefind-body>
        {steps.map((step, index) => {
          const ticked = isTicked(String(index));
          return (
            <TickItem
              key={index}
              class="step"
              ready={ready}
              ticked={ticked}
              onToggle={() => toggle(String(index))}
            >
              {step.photo ? (
                <>
                  <StepPhoto photo={step.photo} ticked={ticked} />
                  <span class="step-text">{step.text}</span>
                </>
              ) : (
                step.text
              )}
            </TickItem>
          );
        })}
      </ol>
    </section>
  );
}
