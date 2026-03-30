export const NOTIFICATION_QUEUE = "notifications";

export const JobName = {
  PAYMENT_SUCCESS: "payment.success",
  MARKET_SETTLED: "market.settled",
  BET_RESULT: "bet.result",
} as const;

export interface PaymentSuccessJobData {
  userId: string;
  paymentId: string;
  amount: number;
  currency: string;
}

export interface MarketSettledJobData {
  marketId: string;
  marketTitle: string;
  winningOutcomeLabel: string;
}

export interface BetResultJobData {
  userId: string;
  betId: string;
  marketTitle: string;
  outcomeLabel: string;
  status: "WON" | "LOST" | "REFUNDED";
  payout?: number;
}
