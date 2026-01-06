# CreateConomy Landing Page - Medium-Inspired Design Redesign

**Feature ID**: 002-medium-design  
**Created**: 2026-01-06  
**Status**: Draft

## Overview

Redesign the CreateConomy landing page to adopt a Medium-inspired aesthetic: clean, minimalist, typography-focused with card-based content presentation. The redesign maintains all existing functionality (waitlist signup, live counter, blog content filtering) while dramatically improving visual presentation, readability, and user engagement through industry-standard design patterns proven by Medium.com.

**Key Value**: Transform the landing page from a basic functional site into a premium, content-focused experience that builds trust and increases waitlist conversions through professional design.

## User Scenarios & Testing

### Scenario 1: First-Time Visitor Discovers CreateConomy (Priority: Critical)

**Context**: Sarah, a content creator, clicks a social media link to CreateConomy

**Steps**:
1. Page loads and displays large hero with "AI Workflow Marketplace" headline
2. Immediately sees "Join 5,247 innovators..." subtitle with live counter
3. Notices clean, Medium-style navigation (Logo | Stories | News)
4. Scrolls to see card-based blog grid with featured images
5. Enters email in prominent centered signup input
6. Receives instant feedback showing position in waitlist

**Expected Outcome**: 
- Page loads in under 2 seconds
- Visual hierarchy guides eye from headline → counter → signup
- Professional design builds immediate trust
- Clear call-to-action increases signup likelihood

**Edge Cases**:
- Slow connection: Progressive loading shows hero first, then cards
- Large monitor: Content stays centered, doesn't stretch uncomfortably
- Duplicate email: Clear message explains user already joined

### Scenario 2: Mobile User Browses Blog Content (Priority: High)

**Context**: James browses on his phone during commute

**Steps**:
1. Opens site on mobile (375px width)
2. Taps hamburger menu to reveal navigation
3. Sees hero section fills viewport perfectly
4. Scrolls to blog grid, now showing 1 column
5. Taps "Stories" tab to filter content
6. Taps a blog card to see featured image and excerpt

**Expected Outcome**:
- All content readable without horizontal scroll
- Touch targets minimum 44x44px
- Cards stack vertically with proper spacing
- Tab switching is instant and smooth
- Fonts scale appropriately for mobile

**Edge Cases**:
- Very small device (320px): Text and spacing adjust gracefully
- Landscape orientation: Content adapts to wider viewport
- Slow 3G: Text loads before images, layout doesn't shift

### Scenario 3: Returning Visitor Checks Latest News (Priority: Medium)

**Context**: Maria returns weekly to check for launch updates

**Steps**:
1. Lands on homepage, sees updated counter
2. Scrolls directly to blog section
3. Clicks "News" tab
4. Sees 3-column grid of latest posts with featured images
5. Hovers over card, sees lift effect (shadow + movement)
6. Reads post excerpt and author details

**Expected Outcome**:
- Counter shows updated number since last visit
- News tab displays newest posts first
- Card hover provides tactile feedback
- Author avatar and read time add credibility
- Typography makes excerpts easy to scan

**Edge Cases**:
- No new posts: Last viewed posts still display correctly
- Browser back button: Returns to exact scroll position and tab state
- Keyboard navigation: Can tab through cards and links

## Functional Requirements

### Navigation & Header
1. **Header must** display "CreateConomy" logo with serif or modern font
2. **Header must** include simple text navigation: "Stories" | "News"
3. **Header must** use mobile hamburger menu on screens < 768px
4. **Header must** remain fixed or sticky during scroll for easy access
5. **Navigation links must** visibly highlight active section

### Hero Section (Medium-Style)
6. **Hero must** display large H1 "AI Workflow Marketplace" as primary headline
7. **Hero must** show subtitle "Join X innovators..." with live counter number
8. **Hero must** feature centered, prominent email signup (large input + button)
9. **Hero must** display counter as subtle pill with optional pulse animation
10. **Hero must** use subtle gradient background (no heavy images/animations)
11. **Hero must** fill minimum 60vh on desktop, 80vh on mobile

### Blog Grid (Card-Based)
12. **Blog section must** include tabs: "Stories" | "News" for content filtering
13. **Blog cards must** display: featured image (16:9 ratio) | title | excerpt | author avatar + name | read time estimate
14. **Blog grid must** show 3 columns on desktop (>1024px), 2 columns on tablet (768-1023px), 1 column on mobile (<768px)
15. **Blog cards must** include hover effect: lift (shadow increase + translateY)
16. **Blog cards must** link to /blog/[slug] (future implementation)
17. **Featured images must** lazy load with blur-up placeholder

### Typography & Spacing
18. **Body text must** use minimum 16px font size for readability
19. **Headings must** use clear hierarchy (H1: 48-64px, H2: 32-40px, H3: 24-28px on desktop)
20. **Line height must** be 1.6-1.8 for body text, 1.2-1.4 for headings
21. **Content must** have generous whitespace (minimum 24px between sections)
22. **Maximum content width must** be 1200px, centered on ultra-wide displays

### Visual Design
23. **Color scheme must** use monochrome base (grays/black/white) + indigo/purple accent
24. **Cards must** have subtle shadows (e.g., 0 2px 8px rgba(0,0,0,0.1))
25. **Borders and containers must** use subtle rounded corners (4-8px radius)
26. **Interactive elements must** provide hover states with color/shadow transitions
27. **Design must** maintain WCAG AA contrast ratios (4.5:1 for text)

### Existing Functionality (Preserved)
28. **Waitlist signup must** validate email, enforce rate limiting (5/hour per IP)
29. **Waitlist signup must** show duplicate email feedback
30. **Waitlist signup must** return position in waitlist on success
31. **Counter must** update every 5 seconds and after successful signup
32. **Blog filtering must** instantly show/hide posts by category

## Success Criteria

### User Experience
1. **Task completion**: Waitlist signup completion rate increases by 25% compared to current design
2. **Engagement**: Average time on page increases by 40%
3. **Readability**: 90% of user testing participants rate text as "easy to read"
4. **Visual appeal**: 85% of user testing participants rate design as "professional" or "premium"

### Performance
5. **Load time**: Page fully loads (including images) in under 2 seconds on 4G connection
6. **First Contentful Paint**: Under 600ms
7. **Largest Contentful Paint**: Under 900ms
8. **Cumulative Layout Shift**: 0.0 (no layout shift as content loads)
9. **Lighthouse score**: 99+ for performance, accessibility, best practices

### Responsive Design
10. **Mobile usability**: 100% of content accessible without horizontal scroll on 320px+ devices
11. **Touch targets**: All interactive elements meet 44x44px minimum touch target size
12. **Viewport testing**: Design validated on 320px, 375px, 768px, 1024px, 1440px, and 1920px widths

### Accessibility
13. **Contrast**: All text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
14. **Keyboard navigation**: All interactive elements accessible via keyboard (Tab, Enter, Esc)
15. **Screen reader**: All content navigable and understandable with screen reader
16. **Focus indicators**: Visible focus states on all interactive elements

### Brand Consistency
17. **Visual coherence**: Design elements (typography, colors, spacing) consistent across all sections
18. **Content presentation**: Blog cards display consistently with predictable layout
19. **Micro-interactions**: Hover and transition effects feel polished and intentional

## Key Entities

### BlogPost (Enhanced Display)
- **id**: Unique identifier (UUID)
- **title**: Post headline (displayed in card)
- **slug**: URL-friendly identifier (for /blog/[slug] links)
- **excerpt**: Summary text (150-200 characters, displayed in card)
- **featured_image**: URL to 16:9 hero image (displayed in card)
- **category**: "Stories" or "News" (for tab filtering)
- **author_name**: Author display name (displayed in card)
- **author_avatar**: URL to author profile image (displayed in card)
- **read_time**: Estimated reading time in minutes (displayed in card)
- **published_at**: Timestamp (for sorting)

**Relationships**: None  
**Validation Rules**:
- featured_image must be accessible URL, recommended size 1200x675px
- author_avatar must be accessible URL, recommended size 200x200px
- excerpt must be 150-200 characters
- read_time must be positive integer (1-30 minutes typical range)

### WaitlistEmail (Unchanged)
- **id**: UUID
- **email**: Unique email address
- **ip_address**: For rate limiting (5/hour per IP)
- **created_at**: Timestamp

## Out of Scope

1. Blog post detail pages (/blog/[slug]) - links created but pages not implemented
2. Author profile pages - author info displayed but not linked
3. Search functionality for blog posts
4. Blog post comments or social sharing
5. Email newsletter subscription separate from waitlist
6. Dark mode toggle (may be future enhancement)
7. Animated illustrations or custom graphics
8. Video content or embedded media in blog cards
9. Pagination for blog posts (showing first 10 only)
10. Admin interface for managing blog posts

## Assumptions

1. **Content availability**: All blog posts will have featured images and author avatars before launch
2. **Image hosting**: Featured images and avatars hosted on reliable CDN with proper CORS headers
3. **Read time calculation**: Backend calculates and stores read_time, not computed client-side
4. **Font licensing**: Serif/modern fonts available via Google Fonts or similar free service
5. **Browser support**: Targeting modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
6. **Content volume**: Maximum 50 total blog posts displayed (no pagination needed initially)
7. **Image dimensions**: All featured images pre-processed to 16:9 aspect ratio
8. **Author consistency**: Each author has consistent name and avatar across all posts

## Dependencies

1. **Database schema update**: BlogPost table needs new columns (featured_image, author_name, author_avatar, read_time)
2. **Content preparation**: Existing blog posts need featured images and author data added
3. **Image optimization**: CDN or image optimization service configured for featured images
4. **Design assets**: Serif font selection finalized
5. **Existing waitlist API**: Must continue functioning with new UI

## Open Questions

*All design decisions have been specified with reasonable defaults based on Medium.com reference. No critical clarifications needed.*

## Notes

- Design reference: [Medium.com homepage](https://medium.com/)
- Existing functionality (waitlist, counter, rate limiting) must remain unchanged
- This is a visual redesign, not a feature addition
- Performance targets are non-negotiable per project constitution
- Mobile-first development approach recommended
