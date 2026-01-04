# Project State & Context

## 📌 Current Status
**Phase**: Foundation Complete & Spec-Driven Development
**Active Task**: Spec-Driven Development Framework Implemented
**Last Updated**: 2026-01-27
**Deployment**: ✅ Deployed to Vercel

## 📋 High-Level Goals
1.  **Pivot**: Digital Asset Marketplace for Automation Templates (Manual Upload/Review).
2.  **No AI**: Removed automatic analysis; relying on Admin Manual Review.
3.  **Tech**: Next.js (App Router), Supabase (Auth, DB, Storage), Stripe Connect.

## 🚧 Active Implementation Context
*   **Repo**: Initialized with Next.js 15, TypeScript, Prisma, Supabase.
*   **Deployment**: ✅ Deployed to Vercel with Supabase authentication working.
*   **Database**: Prisma integrated with Supabase PostgreSQL.
*   **Documentation**: Centralized in `docs/` with structured specs.
*   **Spec-Driven Framework**: ✅ Complete
  - Spec parser, code generators (Zod, TypeScript, API routes)
  - Validation and sync tools
  - Automated workflow scripts (`npm run spec:generate`, `spec:validate`, `spec:sync`)
*   **Next Step**: Generate code from specs and implement Phase 1 marketplace features.

## 🛠 Decision Log
| Date | Decision | Rationale |
| :--- | :--- | :--- |
| Jan 4 | **Move Docs to `docs/`** | Clean root directory for better DX. |
| Jan 4 | **Remove Trigger.dev/AI** | Simplify to MVP. Use manual admin review instead of AI. |
| Jan 4 | **Pivot to Marketplace** | Focus on *assets* (json files) vs SaaS platform. |
| Jan 27 | **Spec-Driven Development** | Implement framework to ensure code matches specs, enable code generation, and maintain sync. |

## 📂 Key Documentation Map
*   [`requirements.md`](./requirements.md): The Source of Truth for *features*.
*   [`implementation_plan.md`](./implementation_plan.md): The Technical Roadmap.
*   [`task.md`](./task.md): Progress Checklist.
*   [`SPEC_DRIVEN_DEVELOPMENT.md`](./SPEC_DRIVEN_DEVELOPMENT.md): Spec-driven development guide and workflow.
