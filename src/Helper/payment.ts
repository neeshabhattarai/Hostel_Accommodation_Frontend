import {
    CURRENCY_SYMBOLS,
    ZERO_DECIMAL_CURRENCIES,
  } from "../constant/constant";
  
  import type {
    PaymentData,
    StripePaymentIntent,
  } from "../types/payment";
  
  export function formatAmount(
    amount: number,
    currency: string
  ): string {
    const lower = currency.toLowerCase();
  
    if (ZERO_DECIMAL_CURRENCIES.has(lower)) {
      return String(amount);
    }
  
    return (amount / 100).toFixed(2);
  }
  
  export function normalizeCurrency(
    currency: string
  ): string {
    return (
      CURRENCY_SYMBOLS[currency.toLowerCase()] ??
      currency.toUpperCase()
    );
  }
  
  export function normalizeStatus(
    status?: string
  ): PaymentData["status"] {
    if (status === "paid") return "succeeded";
  
    if (status === "processing") {
      return "processing";
    }
  
    if (
      status === "unpaid" ||
      status === "canceled"
    ) {
      return "failed";
    }
  
    return "unknown";
  }
  
  export function formatDate(
    timestamp: number
  ): string {
    return new Date(
      timestamp * 1000
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  
  export function normalizeStripePaymentIntent(
    session: StripePaymentIntent
  ): PaymentData {
    return {
      amount: formatAmount(
        session.amount_total ?? 0,
        session.currency
      ),
  
      currency: normalizeCurrency(
        session.currency
      ),
  
      orderId:
        session.metadata?.order_id ??
        session.id,
  
      cardLast4: "****",
  
      date: formatDate(session.created),
  
      email:
        session.customer_details?.email ??
        "your email address",
  
      status: normalizeStatus(
        session.payment_status
      ),
    };
  }