# Payment API Specifications

## Endpoint: POST /api/payments/create-checkout

**Description**: Create Stripe Checkout session for template purchase

**Authentication**: Required (Buyer)

**Request Body**:
```typescript
{
  templateId: string;    // Required, must be APPROVED template
}
```

**Response 200**:
```typescript
{
  checkoutUrl: string;   // Stripe Checkout URL
  sessionId: string;     // Stripe session ID
}
```

**Response 400**: Invalid template or already purchased
**Response 401**: Unauthorized
**Response 404**: Template not found
**Response 500**: Server error

---

## Endpoint: POST /api/payments/webhook

**Description**: Stripe webhook handler for payment events

**Authentication**: Stripe signature verification

**Request Body**: Stripe webhook event

**Response 200**: Webhook processed
**Response 400**: Invalid webhook
**Response 500**: Server error

**Events Handled**:
- `checkout.session.completed`: Mark purchase, send download link
- `payment_intent.succeeded`: Process payout split (90% creator, 10% platform)

---

## Endpoint: GET /api/payments/purchases

**Description**: Get user's purchased templates

**Authentication**: Required

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response 200**:
```typescript
{
  purchases: Array<{
    id: string;
    templateId: string;
    template: {
      id: string;
      title: string;
      slug: string;
    };
    purchasedAt: string;
    downloadUrl: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

**Response 401**: Unauthorized
**Response 500**: Server error

