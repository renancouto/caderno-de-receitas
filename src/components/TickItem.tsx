import type { ComponentChildren } from "preact";

type TickItemProps = {
  class: string;
  ready: boolean;
  ticked: boolean;
  onToggle: () => void;
  children: ComponentChildren;
};

export function TickItem({ class: className, ready, ticked, onToggle, children }: TickItemProps) {
  return (
    <li class={ticked ? `${className} ${className}-ticked` : className}>
      {ready ? (
        <button
          type="button"
          class={`tick ${className}-tick${ticked ? " tick-struck" : ""}`}
          aria-pressed={ticked}
          onClick={onToggle}
        >
          {children}
        </button>
      ) : (
        <div class={`tick ${className}-tick`}>{children}</div>
      )}
    </li>
  );
}
