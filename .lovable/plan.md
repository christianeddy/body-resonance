

# BODY App v2 — Implementation Plan (Approved)

## Implementation Order

### Step 1: Design Foundation
- Update `index.html` with Google Fonts (Barlow Condensed + DM Sans)
- Rewrite `index.css` with full dark palette (#050505, #0D0D12, #F5F5F7, #2563EB)
- Override Tailwind config: custom colors, border-radius (16px/12px/24px), animations (staggered, pulse, bounce, fade+slide, breathing circle keyframes)
- Add breathing circle CSS: 3 concentric rings with ripple delay (0s, 0.15s, 0.3s), scale 0.6→1.0→0.6 over 8s, center glow point with blur

### Step 2: Core Layout & Navigation
- Mobile shell component (max-w-md centered, min 375px)
- Bottom nav with 4 tabs, dot indicator, proper icon sizing
- Route setup for all pages
- Page transition wrapper (fade-in 200ms + slide-up 8px)

### Step 3: Auth & Onboarding Pages
- Auth page: B·O·D·H·I logo, email/password inputs, Google OAuth button, styled per spec
- Onboarding: 4-step flow with dot progress, selectable cards, slide transitions
- Profile determination logic (deportivo vs bienestar)

### Step 4: Supabase Backend
- Create all 6 tables (profiles, practices, programs, user_program_progress, sessions, saved_practices)
- RLS policies on all tables
- Seed 7 breathing practices + 4 ice protocols + 4 programs
- Auth integration

### Step 5: Home Page
- Stats cards (horizontal scroll, Barlow Condensed SemiBold numbers)
- Daily ritual card with recommendation logic + COMENZAR pulse button
- Programs horizontal scroll with progress badges
- Explore grid (3 cards with color tints)
- Staggered card animations (50ms delay between cards)

### Step 6: Respirar Module
- Filter pills (scrolleable, active/inactive states)
- Practice list cards with intensity bars, favorite toggle (bounce animation)
- Practice detail page with phases timeline
- Fixed COMENZAR button

### Step 7: Player (Star Screen)
- Breathing circle: 3 rings with ripple animation, center glow — CSS-only, hypnotic quality
- Audio mode: controls, 2px progress bar, Supabase audio playback
- Visual mode: phase text + countdown synced to circle
- Completion screen: check animation, feeling selection, session save
- Ritual completo: sequential audio with transition screens

### Step 8: Sesión Module
- HIELO tab: 4 protocol cards (Ritual Completo highlighted)
- CALOR tab: elegant "PRÓXIMAMENTE" placeholder

### Step 9: Programs
- Program detail with vertical timeline
- Day states: completed (green check), current (blue border), locked (dimmed)

### Step 10: Profile
- Avatar + stats expanded + most-used practice
- 12-week activity heatmap (blue intensity gradient)
- Favorites list + session history
- Logout button

## Key Design Reminders (User-Emphasized)
- **Typography**: Barlow Condensed Bold CAPS 0.08em for headlines/CTAs. DM Sans for body. Stats numbers large in Barlow Condensed SemiBold.
- **Micro-interactions**: 50ms staggered cards, pulse on COMENZAR, bounce on favorites, fade+slide transitions.
- **shadcn override**: Inner glow cards, 1px rgba borders, subtle gradients. Must NOT look like default shadcn.
- **Breathing circle**: The most important visual element. 3 concentric rings, ripple delays, CSS-only.
- **Rule #10**: Better design over more features, always.

