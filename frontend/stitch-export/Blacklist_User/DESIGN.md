---
name: NesRent
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#4d4732'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#7e775f'
  outline-variant: '#d0c6ab'
  surface-tint: '#705d00'
  primary: '#705d00'
  on-primary: '#ffffff'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#e9c400'
  secondary: '#555f6f'
  on-secondary: '#ffffff'
  secondary-container: '#d6e0f3'
  on-secondary-container: '#596373'
  tertiary: '#5c5f60'
  on-tertiary: '#ffffff'
  tertiary-container: '#d9dadc'
  on-tertiary-container: '#5d5f61'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#d9e3f6'
  secondary-fixed-dim: '#bdc7d9'
  on-secondary-fixed: '#121c2a'
  on-secondary-fixed-variant: '#3d4756'
  tertiary-fixed: '#e1e2e4'
  tertiary-fixed-dim: '#c5c6c8'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system is built for the "student-renter" archetype—ambitious, social, and mobile-first. The brand personality balances the vibrancy of campus life with the reliability of a professional marketplace. 

The chosen style is **Modern / Minimalist with Playful accents**. It leverages significant whitespace to reduce cognitive load during the high-stress activity of house hunting. The aesthetic uses generous negative space to let property imagery shine, while utilizing high-energy color pops to guide the user through the conversion funnel. It evokes a feeling of optimism, accessibility, and trust.

## Colors

The palette is anchored by "Energetic Gold," a nod to academic excellence and high-spirit energy. This is used exclusively for primary actions, success states, and progress indicators. 

- **Primary:** Vibrant Yellow (#FFD700) - used for high-impact touchpoints.
- **Surface:** Pure White (#FFFFFF) - used for cards and primary containers.
- **Background:** Ghost Gray (#F9FAFB) - used for the main application canvas to provide subtle separation from cards.
- **Typography:** Charcoal (#1F2937) - ensures AAA accessibility and a grounded, professional feel.
- **Accents:** Use a 10% opacity version of the primary yellow for hover states on light elements.

## Typography

This design system uses a dual-font strategy. **Plus Jakarta Sans** provides a friendly, geometric personality for headlines, creating an approachable and modern editorial feel. **Inter** is used for all body text and UI labels to ensure maximum legibility at small sizes and high-density information displays (like property specs).

Headline weights should remain Bold (700) or ExtraBold (800) to create a strong visual hierarchy. Body text should stick to Regular (400) for long-form reading and Medium (500) for emphasized metadata.

## Layout & Spacing

The design system utilizes a **Fixed Grid** model for desktop (12 columns, 1280px max-width) and a **Fluid** model for mobile. A strict 8px linear scale governs all padding and margin decisions.

To achieve the "Playful" vibe, the layout leans into "Over-spacing." Vertical sections should be separated by at least `lg` (48px) to `xl` (80px) units to prevent the interface from feeling cramped or "budget." Elements within cards use the `md` (24px) unit for internal padding to maintain an airy, premium feel.

## Elevation & Depth

Depth is communicated through **Ambient Shadows** rather than lines. This system avoids harsh borders, preferring to use soft, diffused shadows to lift components off the `neutral` background.

- **Level 1 (Cards):** A very soft, wide blur (Y: 4, Blur: 20, Color: 1F2937 at 4% opacity).
- **Level 2 (Dropdowns/Modals):** A more pronounced shadow to indicate focus (Y: 12, Blur: 32, Color: 1F2937 at 8% opacity).
- **Interactive:** On hover, cards should subtly lift (Y: 8, Blur: 24, Opacity: 10%) to provide tactile feedback.

## Shapes

The shape language is defined by high-radius curves, reinforcing the friendly and student-centric vibe. 

- **Containers & Cards:** 24px corner radius (the "Large" standard).
- **Buttons & Inputs:** 12px or 16px corner radius.
- **Selection Indicators:** Fully rounded (pill) for tags and chips.

The use of 0px or small radii is strictly prohibited to avoid making the UI feel overly corporate or rigid.

## Components

### Buttons
Primary buttons use the #FFD700 fill with #1F2937 text for maximum contrast. They should feature a 16px corner radius. Secondary buttons should be Ghost-style (transparent fill, #1F2937 border) or light gray.

### Cards
Cards are the primary organizational unit. They must have a white background, a 24px corner radius, and Level 1 elevation. Image headers within cards should have their top corners rounded to match the container.

### Input Fields
Inputs should use a 1px border (#E5E7EB) with a 12px radius. When focused, the border should thicken to 2px and change to the primary yellow, or utilize a subtle yellow glow (outer shadow).

### Chips & Badges
Used for property tags (e.g., "Wifi Included," "Near Campus"). These are pill-shaped with a soft #FFD700 (15% opacity) background and #1F2937 text to maintain playfulness without being overwhelming.

### Progress Indicators
For multi-step rental applications, use thick, rounded progress bars in Primary Yellow to keep students motivated and informed of their status.