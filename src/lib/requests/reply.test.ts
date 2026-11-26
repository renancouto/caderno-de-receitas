import { describe, expect, it } from "vitest";
import { readReply } from "./reply";

const file = (extra = "") => `---
title: Pão
${extra}ingredients:
  - items:
      - name: Farinha
        quantity: 500
        unit: g
---

## Preparo

1. Asse.`;

const reply = (contents: string, fileName = "pao.md") =>
  JSON.stringify({ fileName, contents, conversions: [" 1 lb → 454 g ", ""] });

describe("readReply", () => {
  it("returns the file, its title and the non-empty conversions", () => {
    expect(readReply(reply(file()), [])).toEqual({
      ok: true,
      recipe: {
        fileName: "pao.md",
        contents: `${file()}\n`,
        title: "Pão",
        conversions: ["1 lb → 454 g"],
      },
    });
  });

  it("refuses a reply that isn't JSON", () => {
    expect(readReply("Aqui está a receita", [])).toMatchObject({ ok: false });
  });

  it("refuses a file name outside the recipes folder", () => {
    expect(readReply(reply(file(), "../ci.md"), [])).toMatchObject({ ok: false });
  });

  it("refuses a rating, a log or Photos in a new Recipe", () => {
    expect(readReply(reply(file("rating: 5\n")), [])).toMatchObject({ ok: false });
    expect(readReply(reply(file("log:\n  - date: 2026-11-26\n")), [])).toMatchObject({ ok: false });
    expect(readReply(reply(file("photos: [pao/capa.jpg]\n")), [])).toMatchObject({ ok: false });
  });
});
