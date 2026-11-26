export type Request = {
  /** The owner's words, without attached images. */
  text: string;
  /** Source links, in order of first appearance. */
  links: string[];
};

// Attachments become Photos (ticket 04); they are never Sources and never sent to the model.
const attachmentPattern =
  /!\[[^\]]*\]\([^)]*\)|<img\b[^>]*>|https:\/\/github\.com\/user-attachments\/\S+/gi;
const urlPattern = /https?:\/\/[^\s<>()[\]"']+/g;

export function readRequest(body: string | null | undefined): Request {
  // Drop lines left empty by a removed attachment, keeping the owner's own blank lines.
  const text = (body ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => !(line.trim() !== "" && line.replace(attachmentPattern, "").trim() === ""))
    .map((line) => line.replace(attachmentPattern, ""))
    .join("\n")
    .trim();
  const links = [
    ...new Set([...text.matchAll(urlPattern)].map(([url]) => url.replace(/[.,;:!?]+$/, ""))),
  ];
  return { text, links };
}

export type RequestPeople = { authorId: string | undefined; actorId: string | undefined };

/** Only the owner may start a Request: both the issue's author and the event's actor, by numeric user ID. */
export function isOwnerRequest({ authorId, actorId }: RequestPeople, ownerId: number): boolean {
  return authorId === String(ownerId) && actorId === String(ownerId);
}
