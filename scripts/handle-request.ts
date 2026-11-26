// Run by .github/workflows/requests.yml. Reads the Request from the environment (never from the
// command line), writes the Recipe into recipes/ and the comments into $RUNNER_TEMP, and sets outputs.
import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pullRequestBody } from "../src/lib/requests/comments.ts";
import { geminiAsker, handleRequest } from "../src/lib/requests/handle-request.ts";
import { isOwnerRequest } from "../src/lib/requests/request.ts";

const ownerId = 230893;
const env = process.env;

if (!isOwnerRequest({ authorId: env.AUTHOR_ID, actorId: env.ACTOR_ID }, ownerId)) {
  console.error("Not the owner's Request; stopping.");
  process.exit(1);
}

const outDir = env.RUNNER_TEMP ?? ".";
const output = (name: string, value: string) => {
  if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `${name}=${value}\n`);
  console.log(`${name}=${value}`);
};

const outcome = await handleRequest({
  body: env.REQUEST_BODY ?? "",
  rules: readFileSync("docs/recipe-rules.md", "utf8"),
  today: new Date().toISOString().slice(0, 10),
  existingFiles: existsSync("recipes") ? readdirSync("recipes") : [],
  ask: geminiAsker(env.GEMINI_API_KEY ?? ""),
});

if (outcome.kind === "failed") {
  writeFileSync(join(outDir, "request-comment.md"), outcome.comment);
  output("outcome", "failed");
} else {
  writeFileSync(join("recipes", outcome.fileName), outcome.contents);
  writeFileSync(join(outDir, "conversions-comment.md"), outcome.conversionsComment);
  writeFileSync(join(outDir, "pr-body.md"), pullRequestBody(Number(env.ISSUE_NUMBER)));
  // The title comes from the model; keep it on one line for the output file.
  writeFileSync(join(outDir, "recipe-title.txt"), outcome.title.replace(/\s+/g, " "));
  output("outcome", "pull-request");
  output("file", `recipes/${outcome.fileName}`);
}
