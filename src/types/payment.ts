export interface StripePaymentIntent {
    id: string;
    amount_total?: number;
    currency: string;
    payment_status?: string;
    created: number;
    customer_details?: {
      email?: string;
    };
    metadata?: Record<string, string>;
    payment_method_types?: string[];
  }
  
  export interface PaymentData {
    amount: string;
    currency: string;
    orderId: string;
    cardLast4: string;
    date: string;
    email: string;
    status: "succeeded" | "processing" | "failed" | "unknown";
  }
  
  export interface UseStripePaymentResult {
    data: PaymentData | null;
    loading: boolean;
    error: string | null;
  }

  /** Response from POST /api/stripe/ConfirmPayment */
  export interface ConfirmedPaymentResponse {
    bookingId?: string | number;
    guests?: string | number;
    nights?: string | number;
    amount?: string | number;
    email?: string;
  }