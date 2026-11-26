export type ModelCall = {
  apiKey: string;
  model: string;
  instructions: string;
  input: string;
  schema: object;
};

export type ModelAnswer =
  | { ok: true; text: string }
  | { ok: false; reason: "quota" | "denied" | "unavailable"; detail: string };

type Fetch = (url: string, init: RequestInit) => Promise<Response>;
type Wait = (ms: number) => Promise<void>;

const endpoint = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

/** Waits before each retry while the model is busy (503), about a minute in all. */
export const retryDelays = [5_000, 15_000, 40_000];

const sleep: Wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

type GenerateContent = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { code?: number; status?: string; message?: string };
};

/** One request to Gemini's generateContent with structured output, retried while busy. Never throws. */
export async function askModel(
  call: ModelCall,
  fetchFn: Fetch = fetch,
  wait: Wait = sleep,
): Promise<ModelAnswer> {
  for (let attempt = 0; ; attempt++) {
    const answer = await askOnce(call, fetchFn);
    const busy = !answer.ok && answer.reason === "unavailable" && answer.detail.startsWith("503");
    if (!busy || attempt >= retryDelays.length) return answer;
    await wait(retryDelays[attempt]!);
  }
}

async function askOnce(call: ModelCall, fetchFn: Fetch): Promise<ModelAnswer> {
  let response: Response;
  try {
    response = await fetchFn(endpoint(call.model), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": call.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: call.instructions }] },
        contents: [{ role: "user", parts: [{ text: call.input }] }],
        generationConfig: { responseMimeType: "application/json", responseJsonSchema: call.schema },
      }),
    });
  } catch (error) {
    return { ok: false, reason: "unavailable", detail: String(error) };
  }

  const parsed: unknown = await response.json().catch(() => ({}));
  // Errors can come wrapped in a one-item array.
  const body = (Array.isArray(parsed) ? parsed[0] : parsed) as GenerateContent;
  if (!response.ok || body.error) {
    const status = body.error?.status ?? "";
    const detail = `${response.status} ${status} ${body.error?.message ?? ""}`.trim();
    if (response.status === 429 || status === "RESOURCE_EXHAUSTED")
      return { ok: false, reason: "quota", detail };
    if (response.status === 401 || response.status === 403 || status === "PERMISSION_DENIED")
      return { ok: false, reason: "denied", detail };
    return { ok: false, reason: "unavailable", detail };
  }
  const text = (body.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
  if (!text) return { ok: false, reason: "unavailable", detail: "Empty reply." };
  return { ok: true, text };
}
