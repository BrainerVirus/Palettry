# Color Palette Generation Fundamentals

## Overview

This document provides a comprehensive, step-by-step methodology for generating complete color palettes from a single brand color using the OKLCH color space. The system creates tonal scales, semantic colors, neutral scales, and interactive states while ensuring perceptual uniformity, accessibility, and design system compatibility.

**Key Principles:**

- **OKLCH Color Space:** Used for perceptually uniform color manipulation
- **Mathematical Progression:** Systematic lightness and chroma adjustments
- **Personality Matching:** Maintains visual consistency across semantic colors
- **Accessibility-First:** Ensures WCAG AA compliance
- **Design System Ready:** Compatible with shadcn/ui, DaisyUI, and custom systems

## Prerequisites

### Required Tools

- OKLCH color calculator or converter
- Contrast ratio checker (WebAIM, Stark, or built-in browser tools)
- Color blindness simulator (Sim Daltonism, Color Oracle)
- CSS custom properties support

### Starting Information

- **Base Color:** Your brand primary color in OKLCH format: `oklch(L% C H)`
- **Example Base:** `oklch(49.6% 0.272 303.89)` (purple/magenta)
- **Target Systems:** shadcn/ui, DaisyUI, or custom design systems

### Color Theory Knowledge

- **Lightness (L):** 0% = black, 100% = white, perceptual brightness
- **Chroma (C):** 0 = grayscale, higher = more saturated
- **Hue (H):** 0-360°, color family (red=25°, yellow=70°, green=140°, blue=240°, purple=303°)

---

## STEP 1: Analyze Your Base Color

### What

Extract and calculate key metrics from your brand color to understand its "personality" for consistent palette generation.

### How

1. Deconstruct the OKLCH values
2. Calculate perceptual weight and energy metrics
3. Determine saturation level and visual characteristics

### Why

Different colors have unique perceptual properties. This analysis ensures semantic colors match your brand's visual weight and intensity rather than just using arbitrary values.

### Formulas and Calculations

```javascript
// Extract components
const baseColor = {
  lightness: 49.6,    // L from oklch(L% C H)
  chroma: 0.272,      // C from oklch(L% C H)
  hue: 303.89         // H from oklch(L% C H)
};

// Calculate personality metrics
const baseProfile = {
  // Perceptual weight: darker × more saturated = heavier visual impact
  weight: (100 - baseColor.lightness) * baseColor.chroma,

  // Saturation energy: accounts for lightness effect on perceived saturation
  energy: baseColor.chroma * Math.pow(baseColor.lightness / 50, 0.5),

  // Saturation level classification
  saturationLevel: baseColor.chroma > 0.2 ? "high" :
                   baseColor.chroma > 0.1 ? "medium" : "low"
};

// Example calculation for oklch(49.6% 0.272 303.89)
const exampleProfile = {
  weight: (100 - 49.6) * 0.272 = 13.71,
  energy: 0.272 * Math.pow(49.6/50, 0.5) = 0.271,
  saturationLevel: "high"
};
```

### Output

- Base color components (L, C, H)
- Personality metrics (weight, energy, saturation level)
- Visual characteristics assessment

---

## STEP 2: Generate Tonal Scale

### What

Create 9-11 shades of your primary color by systematically adjusting lightness while maintaining hue and adjusting chroma for perceptual uniformity.

### How

1. Define lightness progression values
2. Calculate chroma adjustments for each shade
3. Generate CSS custom properties

### Why

Tonal scales provide consistent color options for UI elements of varying importance. Mathematical progression ensures smooth perceptual transitions.

### Lightness Progression Formula

```
Scale Values: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
Lightness Adjustment: Base ± percentage offsets
```

**Specific Lightness Values:**

```
50:  Base + 45.4% = 95%
100: Base + 40.4% = 90%
200: Base + 30.4% = 80%
300: Base + 20.4% = 70%
400: Base + 10.4% = 60%
500: Base + 0% = 49.6% (your base)
600: Base - 7.6% = 42%
700: Base - 14.6% = 35%
800: Base - 21.6% = 28%
900: Base - 29.6% = 20%
950: Base - 37.6% = 12%
```

### Chroma Adjustment Formula

**Why:** As lightness increases, colors appear less saturated perceptually. As lightness decreases, maximum achievable chroma reduces.

```
New_Chroma = Base_Chroma × (Current_Lightness / Base_Lightness)^0.7
```

**Explanation:**

- **Exponent 0.7:** Balances perceptual saturation changes
- **Lighter shades:** Reduce chroma as lightness increases
- **Darker shades:** Reduce chroma as lightness decreases

### Applied Example

```css
/* For base: oklch(49.6% 0.272 303.89) */
--primary-50: oklch(95% 0.05 303.89); /* 0.272 × (95/49.6)^0.7 ≈ 0.05 */
--primary-100: oklch(90% 0.08 303.89); /* 0.272 × (90/49.6)^0.7 ≈ 0.08 */
--primary-200: oklch(80% 0.12 303.89); /* 0.272 × (80/49.6)^0.7 ≈ 0.12 */
--primary-300: oklch(70% 0.16 303.89); /* 0.272 × (70/49.6)^0.7 ≈ 0.16 */
--primary-400: oklch(60% 0.2 303.89); /* 0.272 × (60/49.6)^0.7 ≈ 0.20 */
--primary-500: oklch(49.6% 0.272 303.89); /* Base color */
--primary-600: oklch(42% 0.26 303.89); /* 0.272 × (42/49.6)^0.7 ≈ 0.26 */
--primary-700: oklch(35% 0.22 303.89); /* 0.272 × (35/49.6)^0.7 ≈ 0.22 */
--primary-800: oklch(28% 0.18 303.89); /* 0.272 × (28/49.6)^0.7 ≈ 0.18 */
--primary-900: oklch(20% 0.14 303.89); /* 0.272 × (20/49.6)^0.7 ≈ 0.14 */
--primary-950: oklch(12% 0.08 303.89); /* 0.272 × (12/49.6)^0.7 ≈ 0.08 */
```

### Considerations

- **Hue Stability:** Keep hue constant for brand consistency
- **Perceptual Uniformity:** OKLCH ensures equal perceptual steps
- **Practical Range:** Avoid extreme chroma values that can't be achieved

---

## STEP 3: Create Neutral Scale

### What

Generate grayscale colors using your primary hue with very low chroma for backgrounds, borders, and text.

### How

1. Use primary hue for subtle brand association
2. Apply very low chroma (0.005-0.03)
3. Use standard lightness progression

### Why

Neutral scales provide essential UI infrastructure while maintaining subtle brand connection through hue. Pure grays can feel disconnected from brand colors.

### Method and Formula

**Hue:** Keep your primary hue (303.89°)
**Chroma:** Very low (0.005-0.03) for near-grayscale
**Lightness:** Standard scale values

```css
--neutral-50: oklch(98% 0.005 303.89);
--neutral-100: oklch(95% 0.008 303.89);
--neutral-200: oklch(88% 0.012 303.89);
--neutral-300: oklch(78% 0.018 303.89);
--neutral-400: oklch(65% 0.022 303.89);
--neutral-500: oklch(52% 0.025 303.89);
--neutral-600: oklch(42% 0.022 303.89);
--neutral-700: oklch(32% 0.018 303.89);
--neutral-800: oklch(22% 0.012 303.89);
--neutral-900: oklch(15% 0.008 303.89);
--neutral-950: oklch(8% 0.005 303.89);
```

### Considerations

- **Chroma Range:** 0.005-0.03 provides subtle warmth without being colorful
- **Hue Consistency:** Using primary hue creates cohesive system
- **Lightness Values:** Match common design system expectations

---

## STEP 3.5: Define Base Colors

### What

Establish the fundamental background colors for your design system - the main canvas colors that set the foundation for light and dark modes.

### How

1. Choose pure or near-pure white for light mode base
2. Choose pure or near-pure black for dark mode base
3. Create intermediate base shades for layered surfaces
4. Ensure sufficient contrast with text colors

### Why

Base colors are the foundation of your visual hierarchy. They establish the "home base" that all other colors are built upon and ensure readability across different contexts.

### Step 3.5A: Light Mode Base Colors

**Primary Base (Background):** Pure white or slightly off-white
**Secondary Base (Surface):** Very light neutral for cards, modals, etc.
**Tertiary Base (Elevated):** Slightly darker for layered elements

```css
/* Light mode base colors */
--base-100: oklch(100% 0 360); /* Pure white - main background */
--base-95: oklch(98% 0.005 303.89); /* Very light neutral - cards, popovers */
--base-90: oklch(96% 0.008 303.89); /* Light neutral - elevated surfaces */
--base-85: oklch(94% 0.01 303.89); /* Medium-light - tooltips, dropdowns */
```

**Rationale:**

- **Pure White (100% L):** Maximum brightness, ensures content stands out
- **Subtle Chroma:** Uses your primary hue for brand cohesion
- **Progressive Scale:** Each level provides clear visual hierarchy

### Step 3.5B: Dark Mode Base Colors

**Primary Base (Background):** Pure black or slightly off-black
**Secondary Base (Surface):** Very dark neutral for cards, modals
**Tertiary Base (Elevated):** Slightly lighter for layered elements

```css
/* Dark mode base colors */
--base-0: oklch(0% 0 360); /* Pure black - main background */
--base-5: oklch(2% 0.005 303.89); /* Very dark neutral - cards, popovers */
--base-10: oklch(4% 0.008 303.89); /* Dark neutral - elevated surfaces */
--base-15: oklch(6% 0.01 303.89); /* Medium-dark - tooltips, dropdowns */
```

**Rationale:**

- **Pure Black (0% L):** Maximum darkness, ensures content visibility
- **Consistent Chroma:** Matches light mode approach
- **Accessibility:** Provides sufficient contrast for text (typically 4.5:1 minimum)

### Step 3.5C: Base Color Selection Guidelines

**Light Mode Base Selection:**

```javascript
// For light mode, choose based on brand personality
const lightModeBaseOptions = {
  pure: { lightness: 100, chroma: 0, hue: 360 }, // Pure white
  warm: { lightness: 99, chroma: 0.002, hue: 45 }, // Warm white
  cool: { lightness: 99, chroma: 0.002, hue: 240 }, // Cool white
  branded: { lightness: 98, chroma: 0.005, hue: primaryHue }, // Subtle brand tint
};
```

**Dark Mode Base Selection:**

```javascript
// For dark mode, choose based on content and accessibility
const darkModeBaseOptions = {
  pure: { lightness: 0, chroma: 0, hue: 360 }, // Pure black
  elevated: { lightness: 3, chroma: 0.003, hue: primaryHue }, // Slightly elevated
  neutral: { lightness: 5, chroma: 0.005, hue: 240 }, // Neutral dark
  warm: { lightness: 4, chroma: 0.004, hue: 25 }, // Warm dark
};
```

### Step 3.5D: Contrast Validation

**Text on Base Colors:**

```css
/* Light mode text colors */
--base-100-content: oklch(15% 0.008 303.89); /* Dark text on white */
--base-95-content: oklch(18% 0.01 303.89); /* Dark text on light surface */

/* Dark mode text colors */
--base-0-content: oklch(92% 0.004 303.89); /* Light text on black */
--base-5-content: oklch(88% 0.006 303.89); /* Light text on dark surface */
```

**Contrast Requirements:**

- **Normal Text:** ≥ 4.5:1 (WCAG AA)
- **Large Text:** ≥ 3:1 (WCAG AA)
- **Interactive Elements:** ≥ 3:1

### Step 3.5E: Integration with Neutral Scale

**Relationship to Neutrals:**

```css
/* Base colors complement neutral scale */
--neutral-50: oklch(98% 0.005 303.89); /* Similar to --base-95 */
--neutral-950: oklch(8% 0.005 303.89); /* Similar to --base-5 */

/* Use cases */
--base-100:
  Main application background --neutral-50: Card backgrounds,
  subtle fills --neutral-950: Dark mode main background --base-5: Dark mode card backgrounds;
```

### Considerations

- **Brand Consistency:** Use primary hue for subtle brand association
- **Accessibility First:** Ensure all text combinations meet contrast requirements
- **Progressive Hierarchy:** Each base level should provide clear visual separation
- **Cross-Mode Consistency:** Light and dark bases should feel like complementary pairs

---

## STEP 4: Generate Semantic Colors

### What

Create success, warning, error, and info colors using color theory relationships while matching your primary's personality.

### How

1. Choose hue families using color theory
2. Apply hue-specific constraints
3. Match personality metrics within constraints

### Why

Semantic colors need to convey meaning while feeling cohesive with your brand. Direct hue rotation fails because each hue has different optimal ranges and perceptual properties.

### Step 5A: Choose Hue Families

**Color Theory Relationships:**

- **Success:** Complementary (opposite) or green family (~140°)
- **Warning:** Triadic or yellow-orange family (~70°)
- **Error:** Red family (~25°)
- **Info:** Blue family (~240°)

### Step 5B: Apply Hue Constraints

**Why:** Each hue has different perceptual characteristics and optimal ranges.

```javascript
const hueOptimalRanges = {
  140: { lightness: [45, 70], chroma: [0.12, 0.2] }, // Green - flexible
  70: { lightness: [60, 80], chroma: [0.1, 0.18] }, // Yellow - needs higher L
  25: { lightness: [50, 70], chroma: [0.18, 0.25] }, // Red - can be saturated
  240: { lightness: [40, 65], chroma: [0.15, 0.22] }, // Blue - can go darker
};
```

### Step 5C: Match Target Personality

**Target Metrics:** Match your primary's weight (~13.71) and energy (~0.271)

**Process:**

1. Start with constraint midpoints
2. Calculate current weight: `(100 - L) × C`
3. Adjust L/C to approach target weight
4. Stay within hue constraints

```javascript
function matchPersonality(hue, constraints, targetWeight) {
  // Start with middle of constraint ranges
  let L = (constraints.lightness[0] + constraints.lightness[1]) / 2;
  let C = (constraints.chroma[0] + constraints.chroma[1]) / 2;

  // Calculate current weight
  const currentWeight = (100 - L) * C;

  // Adjust to match target
  if (currentWeight < targetWeight) {
    if (C < constraints.chroma[1]) {
      C = Math.min(constraints.chroma[1], targetWeight / (100 - L));
    } else {
      L = Math.max(constraints.lightness[0], 100 - targetWeight / C);
    }
  }

  return { L, C, hue };
}
```

### Step 5D: Results and Foreground Colors

```css
/* Personality-matched semantic colors */
--success: oklch(52% 0.18 140); /* Weight: 8.64, Energy: 0.184 */
--warning: oklch(65% 0.16 70); /* Weight: 5.6, Energy: 0.183 */
--error: oklch(58% 0.22 25); /* Weight: 9.24, Energy: 0.237 */
--info: oklch(50% 0.19 240); /* Weight: 9.5, Energy: 0.19 */

/* Foreground colors - ensure 4.5:1 contrast minimum */
--success-foreground: oklch(25% 0.08 140);
--warning-foreground: oklch(25% 0.08 70);
--error-foreground: oklch(98% 0.02 25);
--info-foreground: oklch(98% 0.02 240);
```

### Considerations

- **Personality Matching:** Ensures semantic colors feel equally important
- **Hue Optimization:** Respects each color's natural limitations
- **Contrast Requirements:** Foreground colors must meet WCAG AA standards

---

## STEP 5: Generate Interactive States

### What

Create hover, active, and disabled states for all colors using systematic lightness and chroma adjustments.

### How

1. Apply consistent formulas to all colors
2. Test visual feedback clarity
3. Ensure accessibility compliance

### Why

Interactive states provide clear user feedback. Systematic generation ensures consistency across all UI elements.

### Formulas

**Hover:** Base lightness - 7.6%
**Active:** Base lightness - 12.6%
**Disabled:** Chroma ÷ 2, Lightness toward 60%

### Applied Examples

```css
/* Primary interactive states */
--primary-hover: oklch(42% 0.26 303.89); /* 49.6 - 7.6 = 42 */
--primary-active: oklch(37% 0.24 303.89); /* 49.6 - 12.6 = 37 */
--primary-disabled: oklch(60% 0.136 303.89); /* C/2 = 0.136, L toward 60 */

/* Apply to semantic colors */
--success-hover: oklch(44.4% 0.17 140); /* 52 - 7.6 = 44.4 */
--warning-hover: oklch(57.4% 0.15 70); /* 65 - 7.6 = 57.4 */
--error-hover: oklch(50.4% 0.21 25); /* 58 - 7.6 = 50.4 */
--info-hover: oklch(42.4% 0.18 240); /* 50 - 7.6 = 42.4 */
```

### Considerations

- **Consistency:** Same formulas applied to all colors
- **Visual Clarity:** States should be clearly distinguishable
- **Accessibility:** Ensure sufficient contrast in all states

---

## STEP 6: Validation & Testing

### What

Verify accessibility, consistency, and usability of the generated palette.

### How

1. Test contrast ratios
2. Check color blindness compatibility
3. Validate across light/dark modes
4. Assess visual consistency

### Why

Ensures the palette works for all users and maintains design integrity across different contexts.

### Step 6A: Contrast Validation

**Requirements:**

- Text on backgrounds: ≥ 4.5:1 (WCAG AA)
- Interactive elements: ≥ 3:1

**Tools:** WebAIM Contrast Checker, browser dev tools

### Step 6B: Accessibility Testing

**Color Blindness:** Test with Sim Daltonism, Color Oracle
**Print Compatibility:** Convert to grayscale
**Dark Mode:** Verify all combinations

### Step 6C: Consistency Check

**Questions to Answer:**

- Do semantic colors feel equally important?
- Do interactive states provide clear feedback?
- Does the palette work across different contexts?

### Considerations

- **Comprehensive Testing:** Cover all use cases
- **User-Centric:** Consider various user needs
- **Iterative Refinement:** Adjust based on test results

---

## STEP 7: Design System Mapping

### What

Map generated colors to design system structures for shadcn/ui, DaisyUI, and custom systems.

### How

1. Identify semantic roles
2. Map colors to system variables
3. Create light/dark mode variants

### Why

Enables seamless integration with existing design systems and frameworks.

### For shadcn/ui Structure

```css
:root {
  --radius: 0.65rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.15 0.008 303.89);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0.008 303.89);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0.008 303.89);
  --primary: oklch(0.42 0.242 303.89);
  --primary-foreground: oklch(0.98 0.005 303.89);
  --secondary: oklch(0.95 0.008 303.89);
  --secondary-foreground: oklch(0.22 0.012 303.89);
  --muted: oklch(0.95 0.008 303.89);
  --muted-foreground: oklch(0.65 0.022 303.89);
  --accent: oklch(0.95 0.008 303.89);
  --accent-foreground: oklch(0.22 0.012 303.89);
  --destructive: oklch(0.5 0.203 25);
  --border: oklch(0.88 0.012 303.89);
  --input: oklch(0.88 0.012 303.89);
  --ring: oklch(0.42 0.242 303.89);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.15 0.008 303.89);
  --sidebar-primary: oklch(0.42 0.242 303.89);
  --sidebar-primary-foreground: oklch(0.98 0.005 303.89);
  --sidebar-accent: oklch(0.95 0.008 303.89);
  --sidebar-accent-foreground: oklch(0.22 0.012 303.89);
  --sidebar-border: oklch(0.88 0.012 303.89);
  --sidebar-ring: oklch(0.42 0.242 303.89);
  --chart-1: oklch(0.72 0.18 333.89);
  --chart-2: oklch(0.72 0.176 33.89);
  --chart-3: oklch(0.72 0.179 123.89);
  --chart-4: oklch(0.72 0.126 213.89);
  --chart-5: oklch(0.72 0.146 273.89);
}

.dark {
  --background: oklch(0.15 0.008 303.89);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.22 0.012 303.89);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.22 0.012 303.89);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.496 0.272 303.89);
  --primary-foreground: oklch(0.7 0.12 303.89);
  --secondary: oklch(0.32 0.018 303.89);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.32 0.018 303.89);
  --muted-foreground: oklch(0.65 0.022 303.89);
  --accent: oklch(0.32 0.018 303.89);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.5 0.203 25);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.7 0.12 303.89);
  --chart-1: oklch(0.72 0.18 333.89);
  --chart-2: oklch(0.72 0.176 33.89);
  --chart-3: oklch(0.72 0.179 123.89);
  --chart-4: oklch(0.72 0.126 213.89);
  --chart-5: oklch(0.72 0.146 273.89);
  --sidebar: oklch(0.22 0.012 303.89);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.496 0.272 303.89);
  --sidebar-primary-foreground: oklch(0.7 0.12 303.89);
  --sidebar-accent: oklch(0.32 0.018 303.89);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.7 0.12 303.89);
}
```

### Tailwind v4 Theme Structure

```css
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--color-base-100);
  --color-foreground: var(--color-base-900-foreground);
  --color-card: var(--color-base-200);
  --color-card-foreground: var(--color-base-900-foreground);
  --color-popover: var(--color-base-200);
  --color-popover-foreground: var(--color-base-900-foreground);
  --color-primary: var(--color-primary-500);
  --color-primary-foreground: var(--color-primary-500-foreground);
  --color-secondary: var(--color-neutral-200);
  --color-secondary-foreground: var(--color-neutral-50-foreground);
  --color-muted: var(--color-base-300);
  --color-muted-foreground: var(--color-base-900-foreground);
  --color-accent: var(--color-primary-300);
  --color-accent-foreground: var(--color-primary-900-foreground);
  --color-destructive: var(--color-error);
  --color-border: var(--color-base-400);
  --color-input: var(--color-base-200);
  --color-ring: var(--color-primary-400);
  --color-chart-1: var(--color-chart-1);
  --color-chart-2: var(--color-chart-2);
  --color-chart-3: var(--color-chart-3);
  --color-chart-4: var(--color-chart-4);
  --color-chart-5: var(--color-chart-5);
}

:root {
  --color-base-50: oklch(1 0 0);
  --color-base-50-foreground: oklch(0.15 0.02 0);
  --color-base-100: oklch(0.99 0.001 174.9);
  --color-base-100-foreground: oklch(0.15 0.02 174.9);
  --color-base-200: oklch(0.98 0.002 174.9);
  --color-base-200-foreground: oklch(0.15 0.02 174.9);
  --color-base-300: oklch(0.97 0.004 174.9);
  --color-base-300-foreground: oklch(0.15 0.02 174.9);
  --color-base-400: oklch(0.94 0.006 174.9);
  --color-base-400-foreground: oklch(0.15 0.02 174.9);
  --color-base-500: oklch(0.5 0 0);
  --color-base-500-foreground: oklch(0.98 0.01 0);
  --color-base-600: oklch(0.4 0.005 174.9);
  --color-base-600-foreground: oklch(0.98 0.01 174.9);
  --color-base-700: oklch(0.3 0.004 174.9);
  --color-base-700-foreground: oklch(0.98 0.01 174.9);
  --color-base-800: oklch(0.2 0.003 174.9);
  --color-base-800-foreground: oklch(0.98 0.01 174.9);
  --color-base-900: oklch(0.1 0.002 174.9);
  --color-base-900-foreground: oklch(0.98 0.01 174.9);
  --color-base-950: oklch(0.05 0.001 174.9);
  --color-base-950-foreground: oklch(0.98 0.01 174.9);
  --color-primary-50: oklch(0.978 0.05 174.9);
  --color-primary-50-foreground: oklch(0.15 0.02 174.9);
  --color-primary-100: oklch(0.928 0.05 174.9);
  --color-primary-100-foreground: oklch(0.15 0.02 174.9);
  --color-primary-200: oklch(0.828 0.08 174.9);
  --color-primary-200-foreground: oklch(0.15 0.02 174.9);
  --color-primary-300: oklch(0.728 0.12 174.9);
  --color-primary-300-foreground: oklch(0.15 0.02 174.9);
  --color-primary-400: oklch(0.628 0.2 174.9);
  --color-primary-400-foreground: oklch(0.15 0.02 174.9);
  --color-primary-500: oklch(0.524 0.272 174.9);
  --color-primary-500-foreground: oklch(0.98 0.01 174.9);
  --color-primary-600: oklch(0.448 0.244 174.9);
  --color-primary-600-foreground: oklch(0.98 0.01 174.9);
  --color-primary-700: oklch(0.378 0.216 174.9);
  --color-primary-700-foreground: oklch(0.98 0.01 174.9);
  --color-primary-800: oklch(0.308 0.188 174.9);
  --color-primary-800-foreground: oklch(0.98 0.01 174.9);
  --color-primary-900: oklch(0.228 0.14 174.9);
  --color-primary-900-foreground: oklch(0.98 0.01 174.9);
  --color-primary-950: oklch(0.148 0.08 174.9);
  --color-primary-950-foreground: oklch(0.98 0.01 174.9);
  --color-neutral-50: oklch(0.98 0.005 174.9);
  --color-neutral-50-foreground: oklch(0.15 0.02 174.9);
  --color-neutral-100: oklch(0.95 0.008 174.9);
  --color-neutral-100-foreground: oklch(0.15 0.02 174.9);
  --color-neutral-200: oklch(0.88 0.012 174.9);
  --color-neutral-200-foreground: oklch(0.15 0.02 174.9);
  --color-neutral-300: oklch(0.78 0.018 174.9);
  --color-neutral-300-foreground: oklch(0.15 0.02 174.9);
  --color-neutral-400: oklch(0.65 0.022 174.9);
  --color-neutral-400-foreground: oklch(0.15 0.02 174.9);
  --color-neutral-500: oklch(0.52 0.025 174.9);
  --color-neutral-500-foreground: oklch(0.98 0.01 174.9);
  --color-neutral-600: oklch(0.42 0.022 174.9);
  --color-neutral-600-foreground: oklch(0.98 0.01 174.9);
  --color-neutral-700: oklch(0.32 0.018 174.9);
  --color-neutral-700-foreground: oklch(0.98 0.01 174.9);
  --color-neutral-800: oklch(0.22 0.012 174.9);
  --color-neutral-800-foreground: oklch(0.98 0.01 174.9);
  --color-neutral-900: oklch(0.15 0.008 174.9);
  --color-neutral-900-foreground: oklch(0.98 0.01 174.9);
  --color-neutral-950: oklch(0.08 0.005 174.9);
  --color-neutral-950-foreground: oklch(0.98 0.01 174.9);
  --color-success: oklch(0.45 0.145 140);
  --color-success-foreground: oklch(0.98 0.01 140);
  --color-warning: oklch(0.65 0.141 70);
  --color-warning-foreground: oklch(0.15 0.02 70);
  --color-error: oklch(0.525 0.213 25);
  --color-error-foreground: oklch(0.98 0.01 25);
  --color-info: oklch(0.45 0.103 240);
  --color-info-foreground: oklch(0.98 0.01 240);
  --color-chart-1: oklch(0.72 0.123 204.9);
  --color-chart-1-foreground: oklch(0.15 0.02 204.9);
  --color-chart-2: oklch(0.72 0.145 264.9);
  --color-chart-2-foreground: oklch(0.15 0.02 264.9);
  --color-chart-3: oklch(0.72 0.18 354.9);
  --color-chart-3-foreground: oklch(0.15 0.02 354.9);
  --color-chart-4: oklch(0.72 0.148 84.9);
  --color-chart-4-foreground: oklch(0.15 0.02 84.9);
  --color-chart-5: oklch(0.72 0.18 144.9);
  --color-chart-5-foreground: oklch(0.15 0.02 144.9);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### For DaisyUI Structure

```css
@plugin "daisyui/theme" {
  name: "light";
  default: true;
  prefersdark: true;
  color-scheme: "dark";
  --color-base-50: oklch(1 0 0);
  --color-base-100: oklch(0.99 0.001 174.9);
  --color-base-200: oklch(0.98 0.002 174.9);
  --color-base-300: oklch(0.97 0.004 174.9);
  --color-base-content: oklch(0.98 0.01 174.9);
  --color-primary: oklch(0.524 0.272 174.9);
  --color-primary-content: oklch(0.98 0.01 174.9);
  --color-secondary: oklch(0.88 0.012 174.9);
  --color-secondary-content: oklch(0.98 0.005 174.9);
  --color-accent: oklch(0.728 0.12 174.9);
  --color-accent-content: oklch(0.228 0.14 174.9);
  --color-neutral: oklch(0.52 0.025 174.9);
  --color-neutral-content: oklch(0.98 0.005 174.9);
  --color-info: oklch(0.45 0.103 240);
  --color-info-content: oklch(0.98 0.01 240);
  --color-success: oklch(0.45 0.145 140);
  --color-success-content: oklch(0.98 0.01 140);
  --color-warning: oklch(0.65 0.141 70);
  --color-warning-content: oklch(0.15 0.02 70);
  --color-error: oklch(0.525 0.213 25);
  --color-error-content: oklch(0.98 0.01 25);
  --radius-selector: 0.5rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}

@plugin "daisyui/theme" {
  name: "dark";
  default: false;
  prefersdark: false;
  color-scheme: "dark";
  --color-base-50: oklch(1 0 0);
  --color-base-100: oklch(0.1 0.002 174.9);
  --color-base-200: oklch(0.2 0.003 174.9);
  --color-base-300: oklch(0.3 0.004 174.9);
  --color-base-content: oklch(0.15 0.02 174.9);
  --color-primary: oklch(0.524 0.272 174.9);
  --color-primary-content: oklch(0.98 0.01 174.9);
  --color-secondary: oklch(0.42 0.022 174.9);
  --color-secondary-content: oklch(0.95 0.008 174.9);
  --color-accent: oklch(0.728 0.12 174.9);
  --color-accent-content: oklch(0.228 0.14 174.9);
  --color-neutral: oklch(0.52 0.025 174.9);
  --color-neutral-content: oklch(0.98 0.005 174.9);
  --color-info: oklch(0.45 0.103 240);
  --color-info-content: oklch(0.98 0.01 240);
  --color-success: oklch(0.45 0.145 140);
  --color-success-content: oklch(0.98 0.01 140);
  --color-warning: oklch(0.65 0.141 70);
  --color-warning-content: oklch(0.15 0.02 70);
  --color-error: oklch(0.525 0.213 25);
  --color-error-content: oklch(0.98 0.01 25);
  --radius-selector: 0.5rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}
```

### Considerations

- **Semantic Mapping:** Match color roles to system expectations
- **Light/Dark Modes:** Provide complete variants
- **Extensibility:** Support for additional system variables

## Implementation Details

### Exporter Classes

The color palette generator includes three specialized exporters:

#### ShadcnExporter

- **Location:** `src/features/design-system-export/lib/shadcn-exporter.ts`
- **Purpose:** Generates CSS variables compatible with shadcn/ui components
- **Features:**
  - Light and dark mode variants
  - Sidebar color support
  - Chart color generation
  - Tailwind v4 theme mapping

#### DaisyUIExporter

- **Location:** `src/features/design-system-export/lib/daisyui-exporter.ts`
- **Purpose:** Creates DaisyUI theme definitions
- **Features:**
  - Separate light and dark theme plugins
  - Complete semantic color mapping
  - DaisyUI-specific variable naming

#### TailwindV4Exporter

- **Location:** `src/features/design-system-export/lib/tailwind-v4-exporter.ts`
- **Purpose:** Generates comprehensive Tailwind v4 theme configuration
- **Features:**
  - Inline theme definition
  - All color scales with foreground variants
  - Base layer styling

### Usage Example

```typescript
import { ShadcnExporter } from "@/features/design-system-export/lib/shadcn-exporter";
import { DaisyUIExporter } from "@/features/design-system-export/lib/daisyui-exporter";
import { TailwindV4Exporter } from "@/features/design-system-export/lib/tailwind-v4-exporter";

// Generate palette (from your palette generation logic)
const palette = generatePalette(baseColor);

// Export to different formats
const shadcnCSS = ShadcnExporter.generateTailwindV4CSS(palette);
const daisyUIThemes = DaisyUIExporter.generateDaisyUIThemes(palette);
const tailwindV4CSS = TailwindV4Exporter.generateTailwindV4CSS(palette);
```

### Integration Steps

1. **Generate your palette** using the OKLCH methodology described above
2. **Choose your target system** (shadcn/ui, DaisyUI, or Tailwind v4)
3. **Use the appropriate exporter** to generate CSS variables
4. **Apply the generated CSS** to your project
5. **Test accessibility** and visual consistency across light/dark modes

### Common Issues & Solutions

- **Foreground colors not contrasting:** Ensure all foreground colors meet WCAG AA standards
- **Missing semantic colors:** Verify your palette generation includes all required semantic colors
- **Chart colors too similar:** The chart color generation uses hue offsets to ensure distinct colors
- **Base colors not working:** Make sure your base scale includes both light and dark variants
- **Invalid OKLCH values:** Check that your primary color is a valid OKLCH string format
- **Build errors:** Ensure all dependencies are installed and TypeScript types are correct

### Testing Your Implementation

1. **Visual Testing:** Check colors in both light and dark modes
2. **Accessibility Testing:** Use tools like WAVE or axe to verify contrast ratios
3. **Cross-browser Testing:** Test in multiple browsers for color consistency
4. **Performance Testing:** Ensure CSS variables don't impact rendering performance

### Advanced Customization

- **Custom Hue Constraints:** Modify `SEMANTIC_HUE_CONSTRAINTS` for brand-specific colors
- **Lightness Progression:** Adjust `PRIMARY_COLORS_LIGHTNESS_PROGRESSION_MAP` for different scales
- **Chroma Adjustments:** Fine-tune chroma formulas for specific use cases
- **Foreground Calculation:** Customize contrast ratio requirements (default: 4.5:1)

1. **Analyze base color** → Extract L/C/H + calculate personality metrics
2. **Generate tonal scale** → Mathematical lightness progression + chroma adjustment formula
3. **Create neutrals** → Desaturated primary hue with low chroma
4. **Make semantic colors** → Hue constraints + personality weight matching
5. **Add interactive states** → Systematic lightness/chroma shifts
6. **Validate accessibility** → Contrast ratios + color-blind compatibility
7. **Map to design system** → Semantic role assignment

**This system works for any starting color** - plug in your base L/C/H values and follow the formulas for consistent, accessible, and perceptually uniform color palettes.
