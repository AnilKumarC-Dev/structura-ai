import Appshell from "../components/Appshell";
import FlowDiagram from "../components/FlowDiagram";

export default function Home() {
  return (
    <Appshell>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <h1
          style={{
            fontSize: "30px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "6px",
          }}
        >
          Welcome to Structura<span style={{ color: "var(--primary)" }}>AI</span>
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "var(--muted)",
            maxWidth: "900px",
            marginBottom: "14px",
          }}
        >
          A unified intelligence layer that helps engineers discover
          architecture, processes, product knowledge and cross-team
          dependencies across the organization.
        </p>

        <FlowDiagram />
      </div>
    </Appshell>
  );
}
