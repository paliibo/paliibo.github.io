"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import { useVisibleInterval } from "@/lib/useVisibleInterval";

const LINES = [
  "POST /v1/notes → 201 · 48 ms",
  "job scribe.transcribe:8f2a → completed · 3.1 s",
  "pubsub media.process → ack",
  "webhook stripe.invoice.paid → reconciled",
  "SELECT … WHERE tenant_id = $1 · 4 ms",
  "push apns → delivered",
  "cron reconcile.payments → 1,204 rows",
  "GET /v1/patients?cursor=… → 200 · 22 ms",
  "job rag.embed:41c0 → 128 chunks",
  "ws tenant:acme → 37 clients",
  "job ehr.sync:cliniko → 3 notes pushed",
  "cloudtask pdf.render → 1 doc · 640 ms",
];

const VISIBLE = 4;

export function ActivityLog() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(VISIBLE - 1);

  const advance = useCallback(() => setTick((t) => t + 1), []);
  useVisibleInterval(advance, 1900, !reduce);

  const rows = Array.from({ length: VISIBLE }, (_, k) => {
    const idx = tick - (VISIBLE - 1) + k;
    return { key: idx, text: LINES[((idx % LINES.length) + LINES.length) % LINES.length] };
  });

  return (
    <ul className="relative space-y-0.5 font-mono text-[11px] leading-5 text-muted" aria-hidden>
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((row, i) => (
          <motion.li
            key={row.key}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i === rows.length - 1 ? 1 : 0.55, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.35 }}
            className="truncate"
          >
            <span className="text-moss">›</span> {row.text}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
