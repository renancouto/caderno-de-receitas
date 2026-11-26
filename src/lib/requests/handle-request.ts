import { conversionsComment, failureComment } from "./comments.ts";
import { askModel, type ModelAnswer } from "./gemini.ts";
import { buildInput, buildInstructions, model, replySchema } from "./instructions.ts";
import { readReply } from "./reply.ts";
import { readRequest } from "./request.ts";

export type RequestContext = {
  body: string | null;
  rules: string;
  today: string;
  existingFiles: string[];
  /** Calls the model; tests pass recorded replies. */
  ask: (call: {
    instructions: string;
    input: string;
    schema: object;
    model: string;
  }) => Promise<ModelAnswer>;
};

export type Outcome =
  | {
      kind: "pull-request";
      fileName: string;
      contents: string;
      title: string;
      conversionsComment: string;
    }
  | { kind: "failed"; comment: string };

/** Everything between the owner's Request and a checked Recipe file (or a comment saying why not). */
export async function handleRequest(context: RequestContext): Promise<Outcome> {
  const request = readRequest(context.body);
  if (!request.text) return { kind: "failed", comment: failureComment({ kind: "empty" }) };

  const answer = await context.ask({
    model,
    instructions: buildInstructions(context),
    input: buildInput(request),
    schema: replySchema,
  });
  if (!answer.ok) {
    return {
      kind: "failed",
      comment: failureComment({ kind: answer.reason, detail: answer.detail }),
    };
  }

  const reply = readReply(answer.text, context.existingFiles);
  if (!reply.ok) {
    return { kind: "failed", comment: failureComment({ kind: "rules", problems: reply.problems }) };
  }
  return {
    kind: "pull-request",
    fileName: reply.recipe.fileName,
    contents: reply.recipe.contents,
    title: reply.recipe.title,
    conversionsComment: conversionsComment(reply.recipe.conversions),
  };
}

export const geminiAsker =
  (apiKey: string): RequestContext["ask"] =>
  (call) =>
    askModel({ apiKey, ...call });
