import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { askModel } from "./gemini";
import { handleRequest, type RequestContext } from "./handle-request";

const rules = readFileSync("docs/recipe-rules.md", "utf8");
const recorded = (name: string) =>
  readFileSync(new URL(`replies/${name}.json`, import.meta.url), "utf8");

// The model is never called: each test answers with a recorded generateContent reply.
function replyWith(name: string, status = 200) {
  return replySequence([[name, status]]);
}

// Answers each call with the next recorded reply; the last one repeats. Retries don't wait.
function replySequence(replies: [name: string, status: number][]) {
  const sent: { url: string; body: Record<string, unknown> }[] = [];
  const waits: number[] = [];
  const ask: RequestContext["ask"] = (call) =>
    askModel(
      { apiKey: "test-key", ...call },
      async (url, init) => {
        sent.push({ url, body: JSON.parse(String(init.body)) });
        const [name, status] = replies[Math.min(sent.length, replies.length) - 1]!;
        return new Response(recorded(name), { status });
      },
      async (ms) => {
        waits.push(ms);
      },
    );
  return { ask, sent, waits };
}

const context = (ask: RequestContext["ask"], body = "Bolo de fubá\n2 xícaras de fubá\n3 ovos") => ({
  body,
  rules,
  today: "2026-11-26",
  existingFiles: ["carbonara-picante.md"],
  ask,
});

describe("handleRequest", () => {
  it("turns a good reply into a checked Recipe and lists the guessed conversions", async () => {
    const { ask } = replyWith("new-recipe");
    const outcome = await handleRequest(context(ask));
    expect(outcome).toMatchObject({
      kind: "pull-request",
      fileName: "bolo-de-fuba.md",
      title: "Bolo de fubá",
    });
    if (outcome.kind !== "pull-request") return;
    expect(outcome.contents).toMatch(/^---\ntitle: Bolo de fubá\n/);
    expect(outcome.conversionsComment).toContain("- 2 colheres de sopa de manteiga → 30 g");
  });

  it("sends only the Request's text and the rules, with a JSON Schema", async () => {
    const { ask, sent } = replyWith("new-recipe");
    await handleRequest(
      context(
        ask,
        "Bolo https://example.com/bolo\n![foto](https://github.com/user-attachments/assets/x)",
      ),
    );
    expect(sent).toHaveLength(1);
    expect(sent[0]?.url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
    );
    const body = JSON.stringify(sent[0]?.body ?? {});
    expect(body).toContain(JSON.stringify(rules.trim()).slice(1, 200));
    expect(body).toContain("- https://example.com/bolo");
    expect(body).not.toContain("user-attachments");
    expect(sent[0]?.body.generationConfig).toMatchObject({ responseMimeType: "application/json" });
  });

  it("reports a reply that breaks the recipe rules, in Portuguese, with no pull request", async () => {
    const outcome = await handleRequest(context(replyWith("breaks-rules").ask));
    expect(outcome.kind).toBe("failed");
    if (outcome.kind !== "failed") return;
    expect(outcome.comment).toContain("não segue as regras de receita");
    expect(outcome.comment).toContain('"Manteiga" has the unit "colher de sopa"');
  });

  it("reports the free limit running out (429 RESOURCE_EXHAUSTED)", async () => {
    const outcome = await handleRequest(context(replyWith("quota-exceeded", 429).ask));
    expect(outcome).toMatchObject({ kind: "failed" });
    if (outcome.kind !== "failed") return;
    expect(outcome.comment).toContain("limite gratuito do modelo acabou");
  });

  it("retries while the model is busy (503) and uses the reply once it answers", async () => {
    const { ask, sent, waits } = replySequence([
      ["unavailable", 503],
      ["unavailable", 503],
      ["new-recipe", 200],
    ]);
    const outcome = await handleRequest(context(ask));
    expect(outcome.kind).toBe("pull-request");
    expect(sent).toHaveLength(3);
    expect(waits).toEqual([5_000, 15_000]);
  });

  it("reports the model being unavailable after its retries run out", async () => {
    const { ask, sent } = replyWith("unavailable", 503);
    const outcome = await handleRequest(context(ask));
    if (outcome.kind !== "failed") throw new Error("expected a failure");
    expect(outcome.comment).toContain("o modelo não respondeu");
    expect(sent).toHaveLength(4);
  });

  it("reports a refused key (403) without retrying", async () => {
    const { ask, sent } = replyWith("permission-denied", 403);
    const outcome = await handleRequest(context(ask));
    if (outcome.kind !== "failed") throw new Error("expected a failure");
    expect(outcome.comment).toContain("a chave do modelo foi recusada");
    expect(sent).toHaveLength(1);
  });

  it("reports an error sent as a one-item array, with its message", async () => {
    const outcome = await handleRequest(context(replyWith("invalid-key", 400).ask));
    if (outcome.kind !== "failed") throw new Error("expected a failure");
    expect(outcome.comment).toContain("API key not valid");
  });

  it("refuses a file name that is already taken", async () => {
    const outcome = await handleRequest({
      ...context(replyWith("new-recipe").ask),
      existingFiles: ["bolo-de-fuba.md"],
    });
    if (outcome.kind !== "failed") throw new Error("expected a failure");
    expect(outcome.comment).toContain('"bolo-de-fuba.md" already exists');
  });

  it("doesn't call the model for an empty Request", async () => {
    const { ask, sent } = replyWith("new-recipe");
    const outcome = await handleRequest(context(ask, "  "));
    expect(outcome.kind).toBe("failed");
    expect(sent).toHaveLength(0);
  });
});
