import { FC, useEffect, useState } from "react";
import { Spinner, Placeholder } from "@telegram-apps/telegram-ui";
import { Page } from "@/tma/components/Page";
import { Link } from "@/tma/components/Link/Link";
import { getResolvedMarkets, ResolvedMarket } from "@/api/client";

const categoryLabel: Record<string, string> = {
  sports: "Sports",
  politics: "Politics",
  weather: "Weather",
  entertainment: "Entertainment",
  economy: "Economy",
  other: "Other",
};

export const ResolvedMarketsPage: FC = () => {
  const [markets, setMarkets] = useState<ResolvedMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getResolvedMarkets()
      .then(setMarkets)
      .catch((e: any) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Page back={true}>
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <Spinner size="l" />
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page back={true}>
        <Placeholder header="Error" description={error} />
      </Page>
    );
  }

  return (
    <Page back={true}>
      <div style={{ position: "relative", minHeight: "100vh", padding: "0 0 100px" }}>
        <div className="mesh-bg" />
        <div style={{ padding: "48px 16px 24px", display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--text-subtle)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Resolution Record — {markets.length} market{markets.length !== 1 ? "s" : ""}
          </div>

          {markets.length === 0 && (
            <Placeholder header="No resolved markets yet" description="Settled markets will appear here." />
          )}

          {markets.map((m) => (
            <Link key={m.id} to={`/market/${m.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-lg)", padding: "18px", boxShadow: "var(--shadow-premium)", display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Title + category */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ fontWeight: 900, color: "var(--text-main)", fontSize: "0.95rem", lineHeight: 1.3, flex: 1 }}>{m.title}</span>
                  {m.category && (
                    <span style={{ background: "var(--bg-secondary)", padding: "3px 8px", borderRadius: 6, fontSize: "0.65rem", fontWeight: 800, color: "var(--text-subtle)", whiteSpace: "nowrap" }}>
                      {categoryLabel[m.category] ?? m.category}
                    </span>
                  )}
                </div>

                {/* Winner */}
                {m.winner && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: "8px 12px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ fontWeight: 800, color: "#22c55e", fontSize: "0.85rem" }}>{m.winner.label}</span>
                  </div>
                )}

                {/* Resolution criteria */}
                {m.resolutionCriteria && (
                  <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
                    "{m.resolutionCriteria}"
                  </p>
                )}

                {/* Stats row */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    Nu {Number(m.totalPool).toLocaleString()} pool
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    {m.participantCount} bettors
                  </div>
                  {m.resolvedAt && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
                      {new Date(m.resolvedAt).toLocaleDateString("en-BT", { timeZone: "Asia/Thimphu", year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Page>
  );
};
