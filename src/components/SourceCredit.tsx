import { sourceName } from "../lib/format";

export function SourceCredit({ sources }: { sources: string[] }) {
  return (
    <p class="label source-credit">
      Adaptada de{" "}
      {sources.map((source, index) => (
        <>
          {index > 0 && (index === sources.length - 1 ? " e " : ", ")}
          <a class="link" href={source}>
            {sourceName(source)}
          </a>
        </>
      ))}
    </p>
  );
}
