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

## STEP 4: Generate Semantic Colors

### What

Create success, warning, error, and info colors using color theory relationships while matching your primary's personality.

### How

1. Choose hue families using color theory
2. Apply hue-specific constraints
3. Match personality metrics within constraints

### Why

Semantic colors need to convey meaning while feeling cohesive with your brand. Direct hue rotation fails because each hue has different optimal ranges and perceptual properties.

### Step 4A: Choose Hue Families

**Color Theory Relationships:**

- **Success:** Complementary (opposite) or green family (~140°)
- **Warning:** Triadic or yellow-orange family (~70°)
- **Error:** Red family (~25°)
- **Info:** Blue family (~240°)

### Step 4B: Apply Hue Constraints

**Why:** Each hue has different perceptual characteristics and optimal ranges.

```javascript
const hueOptimalRanges = {
  140: { lightness: [45, 70], chroma: [0.12, 0.2] }, // Green - flexible
  70: { lightness: [60, 80], chroma: [0.1, 0.18] }, // Yellow - needs higher L
  25: { lightness: [50, 70], chroma: [0.18, 0.25] }, // Red - can be saturated
  240: { lightness: [40, 65], chroma: [0.15, 0.22] }, // Blue - can go darker
};
```

### Step 4C: Match Target Personality

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

### Step 4D: Results and Foreground Colors

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
  /* Core system colors */
  --background: oklch(100% 0 360);
  --foreground: var(--neutral-900);

  /* Surface colors */
  --card: var(--neutral-50);
  --card-foreground: var(--neutral-900);
  --popover: var(--neutral-50);
  --popover-foreground: var(--neutral-900);

  /* Primary brand colors */
  --primary: var(--primary-500);
  --primary-foreground: var(--primary-50);

  /* Secondary/muted colors */
  --secondary: var(--neutral-200);
  --secondary-foreground: var(--neutral-800);
  --muted: var(--neutral-200);
  --muted-foreground: var(--neutral-600);

  /* Accent colors */
  --accent: var(--neutral-200);
  --accent-foreground: var(--neutral-800);

  /* Semantic colors */
  --destructive: var(--error);
  --destructive-foreground: var(--error-foreground);

  /* UI elements */
  --border: var(--neutral-300);
  --input: var(--neutral-300);
  --ring: var(--primary-500);

  /* Radius */
  --radius: 0.5rem;
}

/* Dark mode variants */
@media (prefers-color-scheme: dark) {
  :root {
    --background: var(--neutral-950);
    --foreground: var(--neutral-50);
    --card: var(--neutral-900);
    --card-foreground: var(--neutral-50);
    --secondary: var(--neutral-800);
    --secondary-foreground: var(--neutral-200);
    --muted: var(--neutral-800);
    --muted-foreground: var(--neutral-400);
    --accent: var(--neutral-800);
    --accent-foreground: var(--neutral-200);
    --border: var(--neutral-700);
    --input: var(--neutral-700);
  }
}
```

### For DaisyUI Structure

```css
:root {
  --primary: var(--primary-500);
  --primary-focus: var(--primary-hover);
  --primary-content: var(--primary-foreground);

  --secondary: var(--info);
  --secondary-focus: var(--info-hover);
  --secondary-content: var(--info-foreground);

  --accent: oklch(65% 0.18 50);
  --accent-focus: oklch(57.4% 0.17 50);
  --accent-content: oklch(25% 0.08 50);

  --neutral: var(--neutral-500);
  --neutral-focus: var(--neutral-600);
  --neutral-content: var(--neutral-50);

  --base-100: var(--neutral-50);
  --base-200: var(--neutral-100);
  --base-300: var(--neutral-200);
  --base-content: var(--neutral-900);

  --info: var(--info);
  --info-content: var(--info-foreground);

  --success: var(--success);
  --success-content: var(--success-foreground);

  --warning: var(--warning);
  --warning-content: var(--warning-foreground);

  --error: var(--error);
  --error-content: var(--error-foreground);
}
```

### Considerations

- **Semantic Mapping:** Match color roles to system expectations
- **Light/Dark Modes:** Provide complete variants
- **Extensibility:** Support for additional system variables

---

## Complete Workflow Summary

1. **Analyze base color** → Extract L/C/H + calculate personality metrics
2. **Generate tonal scale** → Mathematical lightness progression + chroma adjustment formula
3. **Create neutrals** → Desaturated primary hue with low chroma
4. **Make semantic colors** → Hue constraints + personality weight matching
5. **Add interactive states** → Systematic lightness/chroma shifts
6. **Validate accessibility** → Contrast ratios + color-blind compatibility
7. **Map to design system** → Semantic role assignment

**This system works for any starting color** - plug in your base L/C/H values and follow the formulas for consistent, accessible, and perceptually uniform color palettes.
