import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Section,
  Cell,
  List,
  Spinner,
  Placeholder,
  Button,
  Input,
  Caption,
  Title,
} from "@telegram-apps/telegram-ui";
import { Page } from "@/components/Page";
import { getMarket, placeBet, Market } from "@/api/client";
import { useAuth } from "@/hooks/useAuth";

export const MarketDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getMarket(id);
        setMarket(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handlePlaceBet = async () => {
    if (!selectedOutcomeId || !amount || !market) return;
    setPlacing(true);
    try {
      await placeBet(market.id, {
        outcomeId: selectedOutcomeId,
        amount: Number(amount),
      });
      alert("Bet placed successfully!");
      // Reload market data
      const updated = await getMarket(market.id);
      setMarket(updated);
      setAmount("");
      setSelectedOutcomeId(null);
    } catch (err: any) {
      alert("Failed to place bet: " + err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <Page back={true}>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <Spinner size="l" />
        </div>
      </Page>
    );
  }

  if (error || !market) {
    return (
      <Page back={true}>
        <Placeholder header="Error" description={error || "Market not found"} />
      </Page>
    );
  }

  const canBet = market.status === "open" && user;

  return (
    <Page back={true}>
      <List>
        <Section
          header="Market Details"
          footer={`House edge: ${market.houseEdgePct}% · Total pool: ${market.totalPool}`}
        >
          <div style={{ padding: "1rem" }}>
            <Title level="2" weight="1">
              {market.title}
            </Title>
            {market.description && (
              <Caption
                level="1"
                style={{ marginTop: "0.5rem", display: "block" }}
              >
                {market.description}
              </Caption>
            )}
            <Caption
              level="2"
              style={{ marginTop: "0.5rem", display: "block" }}
            >
              Status: <strong>{market.status.toUpperCase()}</strong>
            </Caption>
            {market.opensAt && (
              <Caption level="2" style={{ display: "block" }}>
                Opens: {new Date(market.opensAt).toLocaleString()}
              </Caption>
            )}
            {market.closesAt && (
              <Caption level="2" style={{ display: "block" }}>
                Closes: {new Date(market.closesAt).toLocaleString()}
              </Caption>
            )}
          </div>
        </Section>

        <Section header="Outcomes">
          {market.outcomes.map((outcome) => {
            const isSelected = selectedOutcomeId === outcome.id;
            const impliedProb =
              Number(market.totalPool) > 0
                ? (
                    (Number(outcome.totalBetAmount) /
                      Number(market.totalPool)) *
                    100
                  ).toFixed(1)
                : "0.0";

            return (
              <Cell
                key={outcome.id}
                onClick={() => canBet && setSelectedOutcomeId(outcome.id)}
                subtitle={`Pool: ${outcome.totalBetAmount} · Implied: ${impliedProb}%`}
                after={
                  outcome.isWinner ? (
                    <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
                      ✓ Winner
                    </span>
                  ) : canBet ? (
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setSelectedOutcomeId(outcome.id)}
                    />
                  ) : null
                }
                style={{
                  backgroundColor: isSelected
                    ? "rgba(0, 122, 255, 0.1)"
                    : undefined,
                  cursor: canBet ? "pointer" : "default",
                }}
              >
                {outcome.label}
              </Cell>
            );
          })}
        </Section>

        {canBet && (
          <Section
            header="Place a Bet"
            footer={`Your balance: ${user.balance} credits`}
          >
            <div style={{ padding: "1rem" }}>
              <Input
                header="Amount"
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!selectedOutcomeId}
              />
              <Button
                size="l"
                stretched
                loading={placing}
                disabled={!selectedOutcomeId || !amount || Number(amount) <= 0}
                onClick={handlePlaceBet}
                style={{ marginTop: "1rem" }}
              >
                Place Bet
              </Button>
            </div>
          </Section>
        )}

        {market.status !== "open" && (
          <Section>
            <Placeholder
              header={
                market.status === "upcoming" ? "Not Open Yet" : "Betting Closed"
              }
              description={
                market.status === "upcoming"
                  ? "This market will open soon"
                  : market.status === "resolved" || market.status === "settled"
                    ? "This market has been resolved"
                    : "Betting is no longer available"
              }
            />
          </Section>
        )}
      </List>
    </Page>
  );
};
