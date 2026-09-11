import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  askGlucoBot,
  gatewayErrorMessage,
  type ChatTurn,
} from "@/lib/glucobot.server";

const BodySchema = z.object({
  messages: z
    .array(z.object({ role: z.string(), content: z.string() }))
    .optional(),
  message: z.string().optional(),
  provider: z.enum(["gemini", "openai"]).optional(),
  context: z.unknown().optional(),
});

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return Response.json(
            { error: "Layanan AI belum dikonfigurasi." },
            { status: 500 },
          );
        }

        let body: z.infer<typeof BodySchema>;
        try {
          body = BodySchema.parse(await request.json());
        } catch {
          return Response.json({ error: "Permintaan tidak valid." }, { status: 400 });
        }

        const messages: ChatTurn[] =
          body.messages && body.messages.length > 0
            ? body.messages
            : body.message
              ? [{ role: "user", content: body.message }]
              : [];

        if (messages.length === 0) {
          return Response.json(
            { error: "Pesan tidak boleh kosong." },
            { status: 400 },
          );
        }

        const result = await askGlucoBot(
          apiKey,
          body.provider ?? "gemini",
          messages.slice(-20),
          body.context,
        );

        if (!result.ok) {
          return Response.json(
            { error: gatewayErrorMessage(result.status) },
            { status: result.status === 429 ? 429 : 502 },
          );
        }

        return Response.json({
          reply: result.reply,
          provider: result.provider,
          model: result.model,
        });
      },
    },
  },
});
