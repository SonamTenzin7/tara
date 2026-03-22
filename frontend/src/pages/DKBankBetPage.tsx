import { FC, useState, useEffect } from "react";
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
import { getMarket, Market } from "@/api/client";
import {
  initiateDKBankPayment,
  formatBTN,
  validateBhutanesePhone,
} from "@/api/dkbank";
import config from "@/config";

export const DKBankBetPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);

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

  const handlePayWithDKBank = async () => {
    if (!selectedOutcomeId || !amount || !phone || !market) return;

    setProcessing(true);
    try {
      const btnAmount = parseFloat(amount);

      // Validation
      if (btnAmount < config.payments.dkBank.minBet) {
        throw new Error(`Minimum bet is ${config.payments.dkBank.minBet} BTN`);
      }

      if (!validateBhutanesePhone(phone)) {
        throw new Error(
          "Please enter a valid Bhutanese phone number (+975 XXXXXXXX)",
        );
      }

      // Initiate payment
      const result = await initiateDKBankPayment({
        amount: btnAmount,
        merchantTxnId: `TARA_${market.id}_${Date.now()}`,
        customerPhone: phone,
        customerName: name || undefined,
        description: `Bet on: ${market.title}`,
      });

      if (result.success) {
        alert(`✅ ${result.message}\n\nTransaction ID: ${result.txnId}`);

        // TODO: Send bet to backend after payment confirmation
        // await placeBetWithDKBank(market.id, {
        //   outcomeId: selectedOutcomeId,
        //   amount: btnAmount,
        //   phone,
        //   txnId: result.txnId,
        // });

        // Reload market
        const updated = await getMarket(market.id);
        setMarket(updated);
        setAmount("");
        setSelectedOutcomeId(null);
      } else {
        throw new Error(result.message || "Payment failed");
      }
    } catch (err: any) {
      alert("❌ Failed: " + err.message);
    } finally {
      setProcessing(false);
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

  const canBet = market.status === "open";
  const { dkBank } = config.payments;

  return (
    <Page back={true}>
      <List>
        {/* Market info */}
        <Section header="Archery Match Details">
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
              Pool: <strong>{formatBTN(Number(market.totalPool))}</strong> ·
              Status: <strong>{market.status.toUpperCase()}</strong>
            </Caption>
          </div>
        </Section>

        {/* Payment method info */}
        <Section header="Payment Method">
          <Cell
            before={<span style={{ fontSize: "2rem" }}>🏦</span>}
            subtitle={`Pay with ${dkBank.currency} via mobile banking`}
          >
            <strong>DK Bank (Druk PNB)</strong>
          </Cell>
        </Section>

        {/* Outcomes */}
        <Section header="Select Outcome">
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
                subtitle={`Pool: ${formatBTN(Number(outcome.totalBetAmount))} · Implied: ${impliedProb}%`}
                after={
                  canBet ? (
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
                  opacity: canBet ? 1 : 0.6,
                }}
              >
                {outcome.label}
              </Cell>
            );
          })}
        </Section>

        {/* Bet form */}
        {canBet && (
          <Section
            header="Place Your Bet"
            footer={`Minimum bet: ${formatBTN(dkBank.minBet)}`}
          >
            <div style={{ padding: "1rem" }}>
              <Input
                header="Phone Number"
                placeholder="+975 17XXXXXX"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ marginBottom: "1rem" }}
              />

              <Input
                header="Name (Optional)"
                placeholder="Your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "1rem" }}
              />

              <Input
                header={`Amount in ${dkBank.currency}`}
                placeholder={`${dkBank.minBet}`}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!selectedOutcomeId}
                style={{ marginBottom: "1rem" }}
              />

              <Caption
                level="2"
                style={{ marginBottom: "1rem", display: "block" }}
              >
                You will receive a payment request on your DK Bank mobile app
              </Caption>

              <Button
                size="l"
                stretched
                loading={processing}
                disabled={
                  !selectedOutcomeId ||
                  !amount ||
                  !phone ||
                  Number(amount) < dkBank.minBet ||
                  !validateBhutanesePhone(phone)
                }
                onClick={handlePayWithDKBank}
              >
                {processing ? "Processing..." : `Pay ${amount || "0"} BTN`}
              </Button>
            </div>
          </Section>
        )}

        {!canBet && (
          <Section>
            <Placeholder
              header={
                market.status === "upcoming"
                  ? "Match Not Started"
                  : "Betting Closed"
              }
              description={
                market.status === "upcoming"
                  ? "This match will open soon"
                  : "Betting is no longer available"
              }
            />
          </Section>
        )}
      </List>
    </Page>
  );
};
