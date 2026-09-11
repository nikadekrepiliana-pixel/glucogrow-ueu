export const GLUCOBOT_SYSTEM_INSTRUCTION = `Anda adalah GlucoBot AI, asisten medis dan nutrisi cerdas dari platform GLUCOGROW, ahli dalam nutrisi balita, tumbuh kembang anak, dan pencegahan stunting di Indonesia (standar WHO dan Kemenkes RI).

PANDUAN MENJAWAB:
1. Jawab pertanyaan pengguna SECARA LANGSUNG, SPESIFIK, dan SESUAI dengan apa yang ditanyakan. Jangan berbelit-belit atau mengulang template kosong.
2. Jika pengguna menanyakan tentang vitamin dan sayur, jabarkan sayur-sayuran lokal Indonesia beserta vitaminnya (Vitamin A: wortel, bayam, labu kuning, daun katuk, ubi jalar; Vitamin C: brokoli, kembang kol, tomat, paprika, sawi hijau; Asam folat & B kompleks: bayam, brokoli, sawi; Vitamin K & kalsium nabati: bayam, daun kelor, brokoli) serta tips memasak agar vitamin tidak hilang.
3. Jika ditanyakan MPASI atau stunting, tekankan wajibnya PROTEIN HEWANI (telur, ikan kembung, hati ayam, daging) di setiap sesi makan.
4. Gunakan bahasa Indonesia yang hangat, bersahabat, empatik, terstruktur rapi dengan poin-poin jelas.
5. Selalu ingatkan untuk memeriksakan anak ke Posyandu/tenaga kesehatan bila ada tanda bahaya.`;

export const GEMINI_MODEL = "google/gemini-3.8-flash";
export const OPENAI_MODEL = "openai/gpt-5.4-mini";

export const PROVIDER_LABEL: Record<string, string> = {
  gemini: "Google Gemini",
  openai: "OpenAI GPT",
};

const GATEWAY = "https://ai.gateway.lovable.dev/v1";

export type ChatTurn = { role: string; content: string };

export function buildSystemPrompt(context?: unknown) {
  return context
    ? `${GLUCOBOT_SYSTEM_INSTRUCTION}\n\nKonteks Data Pasien: ${JSON.stringify(context)}`
    : GLUCOBOT_SYSTEM_INSTRUCTION;
}

type GatewayResult =
  | { ok: true; reply: string; provider: "gemini" | "openai"; model: string }
  | { ok: false; status: number; message: string };

/** Google Gemini via /v1/chat/completions */
async function callGemini(
  apiKey: string,
  messages: ChatTurn[],
  context?: unknown,
): Promise<GatewayResult> {
  const res = await fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: buildSystemPrompt(context) },
        ...messages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      ],
    }),
  });

  if (!res.ok) {
    return { ok: false, status: res.status, message: await res.text() };
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) return { ok: false, status: 502, message: "Jawaban kosong dari Gemini." };
  return { ok: true, reply, provider: "gemini", model: GEMINI_MODEL };
}

/** OpenAI GPT via the streaming Responses API, consumed server-side */
async function callOpenAI(
  apiKey: string,
  messages: ChatTurn[],
  context?: unknown,
): Promise<GatewayResult> {
  const res = await fetch(`${GATEWAY}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      stream: true,
      store: false,
      instructions: buildSystemPrompt(context),
      input: messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: [
          {
            type: m.role === "user" ? "input_text" : "output_text",
            text: m.content,
          },
        ],
      })),
    }),
  });

  if (!res.ok || !res.body) {
    return { ok: false, status: res.status, message: await res.text() };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string | string[] };
        };
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          text += evt.delta;
        } else if (evt.type === "response.completed" && !text) {
          const out = evt.response?.output_text;
          if (Array.isArray(out)) text += out.join("");
          else if (typeof out === "string") text += out;
        }
      } catch {
        // ignore keep-alive / non-JSON frames
      }
    }
  }

  const reply = text.trim();
  if (!reply) return { ok: false, status: 502, message: "Jawaban kosong dari GPT." };
  return { ok: true, reply, provider: "openai", model: OPENAI_MODEL };
}

/** Runs the requested provider, falling back to the other one when it fails. */
export async function askGlucoBot(
  apiKey: string,
  provider: "gemini" | "openai",
  messages: ChatTurn[],
  context?: unknown,
): Promise<GatewayResult> {
  const primary =
    provider === "openai"
      ? await callOpenAI(apiKey, messages, context)
      : await callGemini(apiKey, messages, context);
  if (primary.ok) return primary;

  console.warn(`[glucobot] ${provider} failed (${primary.status}): ${primary.message}`);
  if (primary.status === 402 || primary.status === 403 || primary.status === 401) return primary;

  const fallback =
    provider === "openai"
      ? await callGemini(apiKey, messages, context)
      : await callOpenAI(apiKey, messages, context);
  return fallback.ok ? fallback : primary;
}

export function gatewayErrorMessage(status: number) {
  if (status === 402)
    return "Kuota AI pada ruang kerja ini sudah habis. Pemilik aplikasi perlu menambah kredit AI di Lovable.";
  if (status === 403)
    return "Layanan AI sedang dinonaktifkan atau dibatasi oleh pengaturan ruang kerja.";
  if (status === 429)
    return "Permintaan ke AI terlalu banyak dalam waktu singkat. Mohon coba lagi beberapa saat lagi.";
  if (status === 401) return "Konfigurasi kunci layanan AI belum benar.";
  return "Layanan AI sedang mengalami kendala. Mohon coba lagi.";
}
