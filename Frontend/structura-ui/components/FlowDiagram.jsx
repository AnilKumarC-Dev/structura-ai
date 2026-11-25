"use client";

import { useEffect, useState } from "react";

const INGESTION = [
  {
    icon: "⬆️",
    title: "Upload",
    text: "You add a PDF or image in the Ingestion Center.",
  },
  {
    icon: "🗄️",
    title: "Blob Storage",
    text: "The original file is stored safely in Azure Blob Storage.",
  },
  {
    branch: [
      {
        icon: "📄",
        title: "Document Intelligence",
        tag: "PDF",
        text: "Reads text, tables and layout.",
      },
      {
        icon: "👁️",
        title: "Vision Service",
        tag: "Image",
        text: "Describes diagrams and extracts text.",
      },
    ],
  },
  {
    icon: "🧠",
    title: "Foundry IQ",
    text: "Cleans and enriches the extracted content.",
  },
  {
    icon: "✂️",
    title: "Chunking",
    text: "Splits content into small, meaningful pieces.",
  },
  {
    icon: "🔢",
    title: "Embeddings",
    text: "The embedding model turns each chunk into a vector.",
  },
  {
    icon: "🗃️",
    title: "Vector DB",
    text: "Vectors are indexed so they can be searched by meaning.",
  },
];

const QUERY = [
  {
    icon: "💬",
    title: "Your Question",
    text: "You ask something in the Knowledge Agent.",
  },
  {
    icon: "🔢",
    title: "Embedding Model",
    text: "Your question is converted into a vector.",
  },
  {
    icon: "🧠",
    title: "Foundry IQ",
    text: "Finds the most relevant chunks in the vector DB.",
  },
  {
    icon: "✨",
    title: "GPT-4 Model",
    text: "Reads those chunks and writes a grounded answer.",
  },
  {
    icon: "✅",
    title: "Answer",
    text: "You get a clear response with its sources.",
  },
];

const TICK_MS = 1500;
const PAUSE_TICKS = 2;

function useFlowStep(count, startDelay = 0) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let interval;
    const starter = setTimeout(() => {
      setActive(0);
      interval = setInterval(() => {
        setActive((a) => (a >= count + PAUSE_TICKS - 1 ? 0 : a + 1));
      }, TICK_MS);
    }, startDelay);

    return () => {
      clearTimeout(starter);
      clearInterval(interval);
    };
  }, [count, startDelay]);

  return active;
}

function StepCard({ step, state, compact }) {
  return (
    <div
      className={`ekf-card ${compact ? "ekf-compact" : ""}`}
      data-state={state}
    >
      <div className="ekf-icon">{step.icon}</div>
      <div className="ekf-body">
        <div className="ekf-title">
          {step.title}
          {step.tag && <span className="ekf-tag">{step.tag}</span>}
        </div>
        <div className="ekf-text">{step.text}</div>
      </div>
    </div>
  );
}

function Connector({ flowing, done }) {
  return (
    <div className="ekf-conn" data-done={done}>
      <div className="ekf-arrow" />
      {flowing && <div className="ekf-dot" />}
    </div>
  );
}

function Flow({ title, subtitle, steps, startDelay }) {
  const active = useFlowStep(steps.length, startDelay);

  return (
    <section className="ekf-flow" data-cols={steps.length}>
      <div>
        <h2 className="ekf-flow-title">{title}</h2>
        <p className="ekf-flow-sub">{subtitle}</p>
      </div>

      <div className="ekf-steps">
        {steps.map((step, i) => {
          const state = i === active ? "active" : i < active ? "done" : "idle";
          return (
            <div key={i} style={{ display: "contents" }}>
              <div className="ekf-col">
                {step.branch ? (
                  step.branch.map((b) => (
                    <StepCard key={b.title} step={b} state={state} compact />
                  ))
                ) : (
                  <StepCard step={step} state={state} />
                )}
              </div>
              {i < steps.length - 1 && (
                <Connector flowing={i === active} done={i < active} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function FlowDiagram() {
  return (
    <>
      <style>{`
        .ekf-root {
          container-type: inline-size;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .ekf-flow {
          flex: 1 1 0;
          background: var(--surface);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ekf-flow-title { font-size: 16px; font-weight: 600; margin-bottom: 2px; overflow-wrap: anywhere; }
        .ekf-flow-sub { font-size: 12.5px; color: var(--muted); }

        .ekf-steps { flex: 1; display: flex; align-items: stretch; }
        .ekf-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }

        .ekf-card {
          flex: 1;
          min-width: 0;
          border: 1px solid var(--border);
          background: var(--surface-2);
          border-radius: 12px;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 3px;
          opacity: 0.6;
          transition: border-color 0.4s, background 0.4s, opacity 0.4s;
        }
        .ekf-card.ekf-compact { padding: 8px 10px; }
        .ekf-card[data-state="done"] {
          border-color: color-mix(in srgb, var(--accent) 55%, transparent);
          background: var(--accent-soft);
          opacity: 1;
        }
        .ekf-card[data-state="active"] {
          border-color: var(--primary);
          background: var(--primary-soft);
          opacity: 1;
          animation: ekf-pulse 1.5s ease-in-out infinite;
        }
        .ekf-icon { font-size: 24px; line-height: 1.1; flex-shrink: 0; }
        .ekf-compact .ekf-icon { font-size: 18px; }
        .ekf-body { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
        .ekf-title { font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
        .ekf-text { font-size: 11.5px; line-height: 1.35; color: var(--muted); overflow-wrap: anywhere; }
        .ekf-tag {
          margin-left: 6px;
          font-size: 10px;
          font-weight: 500;
          color: var(--accent);
          border: 1px solid var(--accent);
          border-radius: 999px;
          padding: 1px 6px;
          white-space: nowrap;
        }

        .ekf-conn {
          --c: var(--border-strong);
          width: 26px;
          height: 2px;
          flex-shrink: 0;
          position: relative;
          align-self: center;
          background: var(--c);
          transition: background 0.4s;
        }
        .ekf-conn[data-done="true"] { --c: var(--accent); }
        .ekf-arrow {
          position: absolute;
          right: -1px;
          top: -4px;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 7px solid var(--c);
        }
        .ekf-dot {
          position: absolute;
          top: -3px;
          left: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary);
          box-shadow: 0 0 8px var(--primary);
          animation: ekf-travel ${TICK_MS}ms linear forwards;
        }

        @keyframes ekf-travel { from { left: 0; } to { left: calc(100% - 8px); } }
        @keyframes ekf-travel-v { from { top: 0; } to { top: calc(100% - 8px); } }
        @keyframes ekf-pulse {
          0%, 100% { box-shadow: 0 0 0 0 transparent; }
          50% { box-shadow: 0 0 14px 2px color-mix(in srgb, var(--primary) 40%, transparent); }
        }

        /* Vertical layout: shown when a flow does not have room for a single row */
        @container (max-width: 800px) {
          .ekf-flow[data-cols="7"] { flex: 0 0 auto; }
          .ekf-flow[data-cols="7"] .ekf-steps { flex-direction: column; }
          .ekf-flow[data-cols="7"] .ekf-col { flex: none; }
          .ekf-flow[data-cols="7"] .ekf-card { flex: none; flex-direction: row; text-align: left; justify-content: flex-start; gap: 12px; padding: 10px 12px; }
          .ekf-flow[data-cols="7"] .ekf-compact { padding: 8px 12px; }
          .ekf-flow[data-cols="7"] .ekf-conn { width: 2px; height: 18px; }
          .ekf-flow[data-cols="7"] .ekf-arrow { right: auto; left: -4px; top: auto; bottom: -1px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: none; border-top: 7px solid var(--c); }
          .ekf-flow[data-cols="7"] .ekf-dot { top: 0; left: -3px; animation-name: ekf-travel-v; }
        }
        @container (max-width: 580px) {
          .ekf-flow[data-cols="5"] { flex: 0 0 auto; }
          .ekf-flow[data-cols="5"] .ekf-steps { flex-direction: column; }
          .ekf-flow[data-cols="5"] .ekf-col { flex: none; }
          .ekf-flow[data-cols="5"] .ekf-card { flex: none; flex-direction: row; text-align: left; justify-content: flex-start; gap: 12px; padding: 10px 12px; }
          .ekf-flow[data-cols="5"] .ekf-conn { width: 2px; height: 18px; }
          .ekf-flow[data-cols="5"] .ekf-arrow { right: auto; left: -4px; top: auto; bottom: -1px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: none; border-top: 7px solid var(--c); }
          .ekf-flow[data-cols="5"] .ekf-dot { top: 0; left: -3px; animation-name: ekf-travel-v; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ekf-dot, .ekf-card[data-state="active"] { animation: none; }
        }
      `}</style>

      <div className="ekf-root">
        <Flow
          title="📥 Ingestion: how your documents become knowledge"
          subtitle="Every file you upload is stored, read, understood and indexed so it can be found later."
          steps={INGESTION}
          startDelay={0}
        />
        <Flow
          title="💡 Question answering: how you get an answer"
          subtitle="Your question is matched to the most relevant knowledge, then turned into a clear answer."
          steps={QUERY}
          startDelay={750}
        />
      </div>
    </>
  );
}
