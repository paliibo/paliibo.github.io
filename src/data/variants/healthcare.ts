/**
 * Healthcare variant: overrides applied on top of src/data/profile.ts when the build runs with
 * VARIANT=healthcare (see src/data/variant.ts). Anything not listed here is the standard content.
 */
import type { VariantOverrides } from "./types";

export const overrides: VariantOverrides = {
  cvFile: "/Bohdan_Palii_CV_Healthcare.pdf",
  site: {
    years: 6,
    yearsSuffix: "+",
    intro:
      "building production healthcare software, from AI clinical documentation and EHR integrations to patient-facing mobile apps, for teams across the UK, EU and US",
    summary:
      "Full-Stack Engineer with 6+ years of experience building production healthcare platforms for clients in the United Kingdom, United States, UAE, Israel and Norway — clinical workflow and documentation systems, care marketplaces, medical-record analysis and coaching platforms. TypeScript across the stack: NestJS and Node.js REST APIs, React and Next.js web applications, React Native (Expo) mobile apps published to the App Store and Google Play, and PostgreSQL. Strong in multi-tenant architecture, asynchronous processing (Redis, BullMQ, RabbitMQ, Pub/Sub), real-time features over WebSockets and Socket.IO, and AI/LLM integration (OpenAI and Anthropic APIs, Vercel AI SDK, RAG with pgvector). Comfortable owning features end to end in distributed, English-speaking teams, with GDPR-compliant data handling.",
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
      text: "EHR and practice-management integrations with Cliniko, Nookal, Meddbase, Semble, Splose and Dentally, plus Stripe billing, wired in with OAuth flows and webhooks.",
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
  // Selected work mirrors the healthcare CV: Motics plus the five CV projects, in CV order and wording.
  onlyProjects: ["motics", "welspot", "oneplusonecares", "prepaire", "getinshape", "aspra"],
  projects: {
    motics: {
      title: "Motics — AI Operating System for Healthcare Clinics",
      tagline: "AI operating system for healthcare clinics",
      role: "Full-Stack Engineer",
      country: "United Kingdom · 3 months",
      summary:
        "Worked on the AI medical scribe's asynchronous processing: built durable job projections, recovery for stranded recordings, and parity fixtures that keep generated summaries consistent across model changes.",
      highlights: [
        "Worked on the AI medical scribe's asynchronous processing: built durable job projections, recovery for stranded recordings, and parity fixtures that keep generated summaries consistent across model changes.",
        "Built and extended a FastAPI integrations service handling provider credentials, OAuth flows, webhooks and UK regional shard routing.",
        "Delivered EHR / practice-management integrations with Cliniko, Nookal, Meddbase, Semble, Splose and Dentally.",
        "Shipped the React Native mobile app to the App Store and Google Play, including TestFlight and Android releases.",
        "Prepared frontend and mobile engineering standards covering security, UI guidelines and testing flows.",
      ],
      stack: ["TypeScript", "React", "React Native (Expo)", "Node.js", "Python (FastAPI)", "PostgreSQL", "Stripe", "OAuth 2.0", "webhooks", "LLM APIs"],
    },
    welspot: {
      name: "Welspot",
      title: "Welspot — AI-Driven Healthcare Management Platform",
      tagline: "AI-driven healthcare management platform",
      role: "Full-Stack Developer",
      country: "United States · 1 year",
      summary:
        "Engineered a healthcare management platform that streamlines clinical workflows end to end: patient and staff management, appointment scheduling, clinical documentation and automated generation of medical documents.",
      highlights: [
        "Engineered a healthcare management platform that streamlines clinical workflows end to end: patient and staff management, appointment scheduling, clinical documentation and automated generation of medical documents.",
        "Integrated AI-assisted clinical note generation and automated document handling into the clinician's own workflow.",
        "Built the patient and staff modules on role-based access control with JWT-based authorisation, so every permission is enforced server-side.",
        "Developed and documented scalable REST APIs with Swagger on PostgreSQL and Prisma, and implemented Elasticsearch for rapid fuzzy search across millions of clinical notes and medical records.",
        "Implemented real-time notifications, secure internal messaging and live state synchronisation with Socket.IO and RabbitMQ.",
        "Designed background processing pipelines on Redis queues for asynchronous work, and integrated cloud file storage for secure medical document management.",
      ],
      stack: ["TypeScript", "JavaScript", "React", "Node.js", "NestJS", "Express.js", "REST APIs", "Prisma", "PostgreSQL", "Redis", "RabbitMQ", "Elasticsearch", "Socket.IO", "Swagger", "AWS", "AWS S3"],
      tags: ["healthcare", "ai"],
    },
    aspra: {
      name: "Aspra",
      title: "Aspra — Founder Network & Learning Platform",
      tagline: "Founder network & learning platform",
      role: "Full-Stack Developer",
      country: "Israel · 2 years",
      summary:
        "Built a networking platform for early-stage founders: matching with co-founders, shared workspaces, startup resources and the community around them.",
      highlights: [
        "Built a networking platform for early-stage founders: matching with co-founders, shared workspaces, startup resources and the community around them.",
        "Delivered the learning side of it on Next.js and NestJS — course creation, quizzes, SCORM modules, progress tracking and role-based access for administrators, instructors and students.",
        "Shipped web, iOS and Android from one shared codebase, so the experience stays consistent across devices.",
        "Implemented an interactive task engine with automated testing, multi-stage review and structured instructor grading, plus real-time chat for community interaction.",
        "Designed and documented REST APIs on PostgreSQL and TypeORM, with AWS S3 and CloudFront behind globally distributed video streaming.",
        "Secured the platform with JWT and OAuth2 authentication, and set up CI/CD pipelines for automated builds, testing and deployment.",
      ],
      stack: ["TypeScript", "React", "Next.js", "React Native (Expo)", "NestJS", "Node.js", "PostgreSQL", "TypeORM", "WebSockets", "AWS S3", "AWS CloudFront", "Docker", "CI/CD", "Mocha", "Chai"],
      tags: ["education", "mobile"],
    },
  },
  addProjects: [
    {
      id: "oneplusonecares",
      name: "1plus1cares",
      title: "1plus1cares — Care Marketplace",
      tagline: "Care marketplace",
      role: "Full-Stack Developer",
      country: "United Kingdom · 2 years",
      summary:
        "Built a healthcare marketplace matching caregivers to patients on care needs and service availability, with a multi-role model separating caregivers, clients and staff by role-based access.",
      highlights: [
        "Built a healthcare marketplace matching caregivers to patients on care needs and service availability, with a multi-role model separating caregivers, clients and staff by role-based access.",
        "Implemented messaging, calling and secure live video consultation between caregivers and clients.",
        "Delivered online appointment scheduling and integrated payments, so booking a visit and paying for it are one flow.",
        "Optimised search so caregiver discovery and matching stayed fast as the directory grew.",
        "Shipped the React Native (Expo) app to iOS and Android through App Store Connect, on NestJS services and PostgreSQL hosted on AWS, with CI/CD pipelines automating builds and releases.",
      ],
      stack: ["TypeScript", "React", "React Native (Expo)", "NestJS", "Node.js", "PostgreSQL", "AWS", "CI/CD", "App Store Connect", "Git"],
      tags: ["healthcare", "mobile"],
    },
    {
      id: "prepaire",
      name: "Prepaire",
      title: "Prepaire — Health-Record Analysis Platform",
      tagline: "Health-record analysis platform",
      role: "Full-Stack Developer",
      country: "United Arab Emirates · 1 year",
      summary:
        "Built a healthcare application that reads uploaded medical documents and returns the patient's current health state as a dashboard of specific issues rather than raw report text.",
      highlights: [
        "Built a healthcare application that reads uploaded medical documents and returns the patient's current health state as a dashboard of specific issues rather than raw report text.",
        "Delivered web and mobile from React and React Native with state and data kept synchronised across both, on a mobile-first interface built for usability and accessibility.",
        "Implemented secure upload and processing workflows for medical documents, with explicit progress and feedback states for analyses that run long.",
        "Integrated the analytics services and health-data pipelines behind the dashboard, and tuned processing for large documents.",
      ],
      stack: ["TypeScript", "React", "React Native", "Redux Toolkit", "TanStack Query", "React Router", "SCSS", "Three.js / React Three Fiber", "Storybook"],
      tags: ["healthcare", "mobile"],
    },
    {
      id: "getinshape",
      name: "Getinshape",
      title: "Getinshape — Online Coaching Platform",
      tagline: "Online coaching platform",
      role: "Full-Stack Mobile Developer",
      country: "Norway · 6 months",
      summary:
        "Built a multi-tenant coaching platform serving coaches and their clients, from heart-failure rehabilitation through to competitive athletes.",
      highlights: [
        "Built a multi-tenant coaching platform serving coaches and their clients, from heart-failure rehabilitation through to competitive athletes.",
        "Modelled training programmes and diet plans as reusable recipes, exercises and templates a coach composes rather than re-enters.",
        "Implemented a subscription system covering plans, recurring subscriptions and digital products.",
        "Delivered the React Native app for iOS and Android with push notifications for workouts, meal plans and subscription changes, offline access to programmes and plans, and social sharing of progress.",
        "Added engagement and performance analytics to show which parts of the app to improve next.",
      ],
      stack: ["TypeScript", "React Native (Expo)", "Redux", "Redux Persist", "Material UI", "Node.js", "MySQL"],
      tags: ["healthcare", "mobile"],
    },
  ],
  // The CV lists projects without employer dates, so the dated timeline is hidden here.
  hideTimeline: true,
  statValues: { "production projects": 6, "countries served": 5 },
  copy: {
    projectsDescription:
      "Healthcare platforms, mobile apps and AI workflows built end to end for teams in the UK, US, UAE, Norway and Israel. Open a card for the full story.",
    experienceTitle: "6+ years, six products, five countries.",
    experienceDescription:
      "Remote-first with teams in the UK, US, UAE, Norway and Israel, always in English, always owning features end to end.",
  },
  diagram: {
    caption: "recording → transcript → note",
    ariaLabel:
      "Diagram of an AI medical scribe pipeline: a recording reaches the scribe API, Pub/Sub hands it to transcription and an LLM summary, the note is projected into PostgreSQL for clinician review, pushed to the EHR, and stranded recordings are recovered.",
    nodes: [
      { id: "recording", x: 16, y: 24, label: "Recording", sub: "Expo · iOS · Android" },
      { id: "review", x: 16, y: 124, label: "Clinician review", sub: "Next.js · sign-off" },
      { id: "recovery", x: 16, y: 324, label: "Recovery", sub: "stranded recordings" },
      { id: "api", x: 212, y: 74, label: "Scribe API", sub: "Cloud Run · RBAC", hot: true },
      { id: "db", x: 212, y: 324, label: "PostgreSQL", sub: "job projections" },
      { id: "pubsub", x: 408, y: 24, label: "Pub/Sub", sub: "jobs · retries" },
      { id: "transcribe", x: 408, y: 124, label: "Transcription", sub: "Deepgram · AssemblyAI" },
      { id: "summary", x: 408, y: 224, label: "LLM summary", sub: "OpenAI · Anthropic" },
      { id: "ehr", x: 408, y: 324, label: "EHR push", sub: "Cliniko · Semble · Nookal" },
    ],
    edges: [
      { id: "hd-recording-api", d: "M152 50 C182 50 182 100 212 100", dur: 2.6, begin: -0.2 },
      { id: "hd-review-api", d: "M152 150 C182 150 182 100 212 100", dur: 2.6, begin: -1.5 },
      { id: "hd-api-pubsub", d: "M348 100 C378 100 378 50 408 50", dur: 2.2, begin: -0.8 },
      { id: "hd-pubsub-transcribe", d: "M476 76 L476 124", dur: 1.4, begin: -1.2 },
      { id: "hd-transcribe-summary", d: "M476 176 L476 224", dur: 1.4, begin: -0.5 },
      { id: "hd-summary-ehr", d: "M476 276 L476 324", dur: 1.4, begin: -0.9 },
      { id: "hd-api-db", d: "M280 126 L280 324", dur: 2.4, begin: -1.0 },
      { id: "hd-summary-db", d: "M408 250 C370 250 390 350 348 350", dur: 2.6, begin: -2.4 },
      { id: "hd-db-recovery", d: "M212 350 L152 350", dur: 1.6, begin: -0.9 },
    ],
    log: [
      "POST /v1/recordings → 201 · 52 ms",
      "job scribe.transcribe:8f2a → completed · 3.1 s",
      "job scribe.summarise:8f2a → note drafted · 4.8 s",
      "pubsub scribe.jobs → ack",
      "projection job:8f2a → status=ready",
      "review note:8f2a → signed off",
      "job ehr.push:cliniko → note pushed",
      "recovery stranded-recordings → 2 requeued",
      "parity fixtures → 24/24 match",
      "webhook semble.appointment → synced",
      "push apns → note ready",
      "job ehr.sync:nookal → 3 notes pushed",
    ],
  },
  // Skills exactly as listed on the healthcare CV.
  skills: [
    { category: "Languages", keywords: ["TypeScript", "JavaScript (ES6+)", "HTML5 / CSS3", "SQL", "Python (FastAPI)", "PHP"] },
    { category: "Backend", keywords: ["Node.js", "NestJS", "Express.js", "Fastify", "REST APIs", "OpenAPI / Swagger", "tRPC", "WebSockets (Socket.IO)", "BullMQ", "RabbitMQ", "Google Cloud Pub/Sub", "Cloud Tasks", "JWT authentication", "RBAC", "Multi-tenant architecture", "Event-driven architecture", "Background workers", "Strapi", "WordPress", "GraphQL / Apollo", "OAuth 2.0", "Django", "Nodemailer"] },
    { category: "Frontend", keywords: ["React", "Next.js (SSR)", "React Router", "Redux", "Redux Saga", "Zustand", "TanStack Query (React Query)", "RxJS", "Tailwind CSS", "SCSS", "shadcn/ui", "Radix UI", "Material UI (MUI)", "Chakra UI", "Bootstrap", "Bulma", "Storybook", "Framer Motion", "GSAP", "Three.js / React Three Fiber", "Vite", "Webpack", "PWA", "i18n", "Zod", "jQuery", "Electron.js", "Redux Toolkit", "MobX", "Ant Design", "i18next", "Axios", "Moment.js", "Luxon"] },
    { category: "Mobile", keywords: ["React Native", "Expo", "Expo Router", "Push notifications", "App Store and Google Play publishing"] },
    { category: "AI & LLM", keywords: ["OpenAI API", "Anthropic API", "Vercel AI SDK", "RAG pipelines", "Vector search (pgvector)", "Ollama", "Groq API", "Deepgram", "AssemblyAI", "GitHub Copilot", "Claude Code", "Codex", "LLM evaluation", "RLHF data generation", "Agent evaluation", "Rubric design", "Grading calibration", "Failure-mode analysis", "Cursor", "Gemini"] },
    { category: "Payments & Integrations", keywords: ["Stripe", "Paysera", "Cliniko", "Nookal", "Meddbase", "Semble", "Splose", "Dentally", "ArcGIS", "Mapbox", "SCORM", "EDI", "Finvalda", "Ivesk.lt", "Auth0", "SendGrid", "Shopify API", "Twitter API", "Line API"] },
    { category: "Databases & ORMs", keywords: ["PostgreSQL", "PostGIS", "pgvector", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Firebase / Firestore", "Supabase", "Prisma", "TypeORM", "Drizzle ORM", "Sequelize", "Google Cloud SQL", "DynamoDB"] },
    { category: "Cloud & DevOps", keywords: ["AWS (S3, ECS, RDS, CloudFront)", "Google Cloud (Cloud Run, Cloud SQL, Pub/Sub, Cloud Functions)", "Vercel", "Docker", "Kubernetes", "Nginx", "MinIO", "CI/CD", "GitHub Actions", "GitLab CI", "Git / GitHub / GitLab", "Sentry", "Terraform", "DigitalOcean", "CircleCI", "PM2"] },
    { category: "Testing & Quality", keywords: ["Jest", "Vitest", "React Testing Library", "Playwright", "Puppeteer", "ESLint", "AES-256 encryption", "Helmet", "GDPR-compliant data handling", "Mocha", "Chai", "Cypress (e2e)"] },
    { category: "Tools", keywords: ["Postman", "Figma", "Prettier", "Husky"] },
    { category: "Methodologies", keywords: ["Agile", "Scrum", "Kanban", "Pair programming", "AI-agent-driven development", "Feature-Driven Development (FDD)", "Behaviour-Driven Development (BDD)"] },
  ],
};
