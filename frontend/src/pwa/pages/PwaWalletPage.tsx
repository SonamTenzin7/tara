import { useEffect, useState } from "react";
import { getMe, getMyTransactions, type AuthUser, type Transaction } from "@/api/client";

const TX_ICON: Record<Transaction["type"], string> = {
  deposit: "⬆️",
  withdrawal: "⬇️",
  bet_placed: "🎯",
  bet_payout: "🏆",
  refund: "↩️",
  dispute_bond: "🔒",
  dispute_refund: "🔓",
};

const TX_LABEL: Record<Transaction["type"], string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  bet_placed: "Bet placed",
  bet_payout: "Winnings",
  refund: "Refund",
  dispute_bond: "Dispute bond",
  dispute_refund: "Bond refund",
};

function TxRow({ tx }: { tx: Transaction }) {
  const isCredit = tx.amount > 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0", borderBottom: "1px solid var(--glass-border)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>
        {TX_ICON[tx.type]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-main)" }}>
          {TX_LABEL[tx.type]}
        </div>
        {tx.note && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {tx.note}
          </div>
        )}
        <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>
          {new Date(tx.createdAt).toLocaleString()}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: isCredit ? "#22c55e" : "#ef4444" }}>
          {isCredit ? "+" : ""}BTN {Number(tx.amount).toLocaleString()}
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>
          Bal {Number(tx.balanceAfter).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export function PwaWalletPage() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMe(), getMyTransactions()])
      .then(([p, t]) => { setProfile(p); setTxs(t); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalIn = txs.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const totalOut = txs.filter((t) => t.amount < 0).reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 20, color: "var(--text-main)" }}>
        Wallet
      </h1>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-subtle)" }}>Loading…</div>
      )}
      {error && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#ef4444" }}>{error}</div>
      )}

      {!loading && !error && profile && (
        <>
          {/* Balance card */}
          <div style={{
            background: "linear-gradient(135deg, var(--accent) 0%, #2b7fdb 100%)",
            borderRadius: 18, padding: "24px 24px 20px", marginBottom: 24,
            boxShadow: "0 8px 32px rgba(62,207,110,0.2)",
          }}>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 4 }}>
              Available Balance
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
              BTN {Number(profile.creditsBalance).toLocaleString()}
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>Total In</div>
                <div style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 700 }}>+BTN {totalIn.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>Total Out</div>
                <div style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 700 }}>BTN {Math.abs(totalOut).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Transaction list */}
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 4 }}>
            Transaction History
          </h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 12 }}>
            {txs.length} transaction{txs.length !== 1 ? "s" : ""}
          </p>

          <div style={{
            background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
            borderRadius: 14, padding: "0 16px",
          }}>
            {txs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-subtle)" }}>
                No transactions yet
              </div>
            ) : (
              txs.map((tx) => <TxRow key={tx.id} tx={tx} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
