# Page Specifications

## Page: Home

**Route**: `/`

**Description**: Minimalistic landing page with professional construction theme

**Visual Design**:
- **Color Scheme**: Yellow/Orange construction theme
  - Background: Pure white (`bg-white`)
  - Primary: Orange (`#D97706`, `#B45309`)
  - Accent: Light yellow (`#FFE5B4`)
  - Text: Gray scale (`gray-900`, `gray-600`, `gray-500`)
- **Layout**: Centered, minimalistic, professional
- **Typography**: Bold, clean, modern

**Components**:
- **Logo**: Construction icon in yellow circle (`#FFE5B4` background, `#D97706` icon)
- **Title**: Large, bold "CEMVP" heading
- **Subtitle**: "AI Automation Marketplace"
- **ConstructionBadge**: Yellow badge with orange border showing "Under Construction"
- **Description**: Brief message about development status
- **AuthButtons**: Sign In / Sign Up buttons (orange theme) or UserInfo (if authenticated)

**State**:
- `user` (User | null): Current authenticated user from Supabase

**User Flows**:
1. Guest visits → Sees minimalistic landing with sign up/sign in buttons
2. Authenticated user visits → Shows dashboard link and sign out button
3. User clicks Sign In → Navigate to `/auth/signin`
4. User clicks Sign Up → Navigate to `/auth/signup`

**Features**:
- ✅ Minimalistic professional design
- ✅ Construction theme (yellow/orange colors)
- ✅ Clear "Under Construction" messaging
- ✅ Responsive layout
- ✅ Authentication state handling

**SEO**:
- Title: "CEMVP - AI Automation Marketplace"
- Description: "Discover and share high-quality AI automation templates"

---

## Page: Marketplace

**Route**: `/marketplace`

**Description**: Browse and search templates

**Components**:
- SearchBar (keyword search)
- FilterPanel (category, tool, price, complexity filters)
- TemplateGrid (displays template cards)
- Pagination (page navigation)

**State**:
- `templates` (Template[]): List of templates
- `filters` (FilterState): Current filter values
- `pagination` (PaginationState): Current page info
- `loading` (boolean): Loading state
- `error` (string | null): Error message

**User Flows**:
1. User lands → Loads approved templates
2. User searches → Filters templates by keyword
3. User applies filters → Updates template list
4. User clicks template → Navigate to `/templates/[id]`
5. User changes page → Loads new page of results

**Performance**:
- Use ISR (Incremental Static Regeneration) with 60s revalidation
- Cache filter results
- Lazy load template images

---

## Page: Template Detail

**Route**: `/templates/[id]`

**Description**: Detailed view of a single template

**Components**:
- TemplateHeader (title, price, status badge)
- TemplateMeta (creator, category, tools, complexity)
- TemplateDescription (full description)
- TemplateActions (Download/Purchase button, Like button)
- TemplateVersions (version history)
- RelatedTemplates (similar templates)

**State**:
- `template` (Template | null): Template data
- `versions` (TemplateVersion[]): Version history
- `related` (Template[]): Related templates
- `loading` (boolean): Loading state
- `error` (string | null): Error message

**User Flows**:
1. User visits → Loads template data
2. User clicks Download → Downloads file (if free or purchased)
3. User clicks Purchase → Redirects to Stripe Checkout
4. User clicks Like → Toggles like, updates count
5. User views version → Shows version details

**SEO**:
- Dynamic title: `{template.title} - CEMVP`
- Dynamic description: `{template.description}`
- Open Graph tags for sharing

---

## Page: Submit Template

**Route**: `/submit`

**Description**: Creator form to submit new template

**Components**:
- TemplateForm (all input fields)
- FileUpload (template file upload)
- ImageUpload (cover image upload)
- FormValidation (client-side validation)

**State**:
- `formData` (TemplateFormData): Form values
- `file` (File | null): Selected template file
- `coverImage` (File | null): Selected cover image
- `loading` (boolean): Submission loading state
- `error` (string | null): Error message

**User Flows**:
1. Creator visits → Shows empty form
2. Creator fills form → Validates inputs
3. Creator uploads file → Validates file
4. Creator submits → Creates template with PENDING status
5. Success → Redirects to dashboard with success message

**Validation**:
- Client-side validation before submit
- Server-side validation on API
- File size and type validation

**Access Control**:
- Requires authentication
- Requires CREATOR role
- Redirects to sign in if not authenticated

---

## Page: Dashboard

**Route**: `/dashboard`

**Description**: User dashboard showing profile and templates

**Components**:
- ProfileCard (user info)
- MyTemplates (user's templates list)
- QuickStats (templates count, views, downloads)
- ActionButtons (Submit Template, View Marketplace)

**State**:
- `profile` (Profile | null): User profile
- `templates` (Template[]): User's templates
- `stats` (UserStats): User statistics

**User Flows**:
1. User visits → Loads profile and templates
2. User clicks template → Navigate to template detail
3. User clicks Submit → Navigate to submit page
4. User views stats → See template performance

**Access Control**:
- Requires authentication
- Redirects to sign in if not authenticated

---

## Page: Admin Dashboard

**Route**: `/admin`

**Description**: Admin panel for reviewing templates

**Components**:
- StatsCards (pending, approved, rejected counts)
- TemplateQueue (list of pending templates)
- ReviewActions (Approve/Reject buttons)
- TemplatePreview (template details for review)

**State**:
- `pendingTemplates` (Template[]): Pending templates
- `approvedTemplates` (Template[]): Approved templates
- `rejectedTemplates` (Template[]): Rejected templates
- `selectedTemplate` (Template | null): Template being reviewed

**User Flows**:
1. Admin visits → Loads pending templates
2. Admin clicks template → Shows template details
3. Admin approves → Updates status to APPROVED
4. Admin rejects → Updates status to REJECTED with reason
5. Admin views stats → See approval metrics

**Access Control**:
- Requires authentication
- Requires ADMIN role
- Redirects to sign in if not authenticated
- Shows 403 if not admin

---

## Page: Sign In

**Route**: `/auth/signin`

**Description**: Professional sign in page with social login options and email/password authentication

**Visual Design**:
- **Color Scheme**: Minimalistic with construction theme
  - Background: Pure white
  - Primary: Orange (`#D97706`, `#B45309`)
  - Accent: Light yellow (`#FFE5B4`)
  - Card: White with border and shadow
- **Layout**: Centered card, clean and professional

**Components**:
- **ConstructionBadge**: Yellow badge showing "Site Under Construction"
- **SocialLoginButtons**: OAuth providers
  - Google (with Google icon)
  - GitHub (with GitHub icon)
  - Microsoft/Azure (with Microsoft icon)
  - Apple (with Apple icon)
- **Divider**: "Or continue with email" separator
- **SignInForm**: React Hook Form with Zod validation
  - Email input with Mail icon
  - Password input with Lock icon
  - Real-time validation feedback
  - Loading states with spinner
- **ErrorDisplay**: Error messages with destructive styling
- **AuthLinks**: Navigation links (sign up, back to home)

**State**:
- `email` (string): Email input (validated with Zod)
- `password` (string): Password input (min 6 chars, validated with Zod)
- `loading` (boolean): Email/password submission loading state
- `oauthLoading` (OAuthProvider | null): Current OAuth provider loading state
- `error` (string | null): Error message from Supabase

**Authentication Methods**:
1. **Social OAuth** (via Supabase):
   - Google OAuth
   - GitHub OAuth
   - Microsoft/Azure OAuth
   - Apple OAuth
2. **Email/Password** (via Supabase):
   - Email validation
   - Password validation

**Form Validation**:
- Email: Must be valid email format (Zod)
- Password: Minimum 6 characters (Zod)
- Real-time validation feedback
- Error messages displayed per field

**User Flows**:
1. User lands on page → Sees social login options and email form
2. User clicks social provider → Redirects to OAuth flow
3. User enters email → Real-time validation
4. User enters password → Real-time validation
5. User submits → Shows loading spinner
6. Success → Redirects to dashboard
7. Error → Shows error message

**OAuth Flow**:
1. User clicks social provider button
2. Redirects to provider OAuth page
3. User authorizes
4. Redirects back to `/auth/callback`
5. Supabase exchanges code for session
6. Redirects to dashboard

**Accessibility**:
- Proper form labels
- ARIA attributes
- Keyboard navigation
- Focus states
- Error announcements
- Loading state indicators

**Features**:
- ✅ Social login (Google, GitHub, Microsoft, Apple)
- ✅ Email/password authentication
- ✅ Form validation with Zod
- ✅ React Hook Form integration
- ✅ Icon-enhanced inputs
- ✅ Loading states for all actions
- ✅ Error handling
- ✅ "Under Construction" badge
- ✅ Responsive design
- ✅ Professional minimalistic design

---

## Page: Sign Up

**Route**: `/auth/signup`

**Description**: User registration

**Components**:
- SignUpForm (email, password, confirm password)
- ErrorDisplay (error messages)
- AuthLinks (sign in link)

**State**:
- `email` (string): Email input
- `password` (string): Password input
- `confirmPassword` (string): Confirm password input
- `loading` (boolean): Submission loading
- `error` (string | null): Error message

**User Flows**:
1. User enters details → Validates format
2. User submits → Creates Supabase account
3. Creates profile → Creates Prisma Profile record
4. Success → Redirects to dashboard
5. Error → Shows error message

**Post-Signup**:
- Creates Profile record with CONSUMER role
- Links Profile.userId to Supabase auth.users.id

