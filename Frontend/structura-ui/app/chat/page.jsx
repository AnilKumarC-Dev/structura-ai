import Appshell from "../../components/Appshell";

export default function ChatPage() {
  return (
    <Appshell>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "6px",
            }}
          >
            Knowledge Agent
          </h1>

          <p
            style={{
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            Ask questions across your organization's knowledge.
          </p>

          <div>
            <div
              style={{
                marginBottom: "8px",
                color: "var(--muted)",
              }}
            >
              Context
            </div>

            <select
              className="ui-input"
              style={{
                width: "min(320px, 100%)",
                padding: "12px",
              }}
            >
              <option>All Knowledge</option>
              <option>Payments Platform</option>
              <option>Platform Engineering</option>
              <option>Security Engineering</option>
              <option>Merchant Portal</option>
              <option>Customer Onboarding</option>
              <option>API Gateway</option>
            </select>
          </div>
        </div>

        <div
          className="ui-card"
          style={{
            flex: 1,
            marginBottom: "20px",
            padding: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              Start a conversation
            </h2>

            <p
              style={{
                color: "var(--muted)",
                maxWidth: "700px",
              }}
            >
              Ask about architecture, processes, onboarding,
              dependencies, systems, products, diagrams,
              documentation and more.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <input
            className="ui-input"
            placeholder="Ask anything about your organization..."
            style={{
              flex: 1,
              minWidth: 0,
              padding: "16px",
            }}
          />

          <button
            className="ui-btn"
            style={{
              padding: "16px 28px",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </Appshell>
  );
}