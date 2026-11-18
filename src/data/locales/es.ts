/**
 * Spanish (Spain) version of the site content, layered on top of the English exports in
 * `@/data/profile` so ids, stacks, tags, flags and order stay in one place.
 * Project bullets, roles and the summary reuse the owner's Spanish CV (ats-forge es.json).
 */

import * as en from "@/data/profile";
import type { ExpertiseIcon, Project, ProjectTag } from "@/data/profile";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const numberWords = ["Cero", "Un", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez", "Once", "Doce"];

/** 6 → "Seis"; numbers past twelve stay as digits. */
const numberWordEs = (n: number): string => numberWords[n] ?? String(n);

const months: Record<string, string> = {
  Jan: "ene",
  Feb: "feb",
  Mar: "mar",
  Apr: "abr",
  May: "may",
  Jun: "jun",
  Jul: "jul",
  Aug: "ago",
  Sep: "sep",
  Oct: "oct",
  Nov: "nov",
  Dec: "dic",
};

/** "Sep 2025" → "sep 2025", "Present" → "Actualidad". Unknown strings pass through. */
const translateDate = (value: string): string =>
  value === "Present" ? "Actualidad" : value.replace(/^([A-Z][a-z]{2})\b/, (m) => months[m] ?? m);

// ---------------------------------------------------------------------------
// Site
// ---------------------------------------------------------------------------

const site = {
  ...en.site,
  role: "Ingeniero Full-Stack",
  /** Hero sentence after "<role> con <years> años" (the UI supplies the prefix). */
  intro: "llevando a producción SaaS para equipos de sanidad, fintech, logística y educación en el Reino Unido, la UE y EE. UU.",
  location: "Alicante, España",
  summary:
    "Ingeniero Full-Stack con 5 años de experiencia desarrollando plataformas SaaS en producción para clientes del sector sanitario, fintech, logística y educación en el Reino Unido, la UE y EE. UU. TypeScript en todo el stack: APIs REST con NestJS y Node.js, aplicaciones web con React y Next.js, apps móviles con React Native (Expo) publicadas en App Store y Google Play, y PostgreSQL.",
  availability:
    "Abierto a trabajo presencial e híbrido en España, trabajo remoto en la UE y reubicación.",
  languages: [
    { language: "Inglés", level: "C1, certificado" },
    { language: "Ucraniano", level: "Nativo" },
  ],
};

const heroPhrases: string[] = [
  "plataformas SaaS multi-tenant",
  "pipelines asíncronos con BullMQ y Pub/Sub",
  "apps React Native que llegan a las tiendas",
  "funcionalidades LLM y RAG sobre pgvector",
  "integraciones de pagos y EHR",
];

// ---------------------------------------------------------------------------
// Expertise (keyed by icon)
// ---------------------------------------------------------------------------

const expertiseText: Record<ExpertiseIcon, { title: string; text: string }> = {
  server: {
    title: "Backend y arquitectura",
    text: "APIs REST con NestJS y Node.js diseñadas como sistemas multi-tenant y orientados a eventos, con RBAC y aislamiento entre tenants desde el primer día.",
  },
  workflow: {
    title: "Procesamiento asíncrono",
    text: "Pipelines en segundo plano sobre Redis, BullMQ, RabbitMQ y Google Pub/Sub para importaciones, conciliaciones, medios y generación de documentos.",
  },
  layout: {
    title: "Frontends web",
    text: "Aplicaciones con React y Next.js, TanStack Query, Zustand y Tailwind, desde portales de pacientes hasta paneles financieros.",
  },
  smartphone: {
    title: "Móvil",
    text: "Apps con React Native y Expo con notificaciones push, inicio de sesión con Apple y Google e informes de errores, publicadas en App Store y Google Play.",
  },
  sparkles: {
    title: "IA y funcionalidades LLM",
    text: "Pipelines RAG sobre pgvector, transcripción y flujos LLM con OpenAI y Anthropic, además de experiencia práctica en evaluación de agentes y diseño de rúbricas.",
  },
  creditcard: {
    title: "Pagos e integraciones",
    text: "Facturación con Stripe y Paysera, sistemas EHR, plataformas de ticketing y APIs geoespaciales conectados mediante webhooks, OAuth y conciliación.",
  },
};

const expertise = en.expertise.map((a) => ({ ...a, ...expertiseText[a.icon] }));

// ---------------------------------------------------------------------------
// Projects (keyed by id; ids that exist only in a build variant fall back to English)
// ---------------------------------------------------------------------------

type BaseProjectId =
  | "motics"
  | "eos"
  | "homemoney"
  | "inkasso"
  | "longevity"
  | "rozumnyk"
  | "baulera"
  | "surge-ai"
  | "tender"
  | "aspra"
  | "welspot"
  | "fast-forward"
  | "saveface"
  | "eyevi";

type ProjectText = Pick<Project, "title" | "tagline" | "role" | "country" | "summary" | "highlights"> & {
  name?: string;
};

const projectText: Record<BaseProjectId, ProjectText> = {
  motics: {
    title: "Motics — Plataforma multiagente para el sector sanitario",
    tagline: "Plataforma multiagente para el sector sanitario",
    role: "Desarrollador Full-Stack / Arquitecto de software",
    country: "Reino Unido",
    summary:
      "SaaS sanitario que utilizan clínicas de todo el Reino Unido: un escriba médico con IA que creció hasta convertirse en una suite de operaciones clínicas. Un monorepo Nx/pnpm con una aplicación web en Next.js, una app móvil en Expo y servicios worker en Google Cloud.",
    highlights: [
      "Lideré la arquitectura y el desarrollo full-stack de una plataforma SaaS sanitaria desde su concepción hasta producción, que hoy utilizan clínicas de todo el Reino Unido. Construida como un monorepo Nx/pnpm que abarca la aplicación web en Next.js, la app móvil en React Native (Expo) y los servicios de backend.",
      "Amplié el producto de un escriba médico con IA a una suite de operaciones clínicas: documentación clínica, facturación, automatización de la comunicación con pacientes y flujos de trabajo basados en agentes.",
      "Diseñé la infraestructura de workers asíncronos en Google Cloud (Cloud Run, Pub/Sub y Cloud Tasks con Redis) para ejecutar flujos de IA, transcripción de voz a texto y pipelines de medios, con una transcripción independiente del proveedor entre Deepgram, AssemblyAI y proveedores de LLM.",
      "Construí la capa de procesamiento duradero del escriba: proyecciones duraderas de trabajos en la base de datos web, el cambio de fuente de los resúmenes, la recuperación de grabaciones huérfanas y fixtures de paridad de referencia que mantienen estable la salida de los prompts entre cambios de modelo.",
      "Construí y amplié un servicio de integraciones dedicado en FastAPI sobre Cloud Run que gestiona las credenciales de los proveedores, OAuth, las suscripciones a webhooks y el enrutamiento por shards regionales del Reino Unido, con migraciones de Alembic, Secret Manager y observabilidad con Sentry/Amplitude.",
      "Desarrollé integraciones de EHR con Cliniko, Nookal, Meddbase, Semble, Splose y Dentally, incluido el envío de notas clínicas, el mapeo de identidades y la conciliación; además de la facturación con Healthcode y Stripe, la sincronización de buzones de Gmail y Microsoft 365, SMS con Twilio y dispositivos de ciencias del deporte de Vald (ForceDecks, ForceFrame, NordBord, HumanTrak, SmartSpeed, DynaMo).",
      "Migré los datos de producción de Firebase a PostgreSQL con Drizzle ORM, implementé la facturación con Stripe y publiqué las apps móviles en Apple App Store y Google Play con notificaciones push, inicio de sesión con Apple y Google e informes de errores.",
    ],
  },
  eos: {
    title: "Eos — Plataforma de gestión de estudios de Pilates y Barre",
    tagline: "Plataforma de gestión de estudios · producto propio",
    role: "Fundador / Desarrollador Full-Stack",
    country: "Ucrania",
    summary:
      "Mi propio producto, aún sin lanzar: una plataforma de gestión para estudios de Pilates, Barre y fitness en grupo llevados por sus propietarios. Un monorepo pnpm/Turbo con una API NestJS, un CRM en Next.js, una app Expo con modos Coach y Student y un calendario de reservas público.",
    highlights: [
      "Desarrollo mi propio producto de principio a fin: decisiones de producto, UX y todo el stack, en un único monorepo TypeScript (pnpm workspaces, Turbo) con una API, un worker, un CRM en el navegador, una app móvil, un sitio público y una consola de operador.",
      "Calendario de reservas público en el sitio de marketing: un estudio comparte un enlace o un código QR y los clientes reservan una clase sin instalar la app ni iniciar sesión.",
      "Una única app Expo con modos Coach y Student para móvil y tablet, con un modo sin conexión que sigue mostrando los datos guardados en lugar de banners de error (TanStack Query persistido en AsyncStorage).",
      "Libro de bonos y créditos, listas de espera, clases privadas y reservas recurrentes sobre PostgreSQL con Drizzle ORM, con tareas en segundo plano en graphile-worker.",
      "Temas visuales por estudio sobre un único binario de app con la marca del producto, de modo que cada estudio tiene su propio aspecto sin una compilación aparte.",
      "Una build de demostración del CRM que funciona sobre una API demo en memoria con datos inventados, para poder mostrar el producto sin backend.",
      "Contabilidad para propietarios de estudios: seguimiento de ingresos, estimación de impuestos y exportación a CSV.",
      "Auditoría de la app, el CRM y el calendario según cinco leyes de UX (efecto Zeigarnik, posición serial, atención selectiva, ley de Jakob, escasez honesta): siete hallazgos, los siete corregidos e integrados.",
    ],
  },
  homemoney: {
    title: "HomeMoney — Analítica financiera multi-tenant",
    tagline: "Analítica financiera multi-tenant",
    role: "Desarrollador Full-Stack",
    country: "Estados Unidos",
    summary:
      "Plataforma empresarial multi-tenant de libro mayor y analítica: cuentas por cobrar y por pagar, conciliación de activos, un motor de fórmulas configurable e informes protegidos con AES-256.",
    highlights: [
      "Desarrollé una plataforma empresarial multi-tenant de libro mayor y analítica financiera que centraliza la contabilidad, la gestión del flujo de caja y los informes financieros en estructuras organizativas complejas.",
      "Diseñé servicios de backend para la gestión del libro mayor, las cuentas por cobrar y por pagar, la conciliación de activos y cálculos financieros configurables, con control de acceso granular basado en roles y aislamiento seguro de los datos de cada empresa y grupo empresarial.",
      "Construí pipelines automatizados en segundo plano que importan y normalizan datos financieros de sistemas bancarios y fuentes externas, lo que permite procesar y conciliar grandes volúmenes de transacciones.",
      "Desarrollé un motor de fórmulas dinámico que permite a los administradores configurar cálculos financieros y lógica de informes a medida sin cambios de código.",
      "Implementé paneles financieros, informes de balance, analítica del flujo de caja y exportación segura de datos, con cifrado AES-256 y gestión de claves para proteger los datos sensibles.",
    ],
  },
  inkasso: {
    title: "Inkasso — Gestión de cobros y automatización financiera empresarial",
    tagline: "Gestión de cobros y automatización financiera",
    role: "Desarrollador Full-Stack",
    country: "Suiza, Alemania, Italia",
    summary:
      "Plataforma multi-tenant de gestión de cobros para la región DACH e Italia: ciclo de vida del deudor, facturación, conciliación de pagos, QR-bills suizas y pipelines BullMQ para operaciones financieras de gran volumen.",
    highlights: [
      "Desarrollé y mejoré una plataforma empresarial multi-tenant de gestión de cobros y automatización financiera para organizaciones de Italia, Alemania y Suiza.",
      "Diseñé servicios de backend que automatizan la gestión del ciclo de vida de los deudores, la facturación, la conciliación de pagos, el cálculo de intereses y costes legales y los planes de pago, con reglas de negocio específicas de cada tenant y requisitos de cumplimiento propios de cada país.",
      "Diseñé pipelines de procesamiento asíncrono con Redis y BullMQ para orquestar operaciones financieras de gran volumen: ingesta automatizada de datos, importación de pagos, conciliaciones programadas y procesamiento de documentos.",
      "Construí la generación dinámica de documentos para facturas, notificaciones legales, certificados de liquidación, informes y QR-bills suizas, e integré canales de comunicación por email y SMS.",
      "Implementé informes masivos, gestión documental y sincronización de tenants, y mejoré la fiabilidad de la plataforma con workers en segundo plano, tareas programadas y flujos transaccionales robustos.",
    ],
  },
  longevity: {
    title: "Longevity — Plataforma sanitaria basada en IA",
    tagline: "Plataforma sanitaria basada en IA",
    role: "Desarrollador Full-Stack",
    country: "Letonia",
    summary:
      "Plataforma clínica de análisis genéticos y de sangre en la que la API de OpenAI genera evaluaciones médicas y un backend orientado a eventos dispara notificaciones a pacientes, paneles para médicos y flujos de seguimiento.",
    highlights: [
      "Construí una plataforma clínica de análisis genéticos y de sangre con NestJS y la API de OpenAI que genera evaluaciones médicas detalladas con LLM, tendencias históricas de salud y recomendaciones por marcador.",
      "Diseñé un sistema orientado a eventos que, al completarse un análisis de IA, envía al instante notificaciones a los pacientes, actualiza los paneles de los médicos y automatiza los flujos posteriores al análisis.",
      "Entregué una SPA muy ágil con React, Vite, Tailwind CSS y TanStack Query, con Zustand para el estado complejo en portales de pacientes y paneles de administración completos.",
      "Construí una API REST sin estado con Node.js, PostgreSQL y TypeORM, con almacenamiento seguro de archivos en AWS S3, generación automática de clientes OpenAPI e integración de pagos con Paysera para la reserva de consultas.",
    ],
  },
  rozumnyk: {
    title: "Rozumnyk — Asistente de conocimiento agrícola basado en IA",
    tagline: "Asistente de conocimiento agrícola con IA",
    role: "Desarrollador Full-Stack",
    country: "Ucrania",
    summary:
      "Asistente RAG en ucraniano para el sector agrícola: ingesta de documentos, embeddings y recuperación semántica sobre pgvector, servido por un backend modular en NestJS sobre Kubernetes.",
    highlights: [
      "Diseñé y entregué una plataforma de asistente de IA de nivel empresarial centrada en interacciones de alta calidad en ucraniano, que combina LLMs modernos con un pipeline de generación aumentada por recuperación (RAG).",
      "Diseñé un backend modular en NestJS encargado de la ingesta de documentos, el procesamiento asíncrono, la generación de embeddings vectoriales y la recuperación semántica, con Redis, BullMQ, Ollama y pgvector para escalar y responder con baja latencia.",
      "Establecí un modelo de autorización basado en roles para administradores, moderadores y usuarios finales, y desarrollé paneles operativos para la gestión de contenidos y del sistema.",
      "Contenericé la solución completa con Docker y Kubernetes, con MinIO como almacenamiento de objetos seguro para los activos de conocimiento.",
    ],
  },
  baulera: {
    title: "Baulera — SaaS multi-tenant de facturación y contabilidad",
    tagline: "SaaS multi-tenant de facturación y contabilidad",
    role: "Desarrollador Full-Stack",
    country: "Lituania",
    summary:
      "SaaS de facturación, compras y contabilidad para empresas multilingües, con jerarquías RBAC, facturación con Stripe, automatización de PDF e integraciones contables lituanas.",
    highlights: [
      "Lideré la arquitectura y el desarrollo full-stack de una plataforma SaaS financiera multi-tenant que centraliza la facturación, las compras y los flujos contables en entornos empresariales multilingües.",
      "Diseñé sistemas de backend escalables con Express, MySQL y Sequelize, con una arquitectura RBAC para jerarquías de empresas seguras y flujos de trabajo delegados.",
      "Construí pipelines financieros automatizados con Redis y tareas programadas para la facturación recurrente, el seguimiento de pagos y los flujos de comunicación.",
      "Integré la infraestructura de pagos de Stripe, desarrollé la automatización documental para el procesamiento de recibos y la generación de PDF, y entregué paneles financieros en React con las integraciones contables de Finvalda, Ivesk.lt y Rekvizitai.lt.",
      "Implementé una autenticación de nivel empresarial, una gestión del ciclo de vida de los datos conforme al RGPD y un tratamiento seguro de los datos de varias empresas.",
    ],
  },
  "surge-ai": {
    name: "Evaluación de agentes de programación",
    title: "Programa de evaluación de agentes de programación — Surge AI (cliente: laboratorio de IA de vanguardia, bajo NDA)",
    tagline: "Evaluación de agentes de programación autónomos",
    role: "Evaluador de agentes de IA",
    country: "Remoto",
    summary:
      "Diseño de tareas de ingeniería sobre bases de código de nivel producción para capturar fallos reproducibles en un agente de programación autónomo, y redacción de las rúbricas con las que las puntúa un evaluador LLM automatizado.",
    highlights: [
      "Construí entornos de RL de programación para un benchmark de SDLC: tareas de ingeniería realistas sobre bases de código de nivel producción en sandboxes de Docker, diseñadas para provocar y capturar fallos de comportamiento reproducibles en un agente de programación autónomo.",
      "Redacté las guías para el evaluador: rúbricas privilegiadas que consume un evaluador LLM automatizado, con una puntuación calibrada en siete dimensiones de comportamiento.",
      "Generé 4+ ejecuciones de referencia por tarea (trazas de evaluación de referencia) para demostrar que los fallos son reproducibles y validar que las rúbricas distinguen un comportamiento sólido del agente de uno débil.",
      "Iteré las rúbricas en ciclos de reevaluación, volviendo a puntuar trayectorias congeladas del agente para aislar el efecto de cada cambio de rúbrica en la distribución de puntuaciones.",
      "Apliqué un umbral de consenso de ~80% de ingenieros sénior para separar los fallos materiales con impacto real en el negocio de las preferencias de estilo.",
      "Aporté datos de evaluación de agentes para RLHF dentro de un programa distribuido de gran escala; participé en reuniones periódicas con el cliente sobre el diseño de tareas y los criterios de evaluación.",
    ],
  },
  tender: {
    title: "Tender Service Platform — Plataforma B2B de compras y licitaciones",
    tagline: "Plataforma B2B de compras y licitaciones",
    role: "Desarrollador Full-Stack",
    country: "Lituania",
    summary:
      "Plataforma B2B multi-tenant de compras y licitaciones, en desarrollo desde el MVP: 13 servicios Java 21 / Spring Boot 3 sobre RabbitMQ RPC, identidad en Keycloak con un realm por organización compradora y un frontend en Next.js con tipos de API generados desde OpenAPI.",
    highlights: [
      "Desarrollo desde el MVP una plataforma B2B multi-tenant de compras y licitaciones: 13 servicios Java 21 / Spring Boot 3 (dos gateways de entrada, un receptor de webhooks y diez servicios de dominio) que se comunican por RabbitMQ RPC, con PostgreSQL y Liquibase por servicio e identidad en Keycloak con un realm por organización compradora y un realm compartido para proveedores.",
      "Diseñé el contrato de errores compartido de la plataforma: un único sobre de respuesta REST con IDs de petición, códigos de error estables transportados por RabbitMQ RPC y un mapeo de errores en los gateways que informa de un servicio inaccesible como 503 y no como un fallo de autenticación.",
      "Implementé la gestión interna de usuarios sobre Keycloak: invitaciones con ventanas configurables, activación en el primer inicio de sesión, cambios de rol protegidos para que nunca falte un administrador, desactivación y reactivación, restablecimiento de contraseñas y MFA por el administrador bajo bloqueos de usuario en Redis, y una extensión SMS de Keycloak con endpoints de administración adicionales.",
      "Añadí un outbox transaccional con confirmaciones del publicador de RabbitMQ, de modo que los eventos del ciclo de vida llegan al registro de auditoría append-only solo cuando el broker los confirma, y limité el registro de auditoría a administradores y auditores.",
      "Entregué la transferencia del trabajo al desactivar un usuario (las licitaciones y tareas propias pasan de forma atómica, con rollback), el autorregistro de proveedores con solicitudes de adhesión para empresas duplicadas y la gestión del equipo del proveedor (invitar, reenviar y cancelar invitaciones a compañeros) en los gateways de compradores y proveedores.",
      "Configuré el frontend en Next.js 16 con tipos de API generados desde OpenAPI (orval) y Storybook, y generé skills compartidas de Claude Code y Codex a partir de las reglas de código del equipo para el desarrollo asistido por IA.",
      "Construyo el ciclo de vida de la licitación (borrador, publicación, recepción de ofertas, evaluación, selección del ganador) con ofertas, puntuación por partidas, niveles de aprobación por importe y generación de contratos con firma electrónica Dokobit.",
      "Construyo el servicio de asistente de IA sobre la OpenAI API para redactar licitaciones, responder preguntas y recomendar el ganador de forma consultiva, junto con búsqueda semántica OpenSearch k-NN sobre los eventos de la plataforma y sincronización del catálogo desde Microsoft Dynamics 365.",
    ],
  },
  aspra: {
    title: "ASPRA — Sistema de gestión del aprendizaje",
    tagline: "Sistema de gestión del aprendizaje",
    role: "Desarrollador Full-Stack",
    country: "Ucrania",
    summary:
      "LMS con Next.js y NestJS con cursos SCORM, evaluaciones automatizadas, chat en tiempo real y un pipeline de vídeo distribuido globalmente sobre S3 y CloudFront.",
    highlights: [
      "Desarrollé un sistema de gestión del aprendizaje escalable con Next.js y NestJS, que permite crear cursos dinámicos e integrar módulos SCORM complejos y flujos de evaluación avanzados.",
      "Creé una arquitectura de autenticación segura con un control de acceso estricto basado en roles en paneles de control completos para administradores, instructores y estudiantes.",
      "Implementé un motor interactivo de gestión de tareas con pruebas automatizadas, entregas multimedia y calificación estructurada por parte de los instructores, además de chat en tiempo real y un seguimiento preciso del progreso de los usuarios.",
      "Optimicé las APIs REST del backend sobre PostgreSQL y TypeORM, y desarrollé un pipeline de distribución global de contenido multimedia con AWS S3 y CloudFront para un streaming de vídeo fluido.",
      "Agilicé el despliegue y mejoré la fiabilidad con la contenerización en Docker y pipelines de CI/CD automatizados.",
    ],
  },
  welspot: {
    title: "WelSpot — Sistema de gestión médica",
    tagline: "Sistema de gestión médica",
    role: "Desarrollador Full-Stack",
    country: "Estados Unidos",
    summary:
      "Programación de citas y gestión de pacientes y personal con React y NestJS, con sincronización de estado por Socket.IO y búsqueda difusa con Elasticsearch en millones de registros clínicos.",
    highlights: [
      "Desarrollé una plataforma escalable de gestión médica con React y NestJS para agilizar la programación compleja de citas y la gestión de perfiles de pacientes y personal.",
      "Habilité la sincronización en tiempo real del estado de la aplicación con Socket.IO y mensajería con RabbitMQ.",
      "Desarrollé y documenté APIs REST robustas con Swagger sobre PostgreSQL y Prisma, e implementé Elasticsearch para ofrecer búsquedas difusas rápidas en millones de notas clínicas e historiales médicos.",
      "Apliqué un control de acceso estricto basado en roles con JWT y flujos documentales conformes a la normativa, con AWS S3 para el almacenamiento seguro de archivos médicos.",
    ],
  },
  "fast-forward": {
    title: "Fast Forward — Sistema de gestión del transporte",
    tagline: "Sistema de gestión del transporte",
    role: "Desarrollador Full-Stack",
    country: "Estados Unidos",
    summary:
      "TMS multi-tenant para intermediación de carga que cubre cotización, despacho, seguimiento y facturación, con importaciones EDI en BullMQ y monitorización de envíos en tiempo real sobre WebSockets.",
    highlights: [
      "Desarrollé un TMS multi-tenant escalable para operaciones de intermediación de carga que cubre todo el ciclo de vida del envío, desde la cotización y la creación de cargas hasta el despacho, el seguimiento y la facturación.",
      "Construí paneles de intermediación adaptables para despachadores, gestores de transportistas y clientes, con un control de acceso seguro basado en roles y aislamiento entre tenants.",
      "Implementé flujos de alta de transportistas, la gestión de confirmaciones de tarifas, el procesamiento de documentos y la facturación automatizada.",
      "Desarrollé el procesamiento asíncrono en segundo plano con BullMQ y Redis para importaciones EDI, actualizaciones de seguimiento, generación de facturas y sincronización de documentos.",
      "Diseñé la monitorización de envíos en tiempo real sobre WebSockets y desplegué servicios en contenedores en AWS con pipelines de CI/CD automatizados.",
    ],
  },
  saveface: {
    title: "Saveface — Intercambio de entradas a precio nominal",
    tagline: "Intercambio de entradas a precio nominal",
    role: "Desarrollador Full-Stack Mobile",
    country: "Estados Unidos",
    summary:
      "Marketplace en React Native de entradas a precio nominal: transferencias verificadas de Ticketmaster y AXS, retenciones de pago de 72 horas, revisión antifraude y colas de compra automática en BullMQ.",
    highlights: [
      "Construí una aplicación móvil multiplataforma con un backend escalable para el intercambio de entradas a precio nominal, con el cliente nativo desarrollado en React Native y Expo.",
      "Desarrollé una API REST robusta, documentada con Swagger, con NestJS y PostgreSQL mediante TypeORM para aplicar una lógica de marketplace compleja, con retenciones seguras de pagos durante 72 horas y flujos de revisión antifraude.",
      "Coordiné transferencias verificadas de entradas digitales a través de Ticketmaster y AXS.",
      "Construí sistemas de colas de compra automática de alta concurrencia y listas de espera de entrada general con Redis y BullMQ, con pagos con Stripe, monitorización con Sentry y refuerzo de seguridad con Helmet.",
    ],
  },
  eyevi: {
    title: "EyeVi — Sistema de cartografía LIDAR",
    tagline: "Sistema de cartografía LIDAR",
    role: "Desarrollador Full-Stack",
    country: "Estonia",
    summary:
      "Cartografía 3D de infraestructuras viarias: nubes de puntos LIDAR masivas renderizadas en el navegador con Three.js y Potree, estadísticas geoespaciales con PostGIS y cuotas de API medidas con Stripe.",
    highlights: [
      "Construí una plataforma escalable de cartografía 3D de alta precisión y de inventario digital de infraestructuras viarias.",
      "Desarrollé un sistema de visualización en tiempo real de calles escaneadas en 3D, con Three.js y Potree para renderizar nubes de puntos LIDAR masivas directamente en el navegador.",
      "Diseñé un backend en NestJS sobre PostgreSQL con la extensión PostGIS para calcular estadísticas geoespaciales complejas, e integré ArcGIS para la analítica espacial empresarial.",
      "Desarrollé una arquitectura de suscripciones basada en tokens sobre Stripe para gestionar la facturación automática y las cuotas de uso de la API.",
      "Implementé flujos de carga de geodatos de gran volumen con AWS S3 y optimicé el rendimiento del renderizado con caché en Redis.",
    ],
  },
};

const projectTextById: Record<string, ProjectText | undefined> = projectText;

const projects: Project[] = en.projects.map((p) => {
  const t = projectTextById[p.id];
  return t ? { ...p, ...t } : p;
});

// ---------------------------------------------------------------------------
// Filters, skills, stats
// ---------------------------------------------------------------------------

const filterLabels: Record<ProjectTag | "all", string> = {
  all: "Todos",
  healthcare: "Sanidad",
  fintech: "Fintech",
  ai: "IA y LLM",
  mobile: "Móvil",
  geo: "Logística y Geo",
  education: "Educación",
};

const projectFilters = en.projectFilters.map((f) => ({ ...f, label: filterLabels[f.id] }));

type SkillCategory =
  | "Backend"
  | "AI & LLM"
  | "Frontend"
  | "Mobile"
  | "Databases & ORMs"
  | "Languages"
  | "Payments & Integrations"
  | "Testing & Quality"
  | "Cloud & DevOps";

const skillCategories: Record<SkillCategory, string> = {
  Backend: "Backend",
  "AI & LLM": "IA y LLM",
  Frontend: "Frontend",
  Mobile: "Móvil",
  "Databases & ORMs": "Bases de datos y ORM",
  Languages: "Lenguajes",
  "Payments & Integrations": "Pagos e integraciones",
  "Testing & Quality": "Testing y calidad",
  "Cloud & DevOps": "Cloud y DevOps",
};

const skillCategoryById: Record<string, string | undefined> = skillCategories;

const skills = en.skills.map((g) => ({ ...g, category: skillCategoryById[g.category] ?? g.category }));

type StatLabel = "years of experience" | "production projects" | "countries served" | "third-party integrations";

const statLabels: Record<StatLabel, string> = {
  "years of experience": "años de experiencia",
  "production projects": "proyectos en producción",
  "countries served": "países atendidos",
  "third-party integrations": "integraciones con terceros",
};

const statLabelById: Record<string, string | undefined> = statLabels;

const stats = en.stats.map((s) => ({ ...s, label: statLabelById[s.label] ?? s.label }));

// ---------------------------------------------------------------------------
// Jobs, education, open source
// ---------------------------------------------------------------------------

type JobCompany = "UAPP LLC" | "CubeX" | "ACCA" | "WelSpot Inc.";

const jobText: Record<JobCompany, { role: string; location: string }> = {
  "UAPP LLC": { role: "Desarrollador Full-Stack", location: "Remoto · Wilmington, Delaware, EE. UU." },
  CubeX: { role: "Desarrollador Full-Stack", location: "Remoto · Zaporiyia, Ucrania" },
  ACCA: { role: "Desarrollador Full-Stack", location: "Híbrido · Fairfax, Virginia, EE. UU." },
  "WelSpot Inc.": { role: "Desarrollador Full-Stack", location: "Remoto · Miami, Florida, EE. UU." },
};

const jobTextById: Record<string, { role: string; location: string } | undefined> = jobText;

const jobs = en.jobs.map((j) => ({
  ...j,
  ...jobTextById[j.company],
  start: translateDate(j.start),
  end: translateDate(j.end),
}));

type Institution = "Cherkasy State Business College" | "Northern Virginia Community College";

const educationText: Record<Institution, { degree: string; location: string }> = {
  "Cherkasy State Business College": { degree: "Grado (BSc) en Ingeniería de Software", location: "Cherkasy, Ucrania" },
  "Northern Virginia Community College": { degree: "Diploma en Diseño y Desarrollo Web", location: "Virginia, EE. UU." },
};

const educationTextById: Record<string, { degree: string; location: string } | undefined> = educationText;

const education = en.education.map((e) => ({ ...e, ...educationTextById[e.institution] }));

type RepoName = "leadscope" | "dunlin" | "mark-map" | "data-room" | "quizbrain" | "nx-vi-hub" | "autoreel";

const repoDescriptions: Record<RepoName, string> = {
  leadscope:
    "Inteligencia en tiempo real sobre el pipeline de ventas: un feed SSE en vivo, un pipeline con arrastrar y soltar, previsiones y rankings sobre un backend con datos de ejemplo.",
  dunlin:
    "API multi-tenant de facturación, reclamación de impagos y conciliación de pagos con row-level security de PostgreSQL y workers BullMQ.",
  "mark-map":
    "Mapa y planificador de viajes local-first y sin claves de API: añade paradas, optimiza la ruta y comparte el viaje entero con un único enlace.",
  "data-room":
    "Una sala de datos virtual que funciona íntegramente en el navegador: documentos de due diligence tras enlaces con contraseña y caducidad, con seguimiento de lectura.",
  quizbrain:
    "App de estudio offline-first: cuestionarios, flashcards con repetición espaciada SM-2 y un juego de emparejar.",
  "nx-vi-hub":
    "Hub de vídeo autoalojable sobre un único contrato ts-rest: un monorepo Nx con una API Express y una app Next.js 15, probado de extremo a extremo contra una base de datos real.",
  autoreel:
    "Convierte una carpeta de grabaciones en bruto en un reel de 20 minutos: transcripción local, un LLM que elige los mejores momentos y líneas de tiempo para Premiere Pro y DaVinci Resolve.",
};

const repoDescriptionById: Record<string, string | undefined> = repoDescriptions;

const openSource = en.openSource.map((r) => ({ ...r, description: repoDescriptionById[r.name] ?? r.description }));

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

const copy = {
  ...en.copy,
  projectsTitle: `${numberWordEs(en.projects.filter((p) => !p.inDevelopment).length)} sistemas en producción, un solo stack.`,
  projectsDescription:
    "SaaS multi-tenant, pipelines asíncronos y apps móviles desarrollados de principio a fin para equipos del Reino Unido, la UE y EE. UU. Abre una tarjeta para ver la historia completa.",
  experienceTitle: `${numberWordEs(en.site.years)} años, cuatro equipos, tres husos horarios.`,
  experienceDescription:
    "Remote-first desde el principio: equipos de EE. UU., de Ucrania y ahora de la UE, siempre en inglés, siempre responsable de las funcionalidades de principio a fin.",
};

export const es = {
  site,
  heroPhrases,
  expertise,
  projects,
  projectFilters,
  skills,
  stats,
  jobs,
  education,
  openSource,
  copy,
};
