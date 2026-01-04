# CEMVP - AI Automation Marketplace

Test website for CEMVP with Supabase authentication, shadcn/ui components, and Vercel deployment.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase project set up
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd CEMVP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```
   
   Then update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Technology Stack

All versions are tracked in `versions.json`. Key technologies:

- **Next.js 15** - React framework with App Router
- **TypeScript 5.6** - Type safety
- **Supabase** - Authentication and database
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling

## 🧪 Testing Checklist

This test website verifies:

- ✅ Vercel deployment
- ✅ Supabase connectivity
- ✅ Supabase authentication (sign up, sign in, sign out)
- ✅ Protected routes
- ✅ shadcn/ui components

## 📁 Project Structure

```
CEMVP/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities
│   ├── supabase/        # Supabase clients
│   └── utils.ts         # Helper functions
├── middleware.ts         # Auth middleware
└── versions.json         # Version tracking
```

## 🔐 Authentication Flow

1. **Sign Up**: Create a new account at `/auth/signup`
2. **Sign In**: Sign in at `/auth/signin`
3. **Dashboard**: Access protected dashboard at `/dashboard`
4. **Sign Out**: Sign out from dashboard or home page

## 🚢 Deployment to Vercel

📖 **For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (see [DEPLOYMENT.md](./DEPLOYMENT.md) for details)

3. **Deploy**
   - Vercel will automatically deploy on push to main branch

## 📝 Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `NEXT_PUBLIC_SITE_URL` - Your site URL (for redirects)

Optional:

- `SUPABASE_SERVICE_ROLE_KEY` - For server-side operations (keep secret!)

## 🔧 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 License

Private project
