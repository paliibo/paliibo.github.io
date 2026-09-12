/**
 * Single source of content for the site.
 * Mirrors the CV (ats-forge/data/resumes/bohdan-palii.json): nothing here is invented,
 * every project bullet is the CV wording.
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

/** Prefixes a file from public/ with the deploy base path (needed for GitHub Pages project sites). */
export const asset = (path: string) => `${basePath}${path}`;

export const site = {
  name: "Bohdan Palii",
  firstName: "Bohdan",
  lastName: "Palii",
  role: "Full-Stack Engineer",
  headline: "TypeScript, Node.js (NestJS), React, Next.js, React Native, PostgreSQL",
  years: 5,
  email: "contact.palii.bohdan@gmail.com",
  location: "Alicante, Spain",
  timezone: "CET",
  github: "https://github.com/paliibo",
  githubHandle: "paliibo",
  linkedin: "https://linkedin.com/in/paliibohdan",
  cvPath: asset("/Bohdan_Palii_CV.pdf"),
  photo: asset("/bohdan-palii.png"),
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  summary:
    "Full-Stack Engineer with 5 years of experience building production SaaS platforms for healthcare, fintech, logistics and education clients across the UK, EU and US. TypeScript across the stack: NestJS and Node.js REST APIs, React and Next.js web applications, React Native (Expo) mobile apps published to the App Store and Google Play, and PostgreSQL.",
  availability:
    "Open to on-site and hybrid work in Spain, remote work across the EU, and relocation.",
  languages: [
    { language: "English", level: "C1, certified" },
    { language: "Ukrainian", level: "Native" },
  ],
} as const;

export const heroPhrases = [
  "multi-tenant SaaS platforms",
  "async pipelines on BullMQ and Pub/Sub",
  "React Native apps that reach the stores",
  "LLM and RAG features on pgvector",
  "payment and EHR integrations",
];

export const stats = [
  { value: 5, suffix: "", label: "years of experience" },
  { value: 12, suffix: "", label: "production projects" },
  { value: 9, suffix: "", label: "countries served" },
  { value: 25, suffix: "+", label: "third-party integrations" },
];

export type ExpertiseIcon = "server" | "workflow" | "layout" | "smartphone" | "sparkles" | "creditcard";

export interface ExpertiseArea {
  icon: ExpertiseIcon;
  title: string;
  text: string;
  tags: string[];
}

export const expertise: ExpertiseArea[] = [
  {
    icon: "server",
    title: "Backend & architecture",
    text: "NestJS and Node.js REST APIs designed as multi-tenant, event-driven systems with RBAC and tenant isolation built in from day one.",
    tags: ["NestJS", "REST · OpenAPI", "Multi-tenant", "RBAC", "WebSockets"],
  },
  {
    icon: "workflow",
    title: "Async processing",
    text: "Background pipelines on Redis, BullMQ, RabbitMQ and Google Pub/Sub for imports, reconciliations, media and document generation.",
    tags: ["BullMQ", "RabbitMQ", "Pub/Sub", "Cloud Tasks", "Workers"],
  },
  {
    icon: "layout",
    title: "Web frontends",
    text: "React and Next.js applications with TanStack Query, Zustand and Tailwind, from patient portals to financial dashboards.",
    tags: ["React", "Next.js", "TanStack Query", "Zustand", "Tailwind CSS"],
  },
  {
    icon: "smartphone",
    title: "Mobile",
    text: "React Native and Expo apps with push notifications, Apple and Google sign-in and crash reporting, published to the App Store and Google Play.",
    tags: ["React Native", "Expo", "Push notifications", "App Store", "Google Play"],
  },
  {
    icon: "sparkles",
    title: "AI & LLM features",
    text: "RAG pipelines on pgvector, transcription and LLM workflows with OpenAI and Anthropic, plus hands-on agent evaluation and rubric design.",
    tags: ["OpenAI", "Anthropic", "Vercel AI SDK", "pgvector", "Agent evaluation"],
  },
  {
    icon: "creditcard",
    title: "Payments & integrations",
    text: "Stripe and Paysera billing, EHR systems, ticketing platforms and geospatial APIs wired in with webhooks, OAuth and reconciliation.",
    tags: ["Stripe", "Paysera", "EHR systems", "Ticketmaster / AXS", "ArcGIS"],
  },
];

export type ProjectTag = "healthcare" | "fintech" | "ai" | "mobile" | "geo" | "education";

export const projectFilters: { id: ProjectTag | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "healthcare", label: "Healthcare" },
  { id: "fintech", label: "Fintech" },
  { id: "ai", label: "AI & LLM" },
  { id: "mobile", label: "Mobile" },
  { id: "geo", label: "Logistics & Geo" },
  { id: "education", label: "Education" },
];

export interface Project {
  id: string;
  name: string;
  title: string;
  tagline: string;
  role: string;
  country: string;
  summary: string;
  highlights: string[];
  stack: string[];
  tags: ProjectTag[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "motics",
    name: "Motics",
    title: "Motics — Healthcare Multi-Agent Platform",
    tagline: "Healthcare multi-agent platform",
    role: "Full-Stack Developer / Software Architect",
    country: "United Kingdom",
    summary:
      "Healthcare SaaS used by clinics across the UK: an AI medical scribe that grew into a clinic operations suite. An Nx/pnpm monorepo with a Next.js web app, an Expo mobile app and worker services on Google Cloud.",
    highlights: [
      "Led architecture and full-stack development of a healthcare SaaS platform from conception to production, now used by clinics across the United Kingdom. Built as an Nx/pnpm monorepo covering the Next.js web app, the React Native (Expo) mobile app and the backend services.",
      "Expanded the product from an AI medical scribe into a clinic operations suite: clinical documentation, billing, patient communication automation and agent-driven workflows.",
      "Designed asynchronous worker infrastructure on Google Cloud — Cloud Run, Pub/Sub and Cloud Tasks with Redis — to run AI workflows, speech-to-text transcription and media pipelines, with provider-neutral transcription across Deepgram, AssemblyAI and LLM providers.",
      "Built the durable processing plane for the scribe: durable job projections into the web database, summary-source cutover, stranded-recording recovery and golden parity fixtures that hold prompt output stable across model changes.",
      "Built and extended a dedicated FastAPI integrations service on Cloud Run that owns provider credentials, OAuth, webhook subscriptions and UK regional shard routing, with Alembic migrations, Secret Manager and Sentry/Amplitude observability.",
      "Delivered EHR integrations for Cliniko, Nookal, Meddbase, Semble, Splose and Dentally, including clinical note push, identity mapping and reconciliation; plus Healthcode and Stripe billing, Gmail and Microsoft 365 mailbox sync, Twilio SMS, and Vald sports-science devices (ForceDecks, ForceFrame, NordBord, HumanTrak, SmartSpeed, DynaMo).",
      "Migrated production data from Firebase to PostgreSQL with Drizzle ORM, implemented Stripe billing, and published the mobile apps to the Apple App Store and Google Play with push notifications, Apple and Google sign-in, and crash reporting.",
    ],
    stack: [
      "TypeScript", "Next.js", "React", "NestJS", "Node.js", "React Native (Expo)", "Python", "FastAPI",
      "PostgreSQL", "Drizzle ORM", "Firebase / Firestore", "Google Cloud (Cloud Run, Cloud SQL, Pub/Sub, Cloud Tasks, Secret Manager)",
      "Vercel AI SDK", "OpenAI", "Anthropic", "Deepgram", "AssemblyAI", "Stripe", "Twilio", "Tailwind CSS", "shadcn/ui",
      "Radix UI", "TanStack Query", "Sentry", "Amplitude", "Playwright", "Vitest", "Docker",
    ],
    tags: ["healthcare", "ai", "mobile"],
    featured: true,
  },
  {
    id: "surge-ai",
    name: "Agentic coding evaluation",
    title: "Agentic coding evaluation programme — Surge AI (frontier-lab client under NDA)",
    tagline: "Evaluating autonomous coding agents",
    role: "AI Agent Evaluator",
    country: "Remote · 2026",
    summary:
      "Designed engineering tasks against production-grade codebases to capture reproducible failures in an autonomous coding agent, and authored the rubrics an automated LLM grader scores them with.",
    highlights: [
      "Designed realistic engineering tasks against production-grade codebases to elicit and capture reproducible behavioural failures in an autonomous coding agent.",
      "Authored grader guidance: privileged rubrics consumed by an automated LLM grader, calibrating scoring across seven behavioural dimensions.",
      "Produced 4+ reference runs per task to prove failure reproducibility and validate that rubrics discriminate strong from weak agent behaviour.",
      "Iterated rubrics through regrade cycles, re-scoring frozen agent trajectories to isolate the effect of each rubric change on the score distribution.",
      "Applied an ~80%-of-senior-engineers consensus bar to separate material failures with real business impact from stylistic preference.",
      "Contributed within a large distributed evaluation programme; joined recurring client syncs on task design and grading standards.",
    ],
    stack: ["LLM evaluation", "RLHF data generation", "Rubric design", "Docker-based agent sandboxes", "Ruby on Rails", "TypeScript"],
    tags: ["ai"],
  },
  {
    id: "homemoney",
    name: "HomeMoney",
    title: "HomeMoney — Multi-Tenant Financial Analytics",
    tagline: "Multi-tenant financial analytics",
    role: "Full-Stack Developer",
    country: "United States",
    summary:
      "Enterprise multi-tenant ledger and analytics platform: accounts receivable and payable, asset reconciliation, a configurable formula engine and AES-256-protected reporting.",
    highlights: [
      "Developed an enterprise multi-tenant financial ledger and analytics platform centralising accounting, cash-flow management and financial reporting across complex organisational structures.",
      "Architected backend services for ledger management, accounts receivable and payable, asset reconciliation and configurable financial calculations, with granular role-based access control and secure data isolation for individual companies and business groups.",
      "Built automated background pipelines that import and normalise financial data from banking systems and external sources, enabling high-volume transaction processing and reconciliation.",
      "Developed a dynamic formula engine that lets administrators configure custom financial calculations and reporting logic without code changes.",
      "Implemented financial dashboards, balance-sheet reporting, cash-flow analytics and secure data export, applying AES-256 encryption and key management to protect sensitive data.",
    ],
    stack: ["TypeScript", "Node.js", "Express.js", "PostgreSQL", "TypeORM", "Redis", "BullMQ", "MinIO", "Elasticsearch", "Docker"],
    tags: ["fintech"],
  },
  {
    id: "inkasso",
    name: "Inkasso",
    title: "Inkasso — Enterprise Debt Collection & Financial Automation",
    tagline: "Debt collection & financial automation",
    role: "Full-Stack Developer",
    country: "Switzerland, Germany, Italy",
    summary:
      "Multi-tenant debt-collection platform for the DACH region and Italy: debtor lifecycle, invoicing, payment reconciliation, Swiss QR-bills and BullMQ pipelines for high-volume financial operations.",
    highlights: [
      "Developed and enhanced an enterprise multi-tenant debt-collection and financial automation platform serving organisations across Italy, Germany and Switzerland.",
      "Architected backend services automating debtor lifecycle management, invoicing, payment reconciliation, interest and legal-cost calculations and repayment schedules, while supporting tenant-specific business rules and country-specific compliance requirements.",
      "Designed asynchronous processing pipelines on Redis and BullMQ to orchestrate high-volume financial operations: automated data ingestion, payment imports, scheduled reconciliations and document processing.",
      "Built dynamic document generation for invoices, legal notices, payoff statements, reports and Swiss QR-bills, and integrated email and SMS communication channels.",
      "Implemented bulk reporting, document management and tenant synchronisation, and optimised the platform for reliability through background workers, scheduled tasks and robust transactional workflows.",
    ],
    stack: ["TypeScript", "NestJS", "Node.js", "PostgreSQL", "TypeORM", "Redis", "BullMQ", "RabbitMQ", "Swagger/OpenAPI", "Jest", "Docker"],
    tags: ["fintech"],
  },
  {
    id: "longevity",
    name: "Longevity",
    title: "Longevity — AI-Driven Healthcare Platform",
    tagline: "AI-driven healthcare platform",
    role: "Full-Stack Developer",
    country: "Latvia",
    summary:
      "Clinical genetic and blood-analysis platform where the OpenAI API produces medical assessments and an event-driven backend fans out patient notifications, doctor dashboards and follow-up workflows.",
    highlights: [
      "Built a clinical genetic and blood-analysis platform on NestJS and the OpenAI API that generates detailed medical LLM assessments, historical health trends and marker-specific recommendations.",
      "Architected an event-driven system that reacts to a completed AI analysis by instantly triggering patient notifications, updating doctor dashboards and automating post-analysis workflows.",
      "Delivered a highly responsive SPA with React, Vite, Tailwind CSS and TanStack Query, using Zustand for complex state across patient portals and comprehensive admin dashboards.",
      "Built a stateless REST API on Node.js, PostgreSQL and TypeORM, managing secure AWS S3 file storage, automated OpenAPI client generation and Paysera payment integration for consultation bookings.",
    ],
    stack: ["TypeScript", "React", "Vite", "NestJS", "Node.js", "PostgreSQL", "TypeORM", "Tailwind CSS", "TanStack Query", "Zustand", "AWS S3", "OpenAI API", "Paysera"],
    tags: ["healthcare", "ai"],
  },
  {
    id: "eyevi",
    name: "EyeVi",
    title: "EyeVi — LIDAR Mapping System",
    tagline: "LIDAR mapping system",
    role: "Full-Stack Developer",
    country: "Estonia",
    summary:
      "3D road-infrastructure mapping: massive LIDAR point clouds rendered in the browser with Three.js and Potree, PostGIS geospatial statistics and Stripe-metered API quotas.",
    highlights: [
      "Built a scalable platform for high-accuracy 3D mapping and digital road-infrastructure inventory.",
      "Engineered a real-time visualisation system for 3D-scanned streets, using Three.js and Potree to render massive LIDAR point clouds directly in the browser.",
      "Architected a NestJS backend on PostgreSQL with the PostGIS extension to calculate complex geospatial statistics, and integrated ArcGIS for enterprise spatial analytics.",
      "Engineered a token-based subscription architecture on Stripe to manage automated billing and API usage quotas.",
      "Implemented high-volume geodata upload workflows with AWS S3 and optimised rendering performance through Redis caching.",
    ],
    stack: ["TypeScript", "React", "Three.js", "Potree", "Mapbox", "ArcGIS", "NestJS", "PostgreSQL", "PostGIS", "Redis", "AWS S3", "Stripe", "Docker"],
    tags: ["geo"],
  },
  {
    id: "rozumnyk",
    name: "Rozumnyk",
    title: "Rozumnyk — AI-Powered Agriculture Knowledge Assistant",
    tagline: "AI agriculture knowledge assistant",
    role: "Full-Stack Developer",
    country: "Ukraine",
    summary:
      "Ukrainian-language RAG assistant for agriculture: document ingestion, embeddings and semantic retrieval on pgvector, served by a modular NestJS backend on Kubernetes.",
    highlights: [
      "Designed and delivered an enterprise-grade AI assistant platform focused on high-quality Ukrainian-language interactions, combining modern LLMs with a Retrieval-Augmented Generation (RAG) pipeline.",
      "Architected a modular NestJS backend responsible for document ingestion, asynchronous processing, vector embedding generation and semantic retrieval, using Redis, BullMQ, Ollama and pgvector for scalability and low-latency responses.",
      "Established a role-based authorisation model for administrators, moderators and end users, and developed operational dashboards for content and system management.",
      "Containerised the complete solution with Docker and Kubernetes, with MinIO providing secure object storage for knowledge assets.",
    ],
    stack: ["TypeScript", "NestJS", "Next.js", "PostgreSQL", "pgvector", "Redis", "BullMQ", "Vercel AI SDK", "Groq API", "Ollama", "MinIO", "Docker", "Kubernetes", "Material UI"],
    tags: ["ai"],
  },
  {
    id: "baulera",
    name: "Baulera",
    title: "Baulera — Multi-Tenant Invoicing & Accounting SaaS",
    tagline: "Multi-tenant invoicing & accounting SaaS",
    role: "Full-Stack Developer",
    country: "Lithuania",
    summary:
      "Invoicing, procurement and accounting SaaS for multilingual companies, with RBAC hierarchies, Stripe billing, PDF automation and Lithuanian accounting integrations.",
    highlights: [
      "Led the architecture and full-stack development of a multi-tenant financial SaaS platform centralising invoicing, procurement and accounting workflows across multilingual business environments.",
      "Designed scalable backend systems with Express, MySQL and Sequelize, implementing an RBAC architecture for secure company hierarchies and delegated workflows.",
      "Built automation-driven financial pipelines using Redis and scheduled jobs for recurring billing, payment tracking and communication workflows.",
      "Integrated Stripe payment infrastructure, developed document automation for receipt processing and PDF generation, and delivered React financial dashboards with the Finvalda, Ivesk.lt and Rekvizitai.lt accounting integrations.",
      "Implemented enterprise-grade authentication, GDPR-compliant data lifecycle management and secure multi-company data handling.",
    ],
    stack: ["TypeScript", "React", "Redux Saga", "Node.js", "Express.js", "MySQL", "Sequelize", "Redis", "Stripe", "Socket.IO", "Puppeteer", "Material UI", "AWS S3"],
    tags: ["fintech"],
  },
  {
    id: "aspra",
    name: "ASPRA",
    title: "ASPRA — Learning Management System",
    tagline: "Learning management system",
    role: "Full-Stack Developer",
    country: "Ukraine",
    summary:
      "LMS on Next.js and NestJS with SCORM courses, automated assessments, real-time chat and a globally distributed video pipeline on S3 and CloudFront.",
    highlights: [
      "Developed a scalable learning management system on Next.js and NestJS, enabling dynamic course creation, integration of complex SCORM modules and advanced assessment workflows.",
      "Created a secure authentication architecture providing strict role-based access control across comprehensive control panels for administrators, instructors and students.",
      "Implemented an interactive task management engine handling automated testing, multimedia assignment submissions and structured instructor grading, plus real-time chat infrastructure and precise user progress tracking.",
      "Optimised backend REST APIs on PostgreSQL and TypeORM, and engineered a globally distributed media delivery pipeline with AWS S3 and CloudFront for seamless video streaming.",
      "Streamlined deployment and reliability by establishing Docker containerisation and automated CI/CD pipelines.",
    ],
    stack: ["TypeScript", "Next.js", "NestJS", "PostgreSQL", "TypeORM", "WebSockets", "Redis", "AWS S3", "AWS CloudFront", "Docker", "CI/CD"],
    tags: ["education"],
  },
  {
    id: "saveface",
    name: "Saveface",
    title: "Saveface — Face-Value Ticket Exchange",
    tagline: "Face-value ticket exchange",
    role: "Full-Stack Mobile Developer",
    country: "United States",
    summary:
      "React Native marketplace for face-value tickets: verified Ticketmaster and AXS transfers, 72-hour payout holds, fraud review and BullMQ auto-purchase queues.",
    highlights: [
      "Built a cross-platform mobile application with a scalable backend for face-value ticket exchange, developing the native client in React Native and Expo.",
      "Engineered a robust, Swagger-documented REST API with NestJS and PostgreSQL via TypeORM to enforce complex marketplace logic, including secure 72-hour payout holds and fraud review workflows.",
      "Coordinated verified digital ticket transfers through Ticketmaster and AXS.",
      "Built high-concurrency automated auto-purchase queue systems and general-admission waitlists on Redis and BullMQ, with Stripe payments, Sentry monitoring and Helmet security hardening.",
    ],
    stack: ["TypeScript", "React Native (Expo)", "NestJS", "Node.js", "PostgreSQL", "TypeORM", "Redis", "BullMQ", "Stripe", "Sentry", "Helmet"],
    tags: ["mobile"],
  },
  {
    id: "fast-forward",
    name: "Fast Forward",
    title: "Fast Forward — Transportation Management System",
    tagline: "Transportation management system",
    role: "Full-Stack Developer",
    country: "United States",
    summary:
      "Multi-tenant TMS for freight brokerage covering quoting, dispatch, tracking and invoicing, with EDI imports on BullMQ and real-time shipment monitoring over WebSockets.",
    highlights: [
      "Developed a scalable multi-tenant TMS for freight brokerage operations, supporting the complete shipment lifecycle from quoting and load creation to dispatching, tracking and invoicing.",
      "Built responsive brokerage dashboards for dispatchers, carrier managers and customers with secure role-based access control and tenant isolation.",
      "Implemented carrier onboarding workflows, rate confirmation management, document processing and automated invoicing.",
      "Engineered asynchronous background processing with BullMQ and Redis for EDI imports, tracking updates, invoice generation and document synchronisation.",
      "Designed real-time shipment monitoring over WebSockets and deployed containerised services on AWS with automated CI/CD pipelines.",
    ],
    stack: ["TypeScript", "React", "Next.js", "NestJS", "PostgreSQL", "TypeORM", "Redis", "BullMQ", "WebSockets", "AWS (S3, ECS, RDS)", "Docker", "CI/CD"],
    tags: ["geo"],
  },
  {
    id: "welspot",
    name: "WelSpot",
    title: "WelSpot — Medical Management System",
    tagline: "Medical management system",
    role: "Full-Stack Developer",
    country: "United States",
    summary:
      "Appointment scheduling and patient and staff management on React and NestJS, with Socket.IO state sync and Elasticsearch fuzzy search across millions of clinical records.",
    highlights: [
      "Engineered a scalable medical management platform on React and NestJS to streamline complex appointment scheduling and patient and staff profile management.",
      "Enabled real-time application state synchronisation with Socket.IO and RabbitMQ messaging.",
      "Developed and documented robust REST APIs via Swagger on PostgreSQL and Prisma, and implemented Elasticsearch to deliver rapid fuzzy search across millions of clinical notes and medical records.",
      "Enforced strict JWT-based role-based access control and compliant document workflows, using AWS S3 for secure medical file storage.",
    ],
    stack: ["TypeScript", "React", "NestJS", "PostgreSQL", "Prisma", "Redis", "RabbitMQ", "Elasticsearch", "Socket.IO", "AWS S3", "Swagger"],
    tags: ["healthcare"],
  },
];

export interface Job {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
}

export const jobs: Job[] = [
  { company: "UAPP LLC", role: "Full-Stack Developer", start: "Sep 2025", end: "Present", location: "Remote · Wilmington, Delaware, USA" },
  { company: "CubeX", role: "Full-Stack Developer", start: "Jul 2024", end: "Sep 2025", location: "Remote · Zaporizhzhia, Ukraine" },
  { company: "ACCA", role: "Full-Stack Developer", start: "Oct 2023", end: "Jul 2024", location: "Hybrid · Fairfax, Virginia, USA" },
  { company: "WelSpot Inc.", role: "Full-Stack Developer", start: "Sep 2022", end: "Oct 2023", location: "Remote · Miami, Florida, USA" },
];

export const education = [
  { institution: "Cherkasy State Business College", degree: "BSc, Software Engineering", years: "2020 – 2024", location: "Cherkasy, Ukraine" },
  { institution: "Northern Virginia Community College", degree: "Diploma, Web Design and Development", years: "2023 – 2024", location: "Virginia, USA" },
];

export interface SkillGroup {
  category: string;
  keywords: string[];
}

export const skills: SkillGroup[] = [
  { category: "Languages", keywords: ["TypeScript", "JavaScript (ES6+)", "HTML5 / CSS3", "SQL", "Python (FastAPI)", "PHP"] },
  {
    category: "Frontend",
    keywords: ["React", "Next.js (SSR)", "React Router", "Redux", "Redux Saga", "Zustand", "TanStack Query", "RxJS", "Tailwind CSS", "SCSS", "shadcn/ui", "Radix UI", "Material UI", "Chakra UI", "Bootstrap", "Storybook", "Framer Motion", "GSAP", "Three.js / React Three Fiber", "Vite", "Webpack", "PWA", "i18n", "Zod", "Electron.js"],
  },
  { category: "Mobile", keywords: ["React Native", "Expo", "Expo Router", "Push notifications", "App Store and Google Play publishing"] },
  {
    category: "Backend",
    keywords: ["Node.js", "NestJS", "Express.js", "Fastify", "REST APIs", "OpenAPI / Swagger", "tRPC", "WebSockets (Socket.IO)", "BullMQ", "RabbitMQ", "Google Cloud Pub/Sub", "Cloud Tasks", "JWT authentication", "RBAC", "Multi-tenant architecture", "Event-driven architecture", "Background workers", "Strapi", "WordPress"],
  },
  { category: "Databases & ORMs", keywords: ["PostgreSQL", "PostGIS", "pgvector", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Firebase / Firestore", "Supabase", "Prisma", "TypeORM", "Drizzle ORM", "Sequelize"] },
  { category: "Cloud & DevOps", keywords: ["AWS (S3, ECS, RDS, CloudFront)", "Google Cloud (Cloud Run, Cloud SQL, Pub/Sub, Cloud Functions)", "Vercel", "Docker", "Kubernetes", "Nginx", "MinIO", "CI/CD", "GitHub Actions", "GitLab CI", "Sentry"] },
  { category: "AI & LLM", keywords: ["OpenAI API", "Anthropic API", "Vercel AI SDK", "RAG pipelines", "Vector search (pgvector)", "Ollama", "Groq API", "Deepgram", "AssemblyAI", "Claude Code", "Codex", "GitHub Copilot", "LLM evaluation", "RLHF data generation", "Agent evaluation", "Rubric design", "Grading calibration", "Failure-mode analysis"] },
  { category: "Payments & Integrations", keywords: ["Stripe", "Paysera", "Cliniko", "Nookal", "Meddbase", "Semble", "Ticketmaster / AXS", "ArcGIS", "Mapbox", "SCORM", "EDI", "Finvalda", "Ivesk.lt"] },
  { category: "Testing & Quality", keywords: ["Jest", "Vitest", "React Testing Library", "Playwright", "Puppeteer", "ESLint", "AES-256 encryption", "Helmet", "GDPR-compliant data handling"] },
];

export interface Repo {
  name: string;
  description: string;
  stack: string;
  repo: string;
  live?: string;
}

export const openSource: Repo[] = [
  {
    name: "leadscope",
    description: "Real-time sales pipeline intelligence: a live SSE feed, a drag-and-drop pipeline, forecasting and leaderboards on a seeded backend.",
    stack: "Next.js 15 · TypeScript · Drizzle · libSQL · Playwright",
    repo: "https://github.com/paliibo/leadscope",
    live: "https://leadscope-demo.vercel.app",
  },
  {
    name: "dunlin",
    description: "Multi-tenant invoicing, dunning and payment reconciliation API with PostgreSQL row-level security and BullMQ workers.",
    stack: "NestJS 12 · PostgreSQL RLS · TypeORM · BullMQ · Docker · OpenAPI",
    repo: "https://github.com/paliibo/dunlin",
  },
  {
    name: "mark-map",
    description: "Keyless, local-first map and trip planner: drop stops, optimise the route, share the whole trip as a single link.",
    stack: "Next.js · TypeScript · MapLibre",
    repo: "https://github.com/paliibo/mark-map",
    live: "https://paliibo.github.io/mark-map/",
  },
  {
    name: "data-room",
    description: "A virtual data room that runs entirely in the browser: due-diligence documents behind expiring passcode-protected links, with read tracking.",
    stack: "React 19 · TypeScript · Zustand · IndexedDB",
    repo: "https://github.com/paliibo/data-room",
    live: "https://paliibo.github.io/data-room/",
  },
  {
    name: "quizbrain",
    description: "Offline-first study app: quizzes, SM-2 spaced-repetition flashcards and a match game.",
    stack: "Next.js · TypeScript · Tailwind · Vitest",
    repo: "https://github.com/paliibo/quizbrain",
    live: "https://quizlet-sand.vercel.app",
  },
  {
    name: "nx-vi-hub",
    description: "Self-hostable video hub on one ts-rest contract: an Nx monorepo with an Express API and a Next.js 15 app, tested end to end against a real database.",
    stack: "Nx · Express · Next.js 15 · Prisma · PostgreSQL · Jest",
    repo: "https://github.com/paliibo/nx-vi-hub",
  },
];

export const marqueePrimary = [
  "TypeScript", "NestJS", "Next.js", "React", "React Native", "PostgreSQL", "Redis", "BullMQ",
  "Docker", "Google Cloud", "AWS", "Stripe", "OpenAI", "pgvector",
];

export const marqueeSecondary = [
  "Expo", "TypeORM", "Drizzle", "Prisma", "RabbitMQ", "Pub/Sub", "Cloud Run", "Kubernetes",
  "Playwright", "Vitest", "Tailwind CSS", "Socket.IO", "Elasticsearch", "Sentry", "Vercel AI SDK",
];
