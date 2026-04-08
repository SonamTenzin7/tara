import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyResults,
  getResolvedMarkets,
  type Bet,
  type ResolvedMarket,
} from "@/api/client";

export function PwaResultsPage() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<ResolvedMarket[]>([]);

  useEffect(() => {
    getMyResults()
      .then(setBets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    getResolvedMarkets()
      .then(setResolved)
      .catch(() => {});
  }, []);

  const won = bets.filter((b) => b.status === "won");
  const lost = bets.filter((b) => b.status === "lost");
  const winRate =
    bets.filter((b) => b.status !== "refunded").length > 0
      ? (
          (won.length / bets.filter((b) => b.status !== "refunded").length) *
          100
        ).toFixed(0)
      : "0";

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      <h1
        style={{
          fontSize: "1.4rem",
          fontWeight: 800,
          marginBottom: 4,
          color: "var(--text-main)",
        }}
      >
        Results
      </h1>
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          marginBottom: 20,
        }}
      >
        Resolution record
      </p>

      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--text-subtle)",
          }}
        >
          Loading…
        </div>
      )}
      {error && (
        <div
          style={{ textAlign: "center", padding: "40px 0", color: "#ef4444" }}
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary strip */}
          {bets.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
                marginBottom: 24,
              }}
            >
              {[
                { label: "Contracts", value: bets.length },
                { label: "Won", value: won.length, color: "#22c55e" },
                { label: "Lost", value: lost.length, color: "#ef4444" },
                {
                  label: "Win rate",
                  value: `${winRate}%`,
                  color: Number(winRate) >= 50 ? "#22c55e" : "#f59e0b",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 12,
                    padding: "12px 10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: (s as any).color ?? "var(--text-main)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resolution Record */}
          <div style={{ marginTop: bets.length > 0 ? 8 : 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-subtle)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "var(--text-subtle)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Resolution Record
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                {resolved.length} market{resolved.length !== 1 ? "s" : ""}
              </span>
            </div>

            {resolved.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "var(--text-subtle)",
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-subtle)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginBottom: 12 }}
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
                <div>
                  No resolved markets yet.{" "}
                  <Link to="/markets" style={{ color: "var(--accent)" }}>
                    Browse markets →
                  </Link>
                </div>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {resolved.map((m) => (
                  <Link
                    key={m.id}
                    to={`/market/${m.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: 12,
                        padding: "14px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            color: "var(--text-main)",
                            flex: 1,
                            lineHeight: 1.3,
                          }}
                        >
                          {m.title}
                        </span>
                        {m.category && (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "var(--text-muted)",
                              background: "var(--glass-bg)",
                              border: "1px solid var(--glass-border)",
                              padding: "2px 8px",
                              borderRadius: 6,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {m.category}
                          </span>
                        )}
                      </div>
                      {m.winner && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              color: "#22c55e",
                            }}
                          >
                            {m.winner.label}
                          </span>
                        </div>
                      )}
                      {m.resolutionCriteria && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.75rem",
                            color: "var(--text-subtle)",
                            lineHeight: 1.5,
                            fontStyle: "italic",
                          }}
                        >
                          "{m.resolutionCriteria}"
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          gap: 14,
                          flexWrap: "wrap",
                          paddingTop: 4,
                          borderTop: "1px solid var(--glass-border)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
                            fontWeight: 600,
                          }}
                        >
                          BTN {Number(m.totalPool).toLocaleString()} pool
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
                            fontWeight: 600,
                          }}
                        >
                          {m.participantCount} bettors
                        </span>
                        {m.resolvedAt && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                              fontWeight: 600,
                            }}
                          >
                            {new Date(m.resolvedAt).toLocaleDateString(
                              "en-BT",
                              {
                                timeZone: "Asia/Thimphu",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
