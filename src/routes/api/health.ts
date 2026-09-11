import { createFileRoute } from "@tanstack/react-router";

import { GEMINI_MODEL, OPENAI_MODEL } from "@/lib/glucobot.server";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: () => {
        const available = Boolean(process.env["LOVABLE_API_KEY"]);
        return Response.json({
          status: "ok",
          providers: {
            gemini: { available, model: GEMINI_MODEL },
            openai: { available, model: OPENAI_MODEL },
          },
          activeProvider: "gemini",
        });
      },
    },
  },
});
