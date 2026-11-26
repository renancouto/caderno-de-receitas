import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { askModel } from "./gemini";
import { handleRequest, type RequestContext } from "./handle-request";

const rules = readFileSync("docs/recipe-rules.md", "utf8");
const recorded = (name: string) =>
  readFileSync(new URL(`replies/${name}.json`, import.meta.url), "utf8");

// The model is never called: each test answers with a recorded Interactions API reply.
function replyWith(name: string, status = 200) {
  const sent: { url: string; body: Record<string, unknown> }[] = [];
  const ask: RequestContext["ask"] = (call) =>
    askModel({ apiKey: "test-key", ...call }, async (url, init) => {
      sent.push({ url, body: JSON.parse(String(init.body)) });
      return new Response(recorded(name), { status });
    });
  return { ask, sent };
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
    const body = sent[0]?.body ?? {};
    expect(body.model).toBe("gemini-3.8-flash");
    expect(body.system_instruction).toContain(rules.trim());
    expect(body.input).toContain("- https://example.com/bolo");
    expect(JSON.stringify(body)).not.toContain("user-attachments");
    expect(body.response_format).toMatchObject({ mime_type: "application/json" });
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

  it("reports the model being unavailable", async () => {
    const outcome = await handleRequest(context(replyWith("unavailable", 503).ask));
    if (outcome.kind !== "failed") throw new Error("expected a failure");
    expect(outcome.comment).toContain("o modelo não respondeu");
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
