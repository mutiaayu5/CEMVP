# Project Requirements: Digital Asset Marketplace

## 1. Overview
A sleek, high-performance marketplace for downloading and buying automation templates (e.g., n8n workflows, Zapier zaps).
**Core Concept**: Users browse manual curated templates. Creators upload templates. Admin approves them.

## 2. Functional Requirements

### 2.1 User Roles
*   **Guest**: Can browse, search, and view template details.
*   **Buyer**: Can purchase or download free templates. Has a "Library" of owned assets.
*   **Creator**: Can upload templates, set prices, and connect Stripe for payouts.
*   **Admin**: Can view pending submissions and Approve/Reject them.

### 2.2 Marketplace Features
*   **Search & Filter**: Keyword search (title/description) + Faceted filters (Category, Price, Tool).
*   **Template Page**:
    *   Title, Description, Screenshots/Video.
    *   "Tool Stack" icons (e.g., Logo of Notion + Logo of Gmail).
    *   Price / "Get It" button.
*   **Reviews**: Simple 5-star rating system (Phase 2?).

### 2.3 Submission Workflow (Manual)
1.  Creator fills form: Title, Description, Price.
2.  Creator uploads asset file (JSON/ZIP) to Supabase Storage.
3.  Creator uploads Cover Image.
4.  Submission saved as `status: pending`.

### 2.4 Admin Workflow
1.  Admin logs in to `/admin`.
2.  Views list of `pending` items.
3.  Clicks "Approve" -> Updates status to `published`.

## 3. Technical Requirements

### 3.1 Stack
*   **Framework**: Next.js (App Router).
*   **UI Library**: Shadcn/UI + Tailwind CSS.
*   **Database**: Supabase (Postgres).
*   **Storage**: Supabase Storage.
*   **Auth**: Supabase Auth.
*   **Payments**: Stripe Connect.
*   **Emails**: Resend.

### 3.2 Performance
*   Heavily cache the "Browse" page using Next.js ISR or simple fetch caching since data changes slowly.

## 4. Pending Decisions
*   [ ] **Tax Handling**: Confirm Stripe Tax configuration.
*   [ ] **File Limits**: Max file size for uploads? (Suggest 10MB to start).
