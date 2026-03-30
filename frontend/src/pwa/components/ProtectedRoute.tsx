import { useState } from "react";
import { loginWithDKBank, setToken } from "@/api/client";

interface Props {
  onLogin: () => void;
  children?: React.ReactNode;
}

export function ProtectedRoute({ onLogin }: Props) {
  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginWithDKBank(cid.trim());
      setToken(res.token);
      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: 400, margin: "80px auto", padding: "0 20px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
          Sign in to continue
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 8 }}>
          Enter your DK Bank CID to access your account
        </p>
      </div>

      <form onSubmit={handleLogin} style={{
        width: "100%", display: "flex", flexDirection: "column", gap: 12,
        background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
        borderRadius: 16, padding: 24,
      }}>
        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-subtle)" }}>
          DK Bank CID
        </label>
        <input
          type="text"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          placeholder="11-digit CID"
          maxLength={11}
          required
          style={{
            padding: "10px 14px", borderRadius: 10,
            border: "1px solid var(--glass-border)",
            background: "var(--glass-bg)", color: "var(--text-main)",
            fontSize: "1rem", outline: "none",
          }}
        />
        {error && (
          <div style={{ fontSize: "0.8rem", color: "#ef4444" }}>{error}</div>
        )}
        <button
          type="submit"
          disabled={loading || cid.trim().length < 11}
          style={{
            padding: "11px", borderRadius: 10, border: "none",
            background: "var(--accent)", color: "#fff",
            fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
            opacity: loading || cid.trim().length < 11 ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
