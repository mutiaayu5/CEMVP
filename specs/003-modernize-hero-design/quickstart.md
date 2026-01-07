# Quickstart: Modernize Hero Section Design

**Feature**: 003-modernize-hero-design  
**Date**: January 7, 2026  
**Purpose**: Step-by-step implementation guide for modernizing the hero section

## Overview

This guide provides complete implementation instructions for updating the hero section with a modern, minimalistic design featuring Tailwind CSS gradients, clean typography, and a lazy-loaded illustration.

**Estimated Time**: 30-45 minutes  
**Difficulty**: Easy  
**Files Modified**: 2-3 files  
**New Files**: 0 files

---

## Prerequisites

Before starting, ensure:
- ✅ You're on branch `003-modernize-hero-design`
- ✅ Next.js development server can start (`npm run dev`)
- ✅ You have basic understanding of Tailwind CSS
- ✅ You have basic understanding of Next.js Image component

---

## Implementation Steps

### Step 1: Configure Next.js for External Images

**File**: `next.config.js`

**Action**: Add configuration for external image domain

<details>
<summary>View Current next.config.js</summary>

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // May be empty or have other config
}

module.exports = nextConfig
```
</details>

**Update To**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'illustrations.popsy.co',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
```

**If `images` config already exists**, merge the `remotePatterns` array:

```javascript
images: {
  remotePatterns: [
    // ...existing patterns...
    {
      protocol: 'https',
      hostname: 'illustrations.popsy.co',
      pathname: '/**',
    },
  ],
}
```

**Why**: Next.js requires explicit configuration to load images from external domains for security.

**Validation**: 
```bash
npm run dev
# Should start without errors
```

---

### Step 2: Update Hero Component

**File**: `app/components/Hero.tsx`

**Action**: Replace entire component with modernized version

<details>
<summary>Current Hero.tsx (Reference)</summary>

```typescript
import WaitlistForm from './WaitlistForm'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[80vh] md:min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-amber-100 to-amber-50 dark:from-gray-900 dark:to-gray-800 px-4 py-20 transition-colors">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-8 inline-block">
          <div className="px-4 py-2 bg-accent-50 dark:bg-accent-900/30 rounded-full border border-accent-300 dark:border-accent-700 text-sm font-medium text-accent-700 dark:text-accent-400">
            🚀 Coming Soon
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 text-gray-900 dark:text-white">
          AI Workflow
          <br />
          Marketplace
        </h1>

        {/* Subtitle */}
        <div className="mb-8">
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light">
            Join innovators building the future of automation
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="max-w-2xl mx-auto">
          <WaitlistForm />
        </div>

        {/* Supporting Text */}
        <p className="mt-8 text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Discover, share, and monetize AI-powered workflows.
          <br className="hidden sm:inline" />
          Be the first to know when we launch.
        </p>
      </div>
    </section>
  )
}
```
</details>

**Replace With**: Modernized Hero Component

```typescript
import WaitlistForm from './WaitlistForm'
import Image from 'next/image'

export default function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 px-6 py-20 transition-colors overflow-hidden"
    >
      {/* Subtle background gradients for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent dark:from-indigo-900/10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left side - Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Badge */}
            <div className="mb-8 inline-block">
              <div className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-full border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm text-sm font-medium text-blue-700 dark:text-blue-300 shadow-sm">
                <span className="mr-2">✨</span>
                Coming Soon
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-serif font-bold mb-6 text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                AI Workflow
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>

            {/* Subtitle */}
            <div className="mb-10">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Join innovators building the future of automation
              </p>
            </div>

            {/* Waitlist Form */}
            <div className="max-w-xl mx-auto lg:mx-0">
              <WaitlistForm />
            </div>

            {/* Supporting Text */}
            <p className="mt-8 text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover, share, and monetize AI-powered workflows.
              <br className="hidden sm:inline" />
              Be the first to know when we launch.
            </p>
          </div>

          {/* Right side - Illustration */}
          <div className="flex-1 max-w-xl lg:max-w-2xl w-full flex items-center justify-center lg:justify-end">
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
                  // Hide illustration gracefully if it fails to load (FR-015)
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
```

**Key Changes Explained**:

1. **Import Added**: `import Image from 'next/image'` - Next.js Image component
2. **Layout**: Changed from centered `text-center` to flex layout with left/right sections
3. **Background**: Shifted from amber to blue/indigo/slate gradient with radial overlays
4. **Typography**: Added gradient text effects to headline
5. **Illustration**: Added lazy-loaded SVG image on right side
6. **Responsive**: Uses `lg:flex-row` for horizontal layout on desktop, stacks on mobile
7. **Container**: Increased max-width to `max-w-7xl` for better use of space

**Before/After Comparison**:

| Aspect | Before | After |
|--------|--------|-------|
| Layout | Centered column | Left (text) + Right (illustration) |
| Background | Amber gradient | Blue/indigo/slate gradient |
| Headline | Solid color | Gradient text effect |
| Illustration | None | Lazy-loaded SVG |
| Max width | 4xl (896px) | 7xl (1280px) |
| Min height | 80vh / 60vh | 90vh |

---

### Step 3: Test Responsive Behavior

**Action**: Verify the layout works at all screen sizes

**Desktop Testing (≥ 1024px)**:
```bash
npm run dev
# Open http://localhost:3000
# Resize browser window to 1024px+ width
```

**Expected**:
- ✅ Text content on left, illustration on right
- ✅ Text is left-aligned
- ✅ Both sections take up roughly equal space
- ✅ Adequate gap between text and illustration
- ✅ Illustration has drop shadow effect

**Mobile Testing (< 1024px)**:
```bash
# Open browser DevTools (F12)
# Toggle device toolbar (Ctrl+Shift+M)
# Select iPhone 12 Pro or similar
```

**Expected**:
- ✅ Text content stacked above illustration
- ✅ Text is centered
- ✅ Illustration is centered and sized appropriately
- ✅ No horizontal scrolling
- ✅ All text is readable without zooming

**Breakpoint Testing**:
- 320px (iPhone SE): ✅ Layout intact
- 768px (iPad Portrait): ✅ Vertical stack
- 1024px (iPad Landscape): ✅ Horizontal layout
- 1440px (Laptop): ✅ Horizontal layout
- 1920px (Desktop): ✅ Horizontal layout
- 2560px (4K): ✅ Content centered with max-width

---

### Step 4: Test Dark Mode

**Action**: Verify dark mode styling works correctly

**Toggle Dark Mode**:
- Use the existing theme toggle in the header
- OR manually add `class="dark"` to `<html>` tag in browser DevTools

**Expected (Dark Mode)**:
- ✅ Background: Deep gray/slate gradient (not black)
- ✅ Headline gradient: White to light blue/indigo
- ✅ Body text: Light gray (readable contrast)
- ✅ Badge: Blue with subtle background
- ✅ Illustration: Visible and clear
- ✅ No jarring color shifts

**Contrast Check**:
- Open browser DevTools
- Inspect headline text
- Verify computed color has sufficient contrast
- Use WebAIM Contrast Checker if needed: https://webaim.org/resources/contrastchecker/

---

### Step 5: Performance Validation

**Action**: Verify performance metrics meet constitution requirements

**Run Lighthouse Audit**:
```bash
# In Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to "Lighthouse" tab
# 3. Select "Desktop" or "Mobile"
# 4. Check "Performance" category
# 5. Click "Analyze page load"
```

**Expected Results**:
- ✅ Performance Score: ≥ 99/100
- ✅ First Contentful Paint (FCP): < 600ms
- ✅ Largest Contentful Paint (LCP): < 900ms
- ✅ Cumulative Layout Shift (CLS): 0.0

**Network Throttling Test**:
```bash
# In Chrome DevTools
# 1. Go to "Network" tab
# 2. Select "Fast 3G" or "Slow 3G" throttling
# 3. Reload page (Ctrl+R)
# 4. Observe: Text appears first, then illustration loads
```

**Expected**:
- ✅ Text content (headline, subtitle) appears immediately
- ✅ Illustration loads after text without causing layout shift
- ✅ No visual "jumping" when illustration loads
- ✅ Page remains usable while illustration loads

**CLS Validation**:
```bash
# In Chrome DevTools
# 1. Open "Performance" tab
# 2. Click "Record" (Ctrl+E)
# 3. Reload page
# 4. Stop recording
# 5. Look for "Layout Shift" events (should be zero)
```

---

### Step 6: Accessibility Testing

**Action**: Verify accessibility requirements are met

**Keyboard Navigation**:
```bash
# On the page
# 1. Press Tab key repeatedly
# 2. Verify focus indicators are visible
# 3. Verify you can reach the waitlist form
# 4. Verify no keyboard traps
```

**Expected**:
- ✅ Tab order is logical (badge → headline → form → supporting text)
- ✅ Focus indicators are visible
- ✅ No elements are keyboard-inaccessible

**Screen Reader Test** (Optional but Recommended):
```bash
# Windows: Enable Narrator (Win+Ctrl+Enter)
# Mac: Enable VoiceOver (Cmd+F5)
# Navigate through hero section
```

**Expected**:
- ✅ Headline is announced correctly
- ✅ Illustration alt text is read: "AI Workflow Illustration"
- ✅ Content order makes sense when read linearly

**Contrast Validation**:
- Headline (gray-900): Contrast ≥ 3:1 ✅
- Body text (gray-600): Contrast ≥ 4.5:1 ✅
- Supporting text (gray-500): Contrast ≥ 4.5:1 ✅
- Badge text (blue-700): Contrast ≥ 4.5:1 ✅

---

### Step 7: Build & Deploy Verification

**Action**: Verify the changes build successfully and deploy to Vercel

**Local Build Test**:
```bash
npm run build
```

**Expected Output**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**If build fails**, check:
- next.config.js syntax is correct
- No TypeScript errors
- Image import is correct
- All Tailwind classes are valid

**Deploy to Vercel**:
```bash
git add .
git commit -m "feat: modernize hero section with illustration and gradients"
git push origin 003-modernize-hero-design
```

**In Vercel Dashboard**:
- Verify build succeeds
- Check deployment preview
- Verify illustration loads correctly
- Test performance on live URL

**Vercel Analytics Check** (Post-Deployment):
- Monitor Core Web Vitals
- Verify FCP, LCP, CLS metrics
- Check for any errors in console

---

## Troubleshooting

### Issue: Image Not Loading

**Symptoms**: Broken image icon, or Next.js error about external images

**Solution**:
1. Verify `next.config.js` has correct `remotePatterns` configuration
2. Restart dev server: `npm run dev` (config changes require restart)
3. Check browser Network tab for 404 or CORS errors
4. Verify URL is accessible: https://illustrations.popsy.co/amber/artificial-intelligence.svg

### Issue: Layout Shift (CLS > 0)

**Symptoms**: Page "jumps" when illustration loads

**Solution**:
1. Verify Image component has explicit `width={600}` and `height={600}`
2. Verify container has `aspect-square` class
3. Test with slow network throttling to observe shift
4. Check Lighthouse report for CLS score

### Issue: Poor Performance (FCP > 600ms)

**Symptoms**: Lighthouse performance score < 99

**Solution**:
1. Verify `loading="lazy"` is present on Image component
2. Verify `priority={false}` is set (prevents preloading)
3. Check for other performance issues unrelated to hero section
4. Test on production build (`npm run build && npm start`), not dev mode

### Issue: Dark Mode Colors Look Wrong

**Symptoms**: Poor contrast or invisible text in dark mode

**Solution**:
1. Verify all color classes have `dark:` variants
2. Toggle dark mode and inspect computed styles
3. Check contrast ratios with WebAIM Contrast Checker
4. Verify `dark` class is applied to `<html>` element

### Issue: Responsive Layout Breaks

**Symptoms**: Text too narrow, illustration too large, or horizontal scrolling

**Solution**:
1. Verify `lg:flex-row` is present (enables horizontal layout at 1024px+)
2. Check that both content and illustration have `flex-1`
3. Verify padding/margin values are responsive (px-6, gap-12 lg:gap-16)
4. Test at exact breakpoints: 320px, 768px, 1024px, 1920px

### Issue: TypeScript Errors

**Symptoms**: Build fails with type errors

**Solution**:
1. Verify `import Image from 'next/image'` is present
2. Verify `next` package is up to date (16.1.1)
3. Run `npm install` to ensure all types are installed
4. Check that `@types/react` and `@types/node` are installed

### Issue: Illustration Failure Not Handling Gracefully

**Symptoms**: Broken image icon appears, or layout collapses when illustration fails to load

**Solution**:
1. Verify `onError` handler is present on Image component
2. Test by blocking illustration domain in browser DevTools (Network tab → Block request URL)
3. Verify container maintains `aspect-square` dimensions even when image is hidden
4. Confirm no error messages or broken image icons are displayed
5. Ensure page remains fully functional without illustration

**Expected Behavior** (FR-015):
- Illustration container hides gracefully (empty space)
- No visual indicators of missing image
- Layout structure maintained
- Page fully functional

---

## Validation Checklist

Before marking implementation complete, verify:

### Visual Design
- [ ] Hero section has blue/indigo/slate gradient background
- [ ] Subtle radial gradient overlays visible
- [ ] Headline has gradient text effect ("Marketplace" in blue/indigo/purple)
- [ ] Badge has updated blue theme
- [ ] Illustration loads and displays correctly
- [ ] Layout is clean and minimalistic
- [ ] Adequate whitespace around all elements

### Responsive Behavior
- [ ] Mobile (< 1024px): Vertical stack, centered text
- [ ] Desktop (≥ 1024px): Horizontal layout, left-aligned text
- [ ] All breakpoints tested (320px, 768px, 1024px, 1920px, 2560px)
- [ ] No horizontal scrolling at any width
- [ ] Text readable at all sizes without zooming

### Performance
- [ ] Lighthouse Performance: ≥ 99/100
- [ ] FCP < 600ms
- [ ] LCP < 900ms
- [ ] CLS = 0.0
- [ ] Lazy loading works (illustration loads after text)
- [ ] No layout shift when illustration loads

### Accessibility
- [ ] Alt text present on illustration
- [ ] Keyboard navigation functional
- [ ] Focus indicators visible
- [ ] WCAG contrast ratios met (4.5:1 body, 3:1 headings)
- [ ] Screen reader announces content correctly
- [ ] Semantic HTML maintained
- [ ] Illustration failure handled gracefully (FR-015) - hides with empty space, no error messages

### Dark Mode
- [ ] Dark mode toggle works
- [ ] Background gradient visible and attractive in dark mode
- [ ] Text has sufficient contrast in dark mode
- [ ] Badge styling works in dark mode
- [ ] Illustration visible in dark mode

### Build & Deployment
- [ ] `npm run build` succeeds without errors
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Vercel build succeeds
- [ ] Deployed preview URL works correctly
- [ ] Illustration loads on production

---

## Performance Optimization Tips

**If performance is below target**:

1. **Reduce Illustration Size**:
   - Consider hosting a smaller version of the illustration
   - Optimize SVG with SVGO tool

2. **Preconnect to CDN**:
   ```html
   <link rel="preconnect" href="https://illustrations.popsy.co" />
   ```
   Add to `app/layout.tsx` in `<head>` section

3. **Consider Alternative Illustration**:
   - If Popsy CDN is slow, download SVG and host in `/public`
   - Update Image `src` to `/images/hero-illustration.svg`

4. **Defer Non-Critical CSS**:
   - Gradient overlays could be loaded after FCP if needed
   - This is advanced and likely unnecessary

---

## Next Steps

**After completing implementation**:

1. ✅ **Mark feature complete**: Update spec.md status to "Implemented"
2. ✅ **Run final validation**: Complete validation checklist above
3. ✅ **Document any deviations**: Note any changes from original plan
4. ✅ **Create pull request**: Merge `003-modernize-hero-design` into `main`
5. ✅ **Monitor production**: Watch Core Web Vitals after deployment

**For task breakdown**:
- Use `/speckit.tasks` command to generate detailed task list
- Tasks will break down implementation into atomic steps

---

## Reference

**Files Modified**:
- `next.config.js` - Added external image domain configuration
- `app/components/Hero.tsx` - Completely redesigned component

**Files Not Modified** (but referenced):
- `tailwind.config.ts` - Existing config used as-is
- `app/globals.css` - No changes needed
- `app/layout.tsx` - No changes needed
- `app/page.tsx` - No changes needed (imports Hero component)

**External Resources**:
- Illustration URL: https://illustrations.popsy.co/amber/artificial-intelligence.svg
- Next.js Image docs: https://nextjs.org/docs/app/api-reference/components/image
- Tailwind CSS docs: https://tailwindcss.com/docs
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Estimated Impact**:
- Development time: 30-45 minutes
- Testing time: 15-30 minutes
- Risk level: Low (isolated to hero component)
- Rollback ease: High (single component change)

---

## Success Criteria

This implementation is successful when:

1. ✅ All visual design requirements met
2. ✅ All performance metrics met (FCP, LCP, CLS, Lighthouse)
3. ✅ All responsive breakpoints work correctly
4. ✅ All accessibility requirements met
5. ✅ Dark mode works correctly
6. ✅ Build and deployment succeed
7. ✅ No regressions in other parts of the site
8. ✅ User feedback positive (if A/B testing or surveys conducted)

**Definition of Done**: Hero section modernized, validated, deployed, and monitored.

