import { useEffect, useState } from "preact/hooks";

export function useTicks() {
  const [ready, setReady] = useState(false);
  const [ticked, setTicked] = useState<ReadonlySet<string>>(new Set());
  useEffect(() => setReady(true), []);
  const toggle = (key: string) =>
    setTicked((current) => {
      const next = new Set(current);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  return { ready, isTicked: (key: string) => ticked.has(key), toggle };
}
