import { FC, useEffect, useState } from "react";
import {
  Section,
  Cell,
  List,
  Spinner,
  Placeholder,
  Caption,
  Badge,
} from "@telegram-apps/telegram-ui";
import { Page } from "@/components/Page";
import { getMarkets, Market } from "@/api/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@/components/Link/Link";

export const MarketsPage: FC = () => {
  const { user } = useAuth();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMarkets();
        setMarkets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Page back={false}>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <Spinner size="l" />
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page back={false}>
        <Placeholder header="Error Loading Markets" description={error} />
      </Page>
    );
  }

  const statusColors: Record<string, string> = {
    upcoming: "#808080",
    open: "#4CAF50",
    closed: "#FF9800",
    resolved: "#2196F3",
    settled: "#9C27B0",
    cancelled: "#F44336",
  };

  const openMarkets = markets.filter((m) => m.status === "open");
  const upcomingMarkets = markets.filter((m) => m.status === "upcoming");
  const otherMarkets = markets.filter(
    (m) => !["open", "upcoming"].includes(m.status),
  );

  return (
    <Page back={false}>
      <List>
        {user && (
          <Section header="Account">
            <Cell
              subtitle={`Balance: ${user.balance} credits ${user.isAdmin ? "· 🔑 Admin" : ""}`}
            >
              {user.firstName} {user.lastName || ""}
            </Cell>
          </Section>
        )}

        {openMarkets.length > 0 && (
          <Section
            header="Tara"
            footer="Choose payment: BTN (DK Bank), TON, or Credits"
          >
            {openMarkets.map((market) => (
              <div key={market.id}>
                <Link to={`/market/${market.id}`}>
                  <Cell
                    before={
                      <Badge
                        type="number"
                        style={{ backgroundColor: statusColors.open }}
                      >
                        {market.outcomes.length}
                      </Badge>
                    }
                    after={<Caption level="1">{market.totalPool} pool</Caption>}
                    subtitle={market.description?.slice(0, 60) + "..." || ""}
                  >
                    {market.title}
                  </Cell>
                </Link>
                <div
                  style={{
                    padding: "0 1rem 0.75rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.5rem",
                  }}
                >
                  <Link to={`/dkbank-bet/${market.id}`}>
                    <button
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.3rem",
                        background: "#FF6B35",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      🏦 DK Bank
                    </button>
                  </Link>
                  <Link to={`/ton-bet/${market.id}`}>
                    <button
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.3rem",
                        background: "#0098EA",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      💎 TON
                    </button>
                  </Link>
                  <Link to={`/market/${market.id}`}>
                    <button
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.3rem",
                        background: "#007AFF",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      💰 Credits
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </Section>
        )}

        {upcomingMarkets.length > 0 && (
          <Section header="Upcoming Matches">
            {upcomingMarkets.map((market) => (
              <Link key={market.id} to={`/market/${market.id}`}>
                <Cell
                  before={
                    <Badge
                      type="number"
                      style={{ backgroundColor: statusColors.upcoming }}
                    >
                      {market.outcomes.length}
                    </Badge>
                  }
                  subtitle={
                    market.opensAt
                      ? `Opens ${new Date(market.opensAt).toLocaleDateString()}`
                      : "Not yet scheduled"
                  }
                >
                  {market.title}
                </Cell>
              </Link>
            ))}
          </Section>
        )}

        {otherMarkets.length > 0 && (
          <Section header="Past Matches">
            {otherMarkets.map((market) => (
              <Link key={market.id} to={`/market/${market.id}`}>
                <Cell
                  before={
                    <Badge
                      type="number"
                      style={{
                        backgroundColor: statusColors[market.status] || "#999",
                      }}
                    >
                      {market.status[0].toUpperCase()}
                    </Badge>
                  }
                  subtitle={market.status}
                >
                  {market.title}
                </Cell>
              </Link>
            ))}
          </Section>
        )}

        {markets.length === 0 && (
          <Placeholder
            header="No Archery Matches Yet"
            description="Check back later for new prediction markets!"
          />
        )}
      </List>
    </Page>
  );
};
