import { createFileRoute } from "@tanstack/react-router";

import GlucoGrowApp from "@/components/GlucoGrowApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlucoGrow — Platform Nutrisi Cerdas & Cegah Stunting Balita" },
      {
        name: "description",
        content:
          "Pantau tumbuh kembang balita sesuai standar WHO, susun menu MPASI padat gizi, dan konsultasi dengan asisten AI GlucoBot (Gemini & GPT).",
      },
      {
        property: "og:title",
        content: "GlucoGrow — Platform Nutrisi Cerdas & Cegah Stunting Balita",
      },
      {
        property: "og:description",
        content:
          "Kalkulator antropometri, kurva pertumbuhan WHO, generator menu MPASI, dan asisten AI nutrisi balita dalam satu platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GlucoGrowApp,
});
