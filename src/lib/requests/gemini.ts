export type ModelCall = {
  apiKey: string;
  model: string;
  instructions: string;
  input: string;
  schema: object;
};

export type ModelAnswer =
  | { ok: true; text: string }
  | { ok: false; reason: "quota" | "unavailable"; detail: string };

type Fetch = (url: string, init: RequestInit) => Promise<Response>;

const endpoint = "https://generativelanguage.googleapis.com/v1beta/interactions";

type Interaction = {
  output_text?: string;
  outputs?: { type?: string; text?: string }[];
  error?: { code?: number; status?: string; message?: string };
};

/** One call to Gemini's Interactions API with structured output. Never throws. */
export async function askModel(call: ModelCall, fetchFn: Fetch = fetch): Promise<ModelAnswer> {
  let response: Response;
  try {
    response = await fetchFn(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": call.apiKey,
        "Api-Revision": "2026-05-20",
      },
      body: JSON.stringify({
        model: call.model,
        system_instruction: call.instructions,
        input: call.input,
        // Free-tier prompts may be read by Google anyway; don't also keep them stored.
        store: false,
        response_format: { type: "text", mime_type: "application/json", schema: call.schema },
      }),
    });
  } catch (error) {
    return { ok: false, reason: "unavailable", detail: String(error) };
  }

  const parsed: unknown = await response.json().catch(() => ({}));
  // Errors can come wrapped in a one-item array.
  const body = (Array.isArray(parsed) ? parsed[0] : parsed) as Interaction;
  if (!response.ok || body.error) {
    const status = body.error?.status ?? "";
    const detail = `${response.status} ${status} ${body.error?.message ?? ""}`.trim();
    const quota = response.status === 429 || status === "RESOURCE_EXHAUSTED";
    return { ok: false, reason: quota ? "quota" : "unavailable", detail };
  }
  const text =
    body.output_text ??
    (body.outputs ?? [])
      .filter((o) => o.type === "text")
      .map((o) => o.text ?? "")
      .join("");
  if (!text) return { ok: false, reason: "unavailable", detail: "Empty reply." };
  return { ok: true, text };
}
