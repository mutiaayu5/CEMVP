# CEMVP - AI Automation Marketplace

A sleek, high-performance marketplace for downloading and buying automation templates (e.g., n8n workflows, Zapier zaps).

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   # Fill in your Supabase and Resend credentials
   ```

3. **Set up Prisma** (migrations run automatically on Vercel):
   ```bash
   npm run prisma:generate
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## Admin Access

**Admin Email**: `developer@createconomy.com`

On first login, the admin will:
- Receive an email with MFA PIN (6 digits)
- Receive password setup link
- Need to enter PIN for every login

## Spec-Driven Development

This project uses **spec-driven development** where Markdown specifications serve as the single source of truth.

### Quick Workflow

1. **Write specs** in `docs/api-specs/`, `docs/data-specs/`, `docs/ui-specs/`
2. **Generate code**: `npm run spec:generate`
3. **Validate**: `npm run spec:validate`
4. **Check sync**: `npm run spec:sync`

See [Spec-Driven Development Guide](./docs/SPEC_DRIVEN_DEVELOPMENT.md) for details.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Auth**: Supabase Auth (with OAuth: Google, GitHub, Microsoft, Apple)
- **Email**: Resend (transactional emails)
- **Payments**: Stripe Connect (planned)

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Dashboard pages
├── components/         # React components
│   └── ui/            # shadcn/ui components
├── docs/               # Documentation & specs
│   ├── api-specs/     # API specifications
│   ├── data-specs/    # Data model specifications
│   └── ui-specs/      # UI specifications
├── lib/                # Utility libraries
│   ├── auth/          # Authentication utilities (role detection, MFA)
│   ├── email/         # Email utilities (Resend)
│   ├── schemas/       # Zod schemas (generated)
│   ├── types/         # TypeScript types (generated)
│   ├── prisma.ts      # Prisma client
│   └── supabase/      # Supabase clients
├── prisma/             # Prisma schema
│   └── schema.prisma  # Database schema
└── scripts/            # Build & generation scripts
```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Prisma
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:migrate` - Run migrations

### Spec-Driven Development
- `npm run spec:generate` - Generate code from specs
- `npm run spec:validate` - Validate code matches specs
- `npm run spec:sync` - Check for spec-code drift

## Environment Variables

See `env.example` for required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection (optional, for migrations)
- `RESEND_API_KEY` - Resend API key for emails
- `RESEND_FROM_EMAIL` - Email address to send from
- `NEXT_PUBLIC_SITE_URL` - Site URL for email links

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

**Migrations run automatically** during build (since you're starting fresh).

The project is configured for Vercel deployment with:
- Next.js framework detection
- Automatic Prisma Client generation
- Automatic database schema push
- Edge runtime support

## Documentation

- [Requirements](./docs/requirements.md) - Functional requirements
- [Implementation Plan](./docs/implementation_plan.md) - Technical roadmap
- [Spec-Driven Development](./docs/SPEC_DRIVEN_DEVELOPMENT.md) - Spec-driven workflow guide
- [Project State](./docs/project_state.md) - Current project status
- [Authentication Schema](./docs/AUTHENTICATION_SCHEMA.md) - User roles, MFA, OAuth
- [Admin Setup](./docs/ADMIN_SETUP.md) - Admin account setup guide
- [Vercel Deployment](./docs/VERCEL_DEPLOYMENT.md) - Deployment instructions

## License

Private project
