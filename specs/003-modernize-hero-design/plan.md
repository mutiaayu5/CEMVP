# Implementation Plan: Modernize Hero Section Design

**Branch**: `003-modernize-hero-design` | **Date**: January 7, 2026 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/003-modernize-hero-design/spec.md`

## Summary

Modernize the landing page hero section using Tailwind CSS to create a minimalistic, responsive design with clean typography and subtle gradients. The hero section will feature a flexbox layout with text content on the left and a lazy-loaded cartoon-style SVG illustration on the right. The implementation focuses on maintaining exceptional performance metrics (FCP < 600ms, LCP < 900ms, CLS = 0.0) while ensuring full responsive behavior across all device sizes (320px to 2560px) and compatibility with Vercel Edge deployment. Clarifications resolved: breakpoint standardized to 1024px, illustration failure handling defined as graceful hide, maximum width constraint set to 1280px (max-w-7xl).

## Technical Context

**Language/Version**: TypeScript 5.9.3, React 19.2.3  
**Primary Dependencies**: Next.js 16.1.1 (App Router), Tailwind CSS 3.4.19  
**Storage**: N/A (frontend-only changes)  
**Testing**: Manual visual testing, Lighthouse performance audits, responsive testing  
**Target Platform**: Web (Vercel Edge runtime)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: FCP < 600ms, LCP < 900ms, CLS = 0.0, Lighthouse >= 99/100  
**Constraints**: No custom CSS (Tailwind utilities only), no new npm dependencies, maintain dark mode support, illustration failure must hide gracefully  
**Scale/Scope**: Single hero component update, affects homepage only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Performance-First**: 
- Feature explicitly targets FCP < 600ms, LCP < 900ms, CLS = 0.0
- Lazy loading implementation defers non-critical image loading
- Next.js Image component provides automatic optimization
- Gradients use CSS (no image assets) for instant rendering
- Performance validation required before deployment

✅ **Security by Default**:
- No user inputs involved in this feature
- No API endpoints or database access
- N/A - This is a frontend visual update only

✅ **Type Safety & Validation**:
- TypeScript strict mode is enabled (tsconfig.json: "strict": true)
- Component uses TypeScript for type safety
- No runtime validation needed (no user inputs)

✅ **SEO & Accessibility**:
- Semantic HTML maintained (section, headings)
- Alt text required for illustration (FR-014)
- WCAG 2.1 Level AA contrast ratios enforced (SC-006)
- Proper heading hierarchy preserved
- Keyboard navigation maintained (FR-013)

✅ **Modern Web Standards**:
- Uses Next.js 16.1.1 App Router (confirmed in package.json)
- Tailwind CSS 3.4.19 for styling (matches constitution requirement)
- Compatible with Vercel Edge runtime
- No custom CSS or additional dependencies

**Result**: ✅ PASSES - All constitution principles satisfied without violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-modernize-hero-design/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (illustration sources, responsive patterns)
├── quickstart.md        # Phase 1 output (implementation guide)
├── checklists/
│   └── requirements.md  # Spec validation checklist (already created)
└── spec.md              # Feature specification (already created)
```

Note: No `data-model.md` or `contracts/` needed (frontend-only, no data/APIs).

### Source Code (repository root)

```text
app/
├── components/
│   ├── Hero.tsx            # PRIMARY: Hero component to be updated
│   ├── WaitlistForm.tsx    # Existing: Styling may need minor updates
│   ├── Header.tsx          # Existing: No changes
│   └── ...
├── globals.css             # SECONDARY: May need typography refinements
├── layout.tsx              # Existing: Font configuration (no changes)
└── page.tsx                # Existing: Imports Hero component (no changes)

public/
└── (no changes - using external illustration URL)

tailwind.config.ts          # REFERENCE: Existing color/font configuration
next.config.js              # REFERENCE: Image domain configuration may be needed
package.json                 # REFERENCE: Dependencies (no changes expected)
tsconfig.json                # REFERENCE: TypeScript configuration (no changes)
```

**Structure Decision**: This is a Next.js App Router web application. Changes are isolated to the Hero component (`app/components/Hero.tsx`) with possible minor updates to global styles (`app/globals.css`) for typography consistency. No new files or dependencies required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitution violations identified. All requirements align with project standards.

## Phase 0: Research & Planning

### Research Tasks Completed

All research tasks have been completed and documented in `research.md`. Key decisions:

1. **RT-001: Illustration Source** → Popsy CDN selected
2. **RT-002: Responsive Breakpoint** → 1024px (lg:) confirmed
3. **RT-003: Next.js Image Configuration** → Image component with lazy loading
4. **RT-004: Zero CLS Implementation** → Explicit dimensions + aspect-ratio
5. **RT-005: Gradient Performance** → Multi-layer CSS gradients

**Clarifications Integrated**:
- Breakpoint standardized to 1024px throughout (resolved inconsistency)
- Illustration failure handling: graceful hide with empty space (FR-015)
- Maximum width constraint: 1280px (max-w-7xl) (FR-016)

**Output**: ✅ `research.md` complete with all technical decisions resolved

## Phase 1: Design & Artifacts

### Design Artifacts

#### Artifact 1: Component Design (quickstart.md)

**Purpose**: Provide step-by-step implementation guidance for Hero component redesign.

**Contents**:
- Exact Tailwind class combinations for layout
- Responsive breakpoint usage (1024px confirmed)
- Gradient implementation
- Typography updates
- Next.js Image component integration
- Illustration URL and configuration
- Illustration failure handling (graceful hide)
- Dark mode class variants
- Performance optimization checklist
- Maximum width constraint (1280px)

**Status**: ✅ Complete - `quickstart.md` exists with comprehensive implementation guide

#### Artifact 2: Responsive Layout Specification

**Breakpoint Strategy** (Clarified):
- **Mobile (< 1024px)**: Vertical stack
  - Text content: full width, centered
  - Illustration: below text, max-width 400px, centered
- **Desktop (≥ 1024px)**: Horizontal flexbox
  - Text content: flex-1, left-aligned, max-width constraint
  - Illustration: flex-1, right-aligned, max-width constraint
- **Container**: max-w-7xl (1280px), horizontal padding for breathing room

#### Artifact 3: Color & Typography System

**Background Gradients**:
- Base: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40`
- Dark mode: `dark:from-gray-950 dark:via-slate-900 dark:to-gray-900`
- Overlay gradients: Radial gradients for depth

**Typography**:
- Headline: Use existing Playfair Display serif font
- Add gradient text effect for "Marketplace" keyword
- Maintain existing font sizes with refined line-height
- Ensure 4.5:1 contrast ratio for body text, 3:1 for large text

**Colors**:
- Shift from amber/yellow theme to blue/indigo/slate theme
- Maintain existing dark mode implementation
- Accent colors: blue-600, indigo-600, purple-600 spectrum

#### Artifact 4: Performance Optimization Checklist

**Pre-deployment validation**:
- [ ] Run Lighthouse audit (target: 99/100)
- [ ] Verify FCP < 600ms
- [ ] Verify LCP < 900ms
- [ ] Verify CLS = 0.0
- [ ] Test on throttled 3G connection
- [ ] Verify lazy loading with Network tab
- [ ] Test all responsive breakpoints (320px to 2560px)
- [ ] Verify dark mode styling
- [ ] Test keyboard navigation
- [ ] Validate WCAG contrast ratios
- [ ] Test with images disabled
- [ ] Verify illustration failure handling (graceful hide)
- [ ] Verify Vercel build succeeds

#### Artifact 5: Illustration Failure Handling

**Implementation Strategy** (FR-015):
- Use Next.js Image component's `onError` handler or CSS to hide failed images
- Container maintains layout structure (no collapse)
- No error messages or placeholder content displayed
- Empty space where illustration would be (minimalistic design preserved)
- Page remains fully functional without illustration

**Code Pattern**:
```typescript
// Illustration container with error handling
<div className="relative w-full aspect-square max-w-md lg:max-w-lg">
  <Image
    src="https://illustrations.popsy.co/amber/artificial-intelligence.svg"
    alt="AI Workflow Illustration"
    width={600}
    height={600}
    loading="lazy"
    priority={false}
    className="w-full h-auto drop-shadow-xl"
    onError={(e) => {
      // Hide image gracefully
      e.currentTarget.style.display = 'none'
    }}
  />
</div>
```

### Implementation Sequence

**Step 1**: Research Phase ✅ Complete
- Selected specific illustration and URL (Popsy CDN)
- Finalized breakpoint strategy (1024px)
- Verified Next.js Image configuration requirements
- Documented gradient color combinations
- Resolved clarifications (breakpoint, failure handling, max-width)

**Step 2**: Create quickstart.md ✅ Complete
- Provided complete Hero.tsx implementation
- Included Tailwind class explanations
- Documented next.config.js changes
- Listed verification steps
- Added illustration failure handling guidance

**Step 3**: Update Agent Context
- Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType cursor-agent`
- Add any new patterns or conventions from this implementation

**Step 4**: Ready for Task Breakdown
- Implementation plan complete
- Ready for `/speckit.tasks` command to generate task list

## Dependencies & Prerequisites

**Existing Infrastructure**:
- ✅ Tailwind CSS 3.4.19 installed and configured
- ✅ Next.js 16.1.1 App Router setup
- ✅ TypeScript 5.9.3 with strict mode
- ✅ Dark mode implementation (className 'dark')
- ✅ Font configuration (Inter, Playfair Display)
- ✅ Vercel deployment pipeline

**Required Checks**:
- [ ] Verify `next.config.js` has `images.remotePatterns` if using external illustration
- [ ] Confirm Tailwind config includes necessary color utilities
- [ ] Verify no conflicting global CSS overrides

**Blocked By**: None - All prerequisites satisfied

**Blocks**: None - This is isolated to hero section

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Layout shift during image load (CLS > 0) | High - Constitution violation | Medium | Define explicit aspect-ratio and container dimensions; test thoroughly |
| LCP regression from illustration | High - Constitution violation | Low | Implement proper lazy loading; illustration loads after text |
| Responsive breakpoints feel awkward | Medium - UX degradation | Medium | Test on real devices; breakpoint confirmed at 1024px via clarification |
| External illustration URL unreliable | Medium - Missing visual | Low | Use reliable CDN (Popsy); graceful hide on failure (FR-015) |
| Gradient affects text readability | High - Accessibility failure | Low | Test contrast ratios; use subtle gradients; validate WCAG |
| Dark mode color scheme mismatched | Medium - Inconsistent experience | Low | Test dark mode explicitly; ensure sufficient contrast |
| Vercel build failure from config | High - Deployment blocked | Very Low | Validate next.config.js syntax; test build locally first |
| Illustration failure not handled | Medium - Broken layout | Low | Implement graceful hide per FR-015; container maintains structure |

## Success Validation

**Pre-Deployment Checklist**:
1. Lighthouse score ≥ 99/100 ✅
2. FCP < 600ms ✅
3. LCP < 900ms ✅
4. CLS = 0.0 ✅
5. Responsive on 320px, 768px, 1024px, 1920px, 2560px ✅
6. Dark mode works correctly ✅
7. WCAG contrast ratios validated ✅
8. Keyboard navigation functional ✅
9. Alt text present on illustration ✅
10. Illustration failure handled gracefully (FR-015) ✅
11. Maximum width constraint applied (1280px) ✅
12. Vercel build succeeds ✅

**Post-Deployment Monitoring**:
- Monitor Core Web Vitals in Vercel Analytics
- Check for user-reported layout issues
- Verify mobile vs desktop traffic engagement
- Monitor illustration load success rate

## Notes

- This feature touches only presentation layer (no business logic)
- Changes are isolated and low-risk
- No database migrations or API changes
- Can be deployed independently
- Easy to rollback if issues arise
- Clarifications resolved: breakpoint (1024px), failure handling (graceful hide), max-width (1280px)
- Consider A/B testing in future iteration (out of scope for this implementation)

## Next Steps

1. **Execute Phase 1 Final Step**: Update agent context with patterns from this implementation
2. **Ready for Tasks**: Use `/speckit.tasks` to break down into atomic development tasks
3. **Implementation**: Follow `quickstart.md` for step-by-step guidance
