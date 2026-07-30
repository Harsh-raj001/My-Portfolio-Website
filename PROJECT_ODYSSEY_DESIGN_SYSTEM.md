# Design System & UI Specs: Project Odyssey

## 1. Color Palette
- **Core Cyber Cyan:** `#00F0FF` (Interactives, main telemetry highlights)
- **NASA Space Amber:** `#F59E0B` (Executive mode indicators, search highlights)
- **Stellar Emerald:** `#10B981` (Availability signals, contact dock success indicators)
- **Deep Space:** `#050505` (Body background)

## 2. Typography
- **Heading / Body Font:** Geist Sans (Modern neo-grotesque, readability)
- **Monospace Font:** Geist Mono (Telemetry headers, metrics, numbers)

## 3. Motion System
- **Transitions:** Ease-out cubic bezier curves (`[0.16, 1, 0.3, 1]`)
- **Transitions Speed:** 800ms to 1000ms for operating mode transitions (klaxon audio synced)
- **Prefers-Reduced-Motion:** Supported globally, turning off WebGL fog filters and scaling transitions down to 0.01ms.
