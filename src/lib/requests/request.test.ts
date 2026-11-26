import { describe, expect, it } from "vitest";
import { isOwnerRequest, readRequest } from "./request";

describe("readRequest", () => {
  it("keeps the owner's text and finds no Sources in an Original Recipe", () => {
    expect(readRequest("Bolo de fubá\n\n2 xícaras de fubá\n3 ovos")).toEqual({
      text: "Bolo de fubá\n\n2 xícaras de fubá\n3 ovos",
      links: [],
    });
  });

  it("takes each link once as a Source, without trailing punctuation", () => {
    const request = readRequest(
      "Adaptar https://panelinha.com.br/receita/bolo. Ver também (https://example.com/a?b=1), e https://panelinha.com.br/receita/bolo",
    );
    expect(request.links).toEqual([
      "https://panelinha.com.br/receita/bolo",
      "https://example.com/a?b=1",
    ]);
  });

  it("takes the address of a Markdown link", () => {
    expect(readRequest("[receita](https://example.com/x)").links).toEqual([
      "https://example.com/x",
    ]);
  });

  it("leaves attached images out of the text and the Sources", () => {
    const request = readRequest(
      'Pão\n![IMG_1](https://github.com/user-attachments/assets/abc)\n<img alt="x" src="https://github.com/user-attachments/assets/def" />\nhttps://github.com/user-attachments/assets/ghi\n1 kg de farinha',
    );
    expect(request).toEqual({ text: "Pão\n1 kg de farinha", links: [] });
  });

  it("treats an empty issue as empty text", () => {
    expect(readRequest(null)).toEqual({ text: "", links: [] });
  });
});

describe("isOwnerRequest", () => {
  it("accepts a Request opened and sent by the owner", () => {
    expect(isOwnerRequest({ authorId: "230893", actorId: "230893" }, 230893)).toBe(true);
  });

  it("refuses when the author or the actor is someone else", () => {
    expect(isOwnerRequest({ authorId: "1", actorId: "230893" }, 230893)).toBe(false);
    expect(isOwnerRequest({ authorId: "230893", actorId: "1" }, 230893)).toBe(false);
  });

  it("refuses missing IDs", () => {
    expect(isOwnerRequest({ authorId: undefined, actorId: "230893" }, 230893)).toBe(false);
    expect(isOwnerRequest({ authorId: "", actorId: "" }, 230893)).toBe(false);
  });
});
