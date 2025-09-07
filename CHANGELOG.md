# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Enhanced color normalization and chart color generation in ShadcnExporter
- Added chartScale property to Palette interface
- Enhanced neutral color generation and added chart scale method in palette generation
- Added charts colors display to PaletteDisplay component
- Defined lightness progression maps for primary and neutral colors
- Added default tonal and neutral scales to error handling in palette generation
- Added culori library for color manipulation and enhanced color generation methods
- Implemented ExportPanel component for CSS and Tailwind config export
- Added ColorInput component for primary color selection with presets
- Implemented color palette generation with hue, lightness, and WCAG constraints
- Added head component with metadata and Open Graph tags
- Enhanced global styles and updated TypeScript configuration

### Changed

- Renamed getAllMethods to generatePalette and updated return type to Palette
- Updated palette store to use signals and enhanced palette generation logic
- Renamed PaletteMethod interface to Palette for clarity
- Replaced LIGHTNESS_PROGRESSION with specific primary and neutral color progression maps in palette generation
- Removed unused GenerationOptions and GenerationResult interfaces in palette.ts
- Removed useSignal from ColorInput component and directly use primaryColorSignal
- Restructured index.astro to remove Welcome component and enhance layout for PaletteGeneratorApp
- Removed welcome component and associated assets
- Restructured project components and layouts

### Fixed

- Updated CSS generation to use Tailwind V4 method in ExportPanel component
- Ensured default percentage display for color values in PaletteDisplay component
- Replaced @radix-ui/react-slot with @preact/signals-react in package.json and pnpm-lock.yaml
- Corrected indentation and formatting in astro.config.mjs
- Corrected import path for Head component in main-layout.astro
- Updated dependencies in package.json for consistency
- Updated formatting and syntax across multiple files for consistency
- Corrected syntax for import statements in welcome.astro
- Corrected syntax and import global CSS in main layout
- Added missing path mapping for styles in tsconfig

### Chore

- Added global CSS file to import Tailwind CSS styles
- Initial commit from Astro
