export function RecipeNotes({ notes }: { notes: string }) {
  return (
    <section class="notes" aria-labelledby="notes-heading">
      <h2 id="notes-heading" class="label notes-label">
        Notas
      </h2>
      {notes
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => (
          <p key={paragraph} class="notes-text">
            {paragraph}
          </p>
        ))}
    </section>
  );
}
