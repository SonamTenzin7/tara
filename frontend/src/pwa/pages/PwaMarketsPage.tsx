import { useState, useEffect } from "react";
import { getMarkets, placeBet, type Market } from "@/api/client";
import { PwaPaymentModal } from "../components/PwaPaymentModal";
import type { PaymentResponse } from "@/types/payment";
import { PwaMarketCard } from "../components/PwaMarketCard";
import { PwaMarketGrid } from "../components/PwaMarketGrid";

export function PwaMarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBet, setActiveBet] = useState<{ marketId: string; outcomeId: string } | null>(null);

  useEffect(() => {
    getMarkets()
      .then(setMarkets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePaymentSuccess = async (_payment: PaymentResponse) => {
    if (!activeBet) return;
    const betAmt = _payment?.amount ?? 0;
    
    setMarkets((prev) => prev.map((m) => {
      if (m.id !== activeBet.marketId) return m;
      return {
        ...m,
        totalPool: String(Number(m.totalPool) + betAmt),
        outcomes: m.outcomes.map((o) =>
          o.id === activeBet.outcomeId
            ? { ...o, totalBetAmount: String(Number(o.totalBetAmount) + betAmt) }
            : o
        ),
      };
    }));

    setActiveBet(null);
    const market = markets.find((m) => m.id === activeBet.marketId);
    if (market) {
      try { await placeBet(market.id, { outcomeId: activeBet.outcomeId, amount: betAmt }); }
      catch (e: any) { console.warn(e.message); }
    }
    getMarkets().then(setMarkets).catch(console.error);
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px 0" }}>
      <div style={{ textAlign: "center", color: "var(--text-subtle)" }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "bounce 2s infinite" }}>🔮</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Syncing predictions…</div>
      </div>
    </div>
  );

  const openMarkets = markets.filter((m) => m.status === "open");
  const upcomingMarkets = markets.filter((m) => m.status === "upcoming");
  const settledMarkets = markets.filter((m) => !["open", "upcoming"].includes(m.status));
  const activeMarket = activeBet ? markets.find((m) => m.id === activeBet.marketId) : null;

  const renderGrid = (items: Market[]) => (
    <PwaMarketGrid>
      {items.map((market) => (
        <PwaMarketCard
          key={market.id}
          market={market}
          onBet={(outcomeId) => setActiveBet({ marketId: market.id, outcomeId })}
        />
      ))}
    </PwaMarketGrid>
  );

  return (
    <div style={{ padding: "40px 24px 80px", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>
      {openMarkets.length > 0 && (
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: "6px 12px", borderRadius: 20, background: "#ecfdf5", color: "#10b981", fontSize: 11, fontWeight: 800, letterSpacing: "0.05em" }}>LIVE</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", margin: 0, fontFamily: "var(--font-display)" }}>Active Markets</h2>
          </div>
          {renderGrid(openMarkets)}
        </section>
      )}

      {upcomingMarkets.length > 0 && (
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: "6px 12px", borderRadius: 20, background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 800, letterSpacing: "0.05em" }}>SOON</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", margin: 0, fontFamily: "var(--font-display)" }}>Coming Up</h2>
          </div>
          {renderGrid(upcomingMarkets)}
        </section>
      )}

      {settledMarkets.length > 0 && (
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: "6px 12px", borderRadius: 20, background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 800, letterSpacing: "0.05em" }}>SETTLED</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", margin: 0, fontFamily: "var(--font-display)" }}>History</h2>
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