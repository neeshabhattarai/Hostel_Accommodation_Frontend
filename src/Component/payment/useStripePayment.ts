import { useEffect, useState } from "react";

import { useAuthStore } from "../../auth/Authentication";

import type {
  PaymentData,
  StripePaymentIntent,
  UseStripePaymentResult,
} from "../../types/payment";

import {
  normalizeStripePaymentIntent,
} from "../../Helper/payment";

export function useStripePayment(
  sessionId: string | null
): UseStripePaymentResult {
  const [data, setData] =
    useState<PaymentData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const token = useAuthStore(
    (state) => state.token
  );

  useEffect(() => {
    if (!sessionId) return;

    const fetchPayment = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5109/api/stripe/GetSession/session?id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch payment details"
          );
        }

        const session: StripePaymentIntent =
          await response.json();

        const normalizedData =
          normalizeStripePaymentIntent(
            session
          );

        setData(normalizedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [sessionId, token]);

  return {
    data,
    loading,
    error,
  };
}