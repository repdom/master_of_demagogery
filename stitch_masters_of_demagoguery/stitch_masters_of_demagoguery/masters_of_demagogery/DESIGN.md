---
name: Masters of Demagogery
colors:
  surface: '#14130f'
  surface-dim: '#14130f'
  surface-bright: '#3b3934'
  surface-container-lowest: '#0f0e0a'
  surface-container-low: '#1d1c17'
  surface-container: '#21201b'
  surface-container-high: '#2b2a25'
  surface-container-highest: '#36352f'
  on-surface: '#e7e2da'
  on-surface-variant: '#c4c6cc'
  inverse-surface: '#e7e2da'
  inverse-on-surface: '#32302b'
  outline: '#8e9196'
  outline-variant: '#44474c'
  surface-tint: '#bac7dd'
  primary: '#bac7dd'
  on-primary: '#243142'
  primary-container: '#1b2838'
  on-primary-container: '#828fa3'
  inverse-primary: '#525f71'
  secondary: '#b7c8e0'
  on-secondary: '#213144'
  secondary-container: '#38485c'
  on-secondary-container: '#a6b6ce'
  tertiary: '#eec058'
  on-tertiary: '#402d00'
  tertiary-container: '#342500'
  on-tertiary-container: '#b18825'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3f9'
  primary-fixed-dim: '#bac7dd'
  on-primary-fixed: '#0f1c2c'
  on-primary-fixed-variant: '#3b4859'
  secondary-fixed: '#d3e4fd'
  secondary-fixed-dim: '#b7c8e0'
  on-secondary-fixed: '#0b1c2e'
  on-secondary-fixed-variant: '#38485c'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#eec058'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#14130f'
  on-background: '#e7e2da'
  surface-variant: '#36352f'
  status-red: '#C0392B'
  status-green: '#27AE60'
  status-yellow: '#F39C12'
  bias-left: '#3498DB'
  bias-center-left: '#85C1E9'
  bias-center: '#95A5A6'
  bias-center-right: '#E8A0A0'
  bias-right: '#E74C3C'
  bias-populist: '#8E44AD'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
spacing:
  base: 4px
  tight: 8px
  compact: 12px
  standard: 16px
  gutter: 12px
  margin-mobile: 16px
  margin-desktop: 24px
---

## Brand & Style

The design system embodies a unique intersection of **Industrial Utility** and **Editorial Authority**. It is a "High-Density Newsroom" aesthetic that rejects the trend of excessive whitespace in favor of information-rich environments. The brand personality is intellectual, competitive, and uncompromisingly technical.

The design style is a hybrid of **Modern Editorial** (high-contrast serif typography and newspaper-inspired layouts) and **Brutalist Utility** (rigid grids, condensed spacing, and technical data displays). It prioritizes "Functional Density," where every pixel serves a purpose, drawing inspiration from the efficiency of industrial catalogs.

The primary experience is a dark-mode environment that feels like a high-stakes intelligence dashboard, using textures and subtle patterns to evoke the feeling of physical media being analyzed through a digital lens.

## Colors

The palette is anchored by **Navy Deep** for the primary environment and **Navy Mid** for structural layering (cards, sidebars). **Off-white** typography ensures high legibility and a classic editorial feel against the dark backgrounds.

**Gold Accent** is reserved strictly for interactive elements: primary CTAs, selection states, and achievement-related feedback. 

The **Bias Spectrum** colors are functional tokens used for data visualization and are never to be used for general UI decoration. Status colors (Red, Green, Yellow) are utilized for immediate game feedback and factuality ratings. In Light Mode (utilized only for specific "Paper" views), the background shifts to `#FAF8F5` (Paper) while maintaining the same semantic hierarchy.

## Typography

The typography system follows a clear tri-font strategy:
- **Playfair Display (Serif):** Used for headlines and section headers to establish the "Newspaper" aesthetic. It conveys authority and tradition.
- **Inter (Sans-serif):** The workhorse font for all body text, UI labels, and navigation. Chosen for its extreme legibility at small sizes and high information density.
- **JetBrains Mono (Monospace):** Used for metadata, technical stats, "Bias" labels, and DOM selectors. It injects a sense of "Data Analysis" and technical precision.

Paragraphs should utilize a traditional newspaper indentation (1rem) for long-form article text instead of vertical spacing between paragraphs to maintain density.

## Layout & Spacing

This design system uses a **Fixed Grid** model optimized for high-density information display. The layout rhythm is based on a 4px baseline, but defaults to a "compact" feel.

**Desktop/Tablet:** A split-panel view is mandatory. The left panel (approx. 280px-320px) houses the "McMaster-Carr" style taxonomy trees and instant filters. The right panel is the primary content stage. 

**Mobile:** Uses a single column with top-collapsible filter menus. Vertical spacing is minimized to ensure as much content as possible is visible above the fold.

Elements are grouped into "Tightly Bound" modules. Gutters are intentionally narrow (12px) to maximize the horizontal real estate for data columns and text.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Bold Borders** rather than traditional shadows. 

1.  **Background:** Navy Deep (`#1B2838`)
2.  **Containers:** Navy Mid (`#243447`) with a 1px solid border of either Navy Deep (for subtlety) or Gold (for interactive focus).
3.  **Active Elements:** Elements "lifted" during interaction use a subtle Gold outer glow or a transition to the "Paper" (`#FAF8F5`) surface for an editorial feel.
4.  **Overlays:** Modals and bottom sheets use a high-opacity Navy Deep background with a distinct 1px Off-white border to simulate a "sheet of paper" laid over the dashboard. 

Avoid ambient shadows; depth should feel structural and flat, like stacked sheets of architectural vellum.

## Shapes

The shape language is **Sharp (0px)**. To maintain the industrial and editorial aesthetic, there are no rounded corners on primary UI elements (buttons, cards, inputs). 

The only exception to the sharp-edge rule is the **Bias Spectrum Bar**, which may use a pill-shape (3) to distinguish it as a non-structural, data-only element. All structural components—cards, containers, and primary CTA buttons—must remain perfectly rectangular to reflect the McMaster-Carr industrial influence.

## Components

- **Buttons:** Sharp-edged, high-contrast. Primary CTAs use Gold Accent with Off-white text. Secondary buttons use Navy Mid with a 1px Gold border.
- **High-Density Cards:** No padding greater than 12px. Borders are used to separate internal data sections. They often include a "Credibility Shield" in the top-right corner.
- **Bias Spectrum Bars:** Horizontal segmented bars using the named bias colors. A vertical "marker" or needle indicates the current rating.
- **Instant Filters (McMaster-Style):** A vertical stack of collapsible accordions. Each contains a list of checkboxes or text links with a count indicator (e.g., "Politics [42]").
- **Credibility Shields:** Vector-style shield icons containing a numerical score in JetBrains Mono. Color-coded based on status (Red/Yellow/Green).
- **Input Fields:** Minimalist. Underline style only or a thin 1px border. No background fill unless focused.
- **Lists:** Table-like structures with alternating row tints (Navy Deep / Navy Mid) to ensure readability across high-density data rows.