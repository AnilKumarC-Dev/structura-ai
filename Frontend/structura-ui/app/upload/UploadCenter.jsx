"use client";

import { useRef, useState } from "react";
import Appshell from "../../components/Appshell";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SOURCES = [
  { id: "pdf", icon: "📄", label: "PDF", accept: "application/pdf,.pdf", types: ["application/pdf"] },
  {
    id: "image",
    icon: "🖼️",
    label: "Image",
    accept: "image/png,image/jpeg,.png,.jpg,.jpeg",
    types: ["image/png", "image/jpeg", "image/jpg"],
  },
];

const COMING_SOON = [
  { icon: "💻", label: "Source Code" },
  { icon: "🎙️", label: "Voice Notes" },
  { icon: "🎥", label: "Meeting Recording" },
  { icon: "📚", label: "Documentation" },
];

const STATUS_STYLES = {
  uploading: { color: "var(--warning)", text: "Uploading…" },
  uploaded: { color: "var(--success)", text: "Uploaded" },
  failed: { color: "var(--danger)", text: "Failed" },
};

const card = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow)",
  borderRadius: "16px",
};

const primaryButton = {
  padding: "12px 24px",
  borderRadius: "12px",
  border: "none",
  background: "var(--grad-primary)",
  color: "var(--on-primary)",
  fontWeight: 600,
  cursor: "pointer",
};

async function uploadOne(file) {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${API_URL}/api/upload`, { method: "POST", body });

  if (!response.ok) {
    let detail = `Upload failed (${response.status})`;
    try {
      const data = await response.json();
      if (data.detail) detail = data.detail;
    } catch {}
    throw new Error(detail);
  }

  return response.json();
}

export default function UploadCenter() {
  const inputRef = useRef(null);
  const [source, setSource] = useState(SOURCES[0]);
  const [dragging, setDragging] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState(null);

  const busy = progress !== null;

  const openPicker = () => {
    if (!busy) inputRef.current?.click();
  };

  const selectSource = (item) => {
    if (!busy) setSource(item);
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0 || busy) return;

    const allowed = SOURCES.flatMap((s) => s.types);
    const valid = files.filter((f) => allowed.includes(f.type));
    const rejected = files.length - valid.length;

    if (valid.length === 0) {
      setMessage({ error: true, text: "Only PDF and image (PNG, JPG) files are supported." });
      return;
    }

    setMessage(
      rejected > 0
        ? { error: true, text: `${rejected} unsupported file(s) were skipped.` }
        : null
    );

    for (let i = 0; i < valid.length; i++) {
      const file = valid[i];
      const id = `${Date.now()}-${i}-${file.name}`;

      setProgress({ current: i + 1, total: valid.length, name: file.name });
      setJobs((prev) => [{ id, name: file.name, status: "uploading" }, ...prev]);

      try {
        await uploadOne(file);
        setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: "uploaded" } : j)));
      } catch (err) {
        const text =
          err instanceof TypeError
            ? "Cannot reach the backend. Make sure it is running on " + API_URL
            : err.message;
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: "failed", error: text } : j))
        );
        setMessage({ error: true, text: `${file.name}: ${text}` });
      }
    }

    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Appshell>
      <style>{`@keyframes ekf-spin { to { transform: rotate(360deg); } }`}</style>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={source.accept}
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "4px" }}>Ingestion Center</h1>
          <p style={{ color: "var(--muted)" }}>
            Transform organizational knowledge into searchable intelligence.
          </p>
        </div>

        <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0 }}>
          <div
            style={{
              ...card,
              background: "var(--grad-blue)",
              width: "320px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Knowledge Jobs</h3>

            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "16px",
                ...(jobs.length === 0
                  ? { alignItems: "center", justifyContent: "center", color: "var(--muted)" }
                  : {}),
              }}
            >
              {jobs.length === 0 && "No uploads yet"}
              {jobs.map((job) => {
                const s = STATUS_STYLES[job.status];
                return (
                  <div
                    key={job.id}
                    title={job.error || job.name}
                    style={{
                      border: "1px solid var(--border)",
                      background: "var(--tile)",
                      boxShadow: "var(--shadow-sm)",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      fontSize: "13px",
                    }}
                  >
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {job.name}
                    </div>
                    <div style={{ color: s.color, fontSize: "12px", marginTop: "4px" }}>
                      {s.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={openPicker}
              disabled={busy}
              style={{
                ...primaryButton,
                width: "100%",
                padding: "14px",
                opacity: busy ? 0.6 : 1,
              }}
            >
              + New Upload
            </button>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              minWidth: 0,
              minHeight: 0,
            }}
          >
            <div style={{ ...card, background: "var(--grad-silver)", padding: "16px" }}>
              <h2 style={{ marginBottom: "12px" }}>Select Knowledge Source</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                  gap: "10px",
                }}
              >
                {SOURCES.map((item) => {
                  const active = item.id === source.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => selectSource(item)}
                      style={{
                        padding: "10px",
                        border: `1px solid ${active ? "var(--primary)" : "var(--border-strong)"}`,
                        background: active ? "var(--primary-soft)" : "var(--tile)",
                        boxShadow: "var(--shadow-sm)",
                        borderRadius: "12px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: "24px" }}>{item.icon}</div>
                      <div>{item.label}</div>
                    </div>
                  );
                })}

                {COMING_SOON.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--tile)",
                      boxShadow: "var(--shadow-sm)",
                      borderRadius: "12px",
                      textAlign: "center",
                      opacity: 0.5,
                    }}
                  >
                    <div style={{ fontSize: "24px" }}>{item.icon}</div>
                    <div>{item.label}</div>
                    <div style={{ fontSize: "12px" }}>Coming Soon</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                ...card,
                background: "var(--grad-slate)",
                padding: "20px",
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h2 style={{ marginBottom: "12px" }}>Upload Asset</h2>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!busy) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                style={{
                  border: `2px dashed ${dragging ? "var(--primary)" : "var(--border-strong)"}`,
                  background: dragging ? "var(--primary-soft)" : "transparent",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <div style={{ color: "var(--muted)" }}>Drag & Drop {source.label} files here</div>
                <div style={{ color: "var(--muted)" }}>or</div>
                <button
                  onClick={openPicker}
                  disabled={busy}
                  style={{ ...primaryButton, opacity: busy ? 0.6 : 1 }}
                >
                  Select Files
                </button>
                {message && (
                  <div
                    style={{
                      color: message.error ? "var(--danger)" : "var(--success)",
                      fontSize: "13px",
                      textAlign: "center",
                      padding: "0 16px",
                    }}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {busy && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--overlay)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid var(--border-strong)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              animation: "ekf-spin 0.9s linear infinite",
            }}
          />
          <div style={{ fontSize: "18px" }}>
            Uploading {progress.current} of {progress.total}…
          </div>
          <div
            style={{
              color: "var(--muted)",
              maxWidth: "400px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {progress.name}
          </div>
        </div>
      )}
    </Appshell>
  );
}
