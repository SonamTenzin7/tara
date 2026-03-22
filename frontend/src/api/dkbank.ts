/**
 * DK Bank (Druk PNB Bank) Payment Integration
 *
 * This module handles BTN (Bhutanese Ngultrum) payments via DK Bank
 * for Bhutanese users betting on archery matches.
 */

import config from "@/config";

export interface DKBankPayment {
  amount: number; // in BTN
  merchantTxnId: string;
  customerPhone: string;
  customerName?: string;
  description: string;
}

export interface DKBankResponse {
  success: boolean;
  txnId?: string;
  status?: "pending" | "success" | "failed";
  message?: string;
}

/**
 * Initiate a payment via DK Bank
 *
 * NOTE: This is a placeholder implementation. You need to:
 * 1. Get DK Bank merchant credentials from https://dkpnb.bt
 * 2. Integrate their actual payment gateway API
 * 3. Handle webhooks for payment confirmation
 */
export async function initiateDKBankPayment(
  payment: DKBankPayment,
): Promise<DKBankResponse> {
  const { dkBank } = config.payments;

  if (!dkBank.enabled) {
    throw new Error("DK Bank payments are disabled");
  }

  if (payment.amount < dkBank.minBet) {
    throw new Error(`Minimum bet is ${dkBank.minBet} BTN`);
  }

  // TODO: Replace with actual DK Bank API call
  console.log("🏦 DK Bank Payment Request:", payment);

  // Simulate API call
  try {
    // In production, this would be:
    // const response = await fetch(`${dkBank.apiUrl}/payment/initiate`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${dkBank.merchantId}`,
    //   },
    //   body: JSON.stringify({
    //     amount: payment.amount,
    //     currency: dkBank.currency,
    //     merchantTxnId: payment.merchantTxnId,
    //     customerPhone: payment.customerPhone,
    //     description: payment.description,
    //     callbackUrl: `${config.appUrl}/api/payments/dk-bank/callback`,
    //   }),
    // });
    // return response.json();

    // For now, return mock success
    return {
      success: true,
      txnId: `DKBANK_${Date.now()}`,
      status: "pending",
      message:
        "Payment initiated. Please check your DK Bank app to complete the transaction.",
    };
  } catch (error: any) {
    return {
      success: false,
      status: "failed",
      message: error.message || "Payment failed",
    };
  }
}

/**
 * Check payment status
 */
export async function checkDKBankPaymentStatus(
  txnId: string,
): Promise<DKBankResponse> {
  // TODO: Implement actual status check with DK Bank API
  console.log("🏦 Checking DK Bank payment status:", txnId);

  return {
    success: true,
    txnId,
    status: "success",
    message: "Payment completed successfully",
  };
}

/**
 * Format BTN currency for display
 */
export function formatBTN(amount: number): string {
  return `Nu. ${amount.toLocaleString("en-BT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Validate Bhutanese phone number
 * Format: +975 17XXXXXX or +975 77XXXXXX
 */
export function validateBhutanesePhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, "");
  const regex = /^\+975[17]\d{7}$/;
  return regex.test(cleaned);
}
