import { useState, useEffect } from "react";
import { 
  getMarkets, 
  placeBet, 
  type Market 
} from "@/api/client";
import { PwaPaymentModal } from "../components/PwaPaymentModal";
import type { PaymentResponse } from "@/types/payment";
import { PwaMarketCard } from "../components/PwaMarketCard";
import { PwaMarketGrid } from "../components/PwaMarketGrid";

export function PwaMarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBet, setActiveBet] = useState<{
    marketId: string;
    outcomeId: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce the raw search input → 400 ms before hitting the server
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Fetch from server whenever the committed search term changes
  useEffect(() => {
    setLoading(true);
    getMarkets(debouncedSearch.trim() || undefined)
      .then(setMarkets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  const handlePaymentSuccess = async (_payment: PaymentResponse) => {
    if (!activeBet) return;
    const betAmt = _payment?.amount ?? 0;

    // Snapshot before optimistic update so we can roll back on failure
    const prevMarkets = markets;

    setMarkets((prev) =>
      prev.map((m) => {
        if (m.id !== activeBet.marketId) return m;
        return {
          ...m,
          totalPool: String(Number(m.totalPool) + betAmt),
          outcomes: m.outcomes.map((o) =>
            o.id === activeBet.outcomeId
              ? {
                  ...o,
                  totalBetAmount: String(Number(o.totalBetAmount) + betAmt),
                }
              : o,
          ),
        };
      }),
    );

    setActiveBet(null);
    const market = prevMarkets.find((m) => m.id === activeBet.marketId);
    if (market) {
      try {
        await placeBet(market.id, {
          outcomeId: activeBet.outcomeId,
          amount: betAmt,
        });
      } catch (e: any) {
        // Bet failed — roll back the optimistic update
        setMarkets(prevMarkets);
        console.warn("Bet placement failed, rolled back:", e.message);
      }
    }
    // Sync with server to get authoritative pool numbers
    getMarkets(debouncedSearch.trim() || undefined).then(setMarkets).catch(console.error);
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px 0" }}>
        <div style={{ textAlign: "center", color: "var(--text-subtle)" }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: "bounce 2s infinite" }}>🔮</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Syncing predictions…</div>
        </div>
      </div>
    );

  const openMarkets = markets.filter((m) => m.status === "open");
  const upcomingMarkets = markets.filter((m) => m.status === "upcoming");
  const settledMarkets = markets.filter(
    (m) => !["open", "upcoming"].includes(m.status),
  );
  const activeMarket = activeBet
    ? markets.find((m) => m.id === activeBet.marketId)
    : null;

  const hasResults = markets.length > 0;

  const renderGrid = (items: Market[]) => (
    <PwaMarketGrid>
      {items.map((market) => (
        <PwaMarketCard
          key={market.id}
          market={market}
          onBet={(outcomeId) =>
            setActiveBet({ marketId: market.id, outcomeId })
          }
        />
      ))}
    </PwaMarketGrid>
  );

  return (
    <div style={{ padding: "32px 16px 100px", maxWidth: 1200, margin: "0 auto", position: "relative" }}>
      <div className="mesh-bg" />

      {/* ── Search bar ── */}
      <div style={{ position: "relative", marginBottom: 40 }}>
        <svg
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-subtle)",
            pointerEvents: "none",
          }}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search markets…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px 40px 14px 44px",
            borderRadius: 16,
            border: "1px solid var(--glass-border)",
            background: "var(--bg-card)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            fontSize: 15,
            color: "var(--text-main)",
            outline: "none",
            fontFamily: "var(--font-primary)",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.05)",
              border: "none",
              cursor: "pointer",
              color: "var(--text-subtle)",
              fontSize: 12,
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* No results */}
      {!hasResults && searchQuery.trim() && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-subtle)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", fontFamily: "var(--font-display)" }}>No markets found</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>Try a different search term.</div>
        </div>
      )}

      {openMarkets.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", fontSize: 10, fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase" }}>Live</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", margin: 0, fontFamily: "var(--font-display)" }}>Active Markets</h2>
          </div>
          {renderGrid(openMarkets)}
        </section>
      )}

      {upcomingMarkets.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", fontSize: 10, fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase" }}>Soon</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", margin: 0, fontFamily: "var(--font-display)" }}>Coming Up</h2>
          </div>
          {renderGrid(upcomingMarkets)}
        </section>
      )}

      {settledMarkets.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(100, 116, 139, 0.15)", color: "var(--text-subtle)", fontSize: 10, fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase" }}>Settled</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", margin: 0, fontFamily: "var(--font-display)" }}>Market History</h2>
          </div>
          {renderGrid(settledMarkets)}
        </section>
      )}

      {activeMarket && activeBet && (
        <PwaPaymentModal
          isOpen={true}
          onClose={() => setActiveBet(null)}
          market={activeMarket}
          outcomeId={activeBet.outcomeId}
          onSuccess={handlePaymentSuccess}
          onFailure={(e) => console.error(e)}
        />
      )}
    </div>
  );
}
