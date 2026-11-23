export function StepList({ steps }: { steps: string[] }) {
  return (
    <section class="recipe-section" aria-labelledby="steps-heading">
      <h2 id="steps-heading" class="section-title">
        Preparo
      </h2>
      <ol class="plain-list steps">
        {steps.map((step, index) => (
          <li key={index} class="step">
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
