import { useEffect, useState } from "react";
import { getMe, getMyTransactions, type AuthUser, type Transaction } from "@/api/client";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Target, 
  Trophy, 
  RotateCcw, 
  Lock, 
  Unlock,
  Wallet,
  Plus,
  ArrowUpCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import "./WalletPage.css";

const TX_ICON: Record<Transaction["type"], React.ReactNode> = {
  deposit: <ArrowDownLeft size={20} />,
  withdrawal: <ArrowUpRight size={20} />,
  bet_placed: <Target size={20} />,
  bet_payout: <Trophy size={20} />,
  refund: <RotateCcw size={20} />,
  dispute_bond: <Lock size={20} />,
  dispute_refund: <Unlock size={20} />,
};

const TX_LABEL: Record<Transaction["type"], string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  bet_placed: "Position opened",
  bet_payout: "Returns",
  refund: "Refund",
  dispute_bond: "Dispute bond",
  dispute_refund: "Bond refund",
};

function TxRow({ tx }: { tx: Transaction }) {
  const isCredit = tx.amount > 0;
  return (
    <div className="tx-row">
      <div className="tx-icon-container">
        {TX_ICON[tx.type]}
      </div>
      <div className="tx-info">
        <div className="tx-label">
          {TX_LABEL[tx.type]}
        </div>
        {tx.note && (
          <div className="tx-note">
            {tx.note}
          </div>
        )}
        <div className="tx-date">
          {new Date(tx.createdAt).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      <div className="tx-amount-col">
        <div className={`tx-amount ${isCredit ? 'credit' : 'debit'}`}>
          {isCredit ? "+" : ""} {Number(tx.amount).toLocaleString()}
        </div>
        <div className="tx-balance">
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

  const totalIn = txs.filter((t) => Number(t.amount) > 0).reduce((s, t) => s + Number(t.amount), 0);
  const totalOut = txs.filter((t) => Number(t.amount) < 0).reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="wallet-container">
      <h1 className="wallet-header">Wallet</h1>

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <span>Syncing your balance...</span>
        </div>
      )}

      {error && (
        <div className="empty-state">
          <AlertCircle size={48} color="#ef4444" />
          <p style={{ color: "#ef4444" }}>{error}</p>
          <button onClick={() => window.location.reload()} className="action-btn">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && profile && (
        <>
          {/* Balance card */}
          <div className="balance-card">
            <div className="balance-label">Available Balance</div>
            <div className="balance-amount">
              <span className="balance-currency">BTN</span>
              {Number(profile.creditsBalance).toLocaleString()}
            </div>
            <div className="balance-stats">
              <div className="stat-item">
                <div className="stat-label">Total In</div>
                <div className="stat-value">+{totalIn.toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Out</div>
                <div className="stat-value">{Math.abs(totalOut).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="wallet-actions">
            <button className="action-btn primary">
              <Plus size={18} />
              Deposit
            </button>
            <button className="action-btn">
              <ArrowUpCircle size={18} />
              Withdraw
            </button>
          </div>

          {/* Transaction list */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
            <div>
              <h2 className="section-title">History</h2>
              <div className="section-subtitle">
                {txs.length} transaction{txs.length !== 1 ? "s" : ""}
              </div>
            </div>
            <Clock size={16} color="var(--text-subtle)" style={{ marginBottom: 20 }} />
          </div>

          <div className="transactions-list">
            {txs.length === 0 ? (
              <div className="empty-state">
                <Wallet size={48} />
                <p>No transactions yet</p>
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
