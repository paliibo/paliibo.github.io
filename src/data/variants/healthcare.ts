/**
 * Healthcare variant: overrides applied on top of src/data/profile.ts when the build runs with
 * VARIANT=healthcare (see src/data/variant.ts). Anything not listed here is the standard content.
 */
import type { VariantOverrides } from "./types";

export const overrides: VariantOverrides = {
  cvFile: "/Bohdan_Palii_CV_Healthcare.pdf",
  site: {
    years: 6,
    intro:
      "building production healthcare software, from AI clinical documentation and EHR integrations to patient-facing mobile apps, for teams across the UK, EU and US",
    summary:
      "Full-Stack Engineer focused on production healthcare software: AI clinical documentation, EHR integrations, clinical analysis platforms and patient-facing mobile apps for teams across the UK, EU and US. TypeScript across the stack: NestJS and Node.js REST APIs, React and Next.js web applications, React Native (Expo) mobile apps published to the App Store and Google Play, and PostgreSQL.",
    note: "I helped build Motics with your team, working on the AI scribe pipeline, EHR integrations and the mobile app. I'm now applying directly to keep building it with you.",
  },
  heroPhrases: [
    "AI clinical documentation pipelines",
    "EHR integrations for UK clinics",
    "durable async processing on Pub/Sub",
    "React Native apps that reach the stores",
    "LLM and RAG features on pgvector",
  ],
  expertiseOrder: ["sparkles", "creditcard", "workflow", "smartphone", "layout", "server"],
  expertise: {
    sparkles: {
      title: "AI & LLM features",
      text: "AI medical scribe workflows with provider-neutral transcription across Deepgram and AssemblyAI, LLM summaries held stable by parity fixtures across model changes, and RAG on pgvector.",
      tags: ["OpenAI", "Anthropic", "Deepgram", "AssemblyAI", "pgvector"],
    },
    creditcard: {
      title: "EHR & payment integrations",
      text: "Cliniko, Nookal, Meddbase, Semble, Splose and Dentally integrations with clinical note push, identity mapping and reconciliation, plus Stripe billing, wired in with webhooks and OAuth.",
      tags: ["Cliniko", "Nookal", "Meddbase", "Semble", "Stripe"],
    },
    workflow: {
      text: "Durable background pipelines on Pub/Sub, Cloud Tasks, BullMQ and RabbitMQ for transcription, AI workflows, imports and document generation, with recovery built in.",
      tags: ["Pub/Sub", "Cloud Tasks", "BullMQ", "RabbitMQ", "Workers"],
    },
    layout: {
      text: "React and Next.js applications with TanStack Query, Zustand and Tailwind, from clinician dashboards to patient portals.",
    },
  },
  projectOrder: ["motics", "longevity", "welspot", "rozumnyk", "surge-ai", "saveface"],
  projects: {
    motics: {
      role: "Full-Stack Developer",
      highlights: [
        "Full-stack development of a healthcare SaaS platform used by clinics across the United Kingdom, in an Nx/pnpm monorepo covering the Next.js web app, the React Native (Expo) mobile app and the backend services.",
        "Worked on the product as it grew from an AI medical scribe into a clinic operations suite: clinical documentation, billing, patient communication automation and agent-driven workflows.",
        "Worked on the asynchronous worker infrastructure on Google Cloud (Cloud Run, Pub/Sub and Cloud Tasks with Redis) that runs AI workflows, speech-to-text transcription and media pipelines, with provider-neutral transcription across Deepgram, AssemblyAI and LLM providers.",
        "Built the durable processing plane for the scribe: durable job projections into the web database, summary-source cutover, stranded-recording recovery and golden parity fixtures that hold prompt output stable across model changes.",
        "Built and extended a dedicated FastAPI integrations service on Cloud Run that owns provider credentials, OAuth, webhook subscriptions and UK regional shard routing, with Alembic migrations, Secret Manager and Sentry/Amplitude observability.",
        "Delivered EHR integrations for Cliniko, Nookal, Meddbase, Semble, Splose and Dentally, including clinical note push, identity mapping and reconciliation; plus Healthcode and Stripe billing, Gmail and Microsoft 365 mailbox sync, Twilio SMS, and Vald sports-science devices (ForceDecks, ForceFrame, NordBord, HumanTrak, SmartSpeed, DynaMo).",
        "Contributed to the production data migration from Firebase to PostgreSQL with Drizzle ORM, implemented Stripe billing, and published the mobile apps to the Apple App Store and Google Play with push notifications, Apple and Google sign-in, and crash reporting.",
      ],
    },
  },
  jobs: [
    { company: "CubeX", role: "Full-Stack Developer", start: "Sep 2025", end: "Present", location: "Remote · Zaporizhzhia, Ukraine" },
    { company: "UAPP LLC", role: "Full-Stack Developer", start: "Jul 2024", end: "Sep 2025", location: "Remote · Wilmington, Delaware, USA" },
    { company: "ACCA", role: "Full-Stack Developer", start: "Oct 2023", end: "Jul 2024", location: "Hybrid · Fairfax, Virginia, USA" },
    { company: "WelSpot Inc.", role: "Full-Stack Developer", start: "Sep 2022", end: "Oct 2023", location: "Remote · Miami, Florida, USA" },
  ],
  extraSkills: {
    "Payments & Integrations": ["Splose", "Dentally"],
  },
};
