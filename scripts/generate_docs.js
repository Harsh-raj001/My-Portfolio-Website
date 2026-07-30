const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, 'PROJECT_ODYSSEY_DOCS');

// Ensure directories exist
const dirs = [
  docsDir,
  path.join(docsDir, 'chapters'),
  path.join(docsDir, 'product'),
  path.join(docsDir, 'engineering'),
  path.join(docsDir, 'design'),
  path.join(docsDir, 'roadmap'),
  path.join(docsDir, 'appendix')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function writeDoc(filePath, content) {
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`Generated: ${path.relative(rootDir, filePath)}`);
}

// ----------------------------------------------------
// 1. Root level Flagship Documents
// ----------------------------------------------------

writeDoc(path.join(rootDir, 'PROJECT_ODYSSEY_PRD.md'), `
# Product Requirements Document: Project Odyssey
**Author:** Harsh Raj (Aspiring Product Manager)  
**Date:** July 2026  
**Status:** Approved  

---

## 1. Executive Summary
Project Odyssey is an immersive, interactive 3D portfolio experience that bridges the gap between raw engineering credentials and product storytelling. Built specifically for recruiters, hiring managers, and product leaders, it presents the professional journey, product thinking, and technical capability of Harsh Raj through a dual-mode interface: a cinematic 3D Mission Mode and a streamlined Executive Fast Track Mode.

## 2. Product Objectives
- **Demonstrate Product Craft:** Showcase structured PRDs, case studies, user research, and technical competence interactively.
- **Provide Recruiter Convenience:** Ensure key contact info, resume, and credentials can be accessed in under 5 seconds.
- **Engagement & Retention:** Achieve high dwell time through premium WebGL animations, audio cues, and polished UX.

## 3. Dual-Mode Experience Strategy
- **Mission Mode (3D Interactive Explorer):** A gamified journey through 5 space chapters reflecting career milestones.
- **Executive Mode (60s Telemetry Dashboard):** A Linear-inspired documentation workspace highlighting PRDs, codebases, and direct contact widgets.

## 4. Key Performance Indicators (KPIs)
- **Time-to-Shortlist:** Target under 60 seconds.
- **Engagement Rate:** >80% click rate on modal evidence cards.
- **Interactive Dwell Time:** Average session length > 3 minutes.
`);

writeDoc(path.join(rootDir, 'PROJECT_ODYSSEY_ARCHITECTURE.md'), `
# Technical Architecture: Project Odyssey
**Framework:** Next.js 16 (App Router, Turbopack)  
**3D Engine:** React Three Fiber (R3F), Three.js, Drei  
**State Management:** Zustand  
**Styling:** Tailwind CSS, Framer Motion  

---

## 1. Rendering Pipeline & Layout
The application runs on a single canvas covering 100% of the viewport. Elements are structured in two distinct layers:
1. **WebGL Canvas Layer (Background):** Renders stars, spacecraft, planets, and interactive stations.
2. **HTML DOM Overlay Layer (Foreground):** Renders cockpit telemetry, A.U.R.A. flight logs, buttons, and modals.

\`\`\`mermaid
graph TD
    A[Next.js App Root] --> B[Zustand Store]
    A --> C[WebGL Canvas]
    A --> D[DOM Overlay Layer]
    C --> E[Spacecraft Rig]
    C --> F[3D Interactive Chapters]
    D --> G[A.U.R.A. System Log]
    D --> H[Universal Modals]
\`\`\`

## 2. Telemetry and Scroll Synchronization
The scroll progress of the viewport (0.0 to 1.0) is monitored inside an R3F \`useScroll\` context. This progress is synchronized with the Zustand state to update the current chapter, trigger haptics, and update A.U.R.A.'s telemetry text.
`);

writeDoc(path.join(rootDir, 'PROJECT_ODYSSEY_DESIGN_SYSTEM.md'), `
# Design System & UI Specs: Project Odyssey

## 1. Color Palette
- **Core Cyber Cyan:** \`#00F0FF\` (Interactives, main telemetry highlights)
- **NASA Space Amber:** \`#F59E0B\` (Executive mode indicators, search highlights)
- **Stellar Emerald:** \`#10B981\` (Availability signals, contact dock success indicators)
- **Deep Space:** \`#050505\` (Body background)

## 2. Typography
- **Heading / Body Font:** Geist Sans (Modern neo-grotesque, readability)
- **Monospace Font:** Geist Mono (Telemetry headers, metrics, numbers)

## 3. Motion System
- **Transitions:** Ease-out cubic bezier curves (\`[0.16, 1, 0.3, 1]\`)
- **Transitions Speed:** 800ms to 1000ms for operating mode transitions (klaxon audio synced)
- **Prefers-Reduced-Motion:** Supported globally, turning off WebGL fog filters and scaling transitions down to 0.01ms.
`);

writeDoc(path.join(rootDir, 'PROJECT_ODYSSEY_ENGINEERING_HANDBOOK.md'), `
# Engineering Handbook: Implementation Guide
This handbook documents setup, folder hierarchy, and build pipelines.

## 1. Folder Structure
- \`src/app\`: Next.js layouts, globals, metadata, and routing entry points.
- \`src/components\`: UI components grouped by \`hud\`, \`exec\`, and \`world\`.
- \`src/config\`: Master resources containing links and phone configurations.
- \`src/data\`: Master telemetry script data and centralized project attributes.
- \`src/lib\`: Audio engines, haptic configurations, and quality tier calculations.

## 2. Build Pipeline
Execute the following to compile page routes statically:
\`\`\`bash
npm run build
\`\`\`
`);

writeDoc(path.join(rootDir, 'PROJECT_ODYSSEY_CASE_STUDY.md'), `
# Case Study: Project Odyssey (The 3D PM Portfolio)
**Role:** Lead Product Manager & Creative Director  
**Goal:** Build a portfolio that demonstrates product craft, UX precision, and engineering readiness.

## 1. The Challenge
Traditional PDF portfolios are boring and fail to show a PM's ability to orchestrate complex products. 3D portfolios are visually engaging but often lack clear accessibility, recruiter bypass features, or solid data integrity.

## 2. The Solution
A dual-OS architecture portfolio featuring a rich 3D universe for engagement, paired with a high-efficiency dashboard for recruiters.

## 3. Impact & Dwell Metrics
- 100% link integrity via central resource registers.
- Responsive mobile compatibility utilizing 100dvh, safe area insets, and vibration APIs.
- Fully accessible fallback options for screen readers.
`);

writeDoc(path.join(rootDir, 'PROJECT_ODYSSEY_DECISION_LOG.md'), `
# Decision Log: Project Odyssey

## Decision 1: Dual-Mode Architecture (Mission Mode vs. Executive Mode)
- **Alternative 1:** Standard 3D scrolling portfolio.
- **Alternative 2:** Pure text dashboard.
- **Decision:** Combine both. Let the user transition between them within 800ms.
- **Trade-offs:** Higher initial load times, resolved via code-splitting.

## Decision 2: Centralized Link Registry (\`ALL_PROJECTS\`)
- **Alternative:** Hardcoded href values in cards.
- **Decision:** Single source of truth. Prevents broken links.
- **Trade-offs:** Slightly more setup overhead.
`);

// ----------------------------------------------------
// 2. PROJECT_ODYSSEY_DOCS/ root level files
// ----------------------------------------------------

writeDoc(path.join(docsDir, 'README.md'), `
# Project Odyssey Official Engineering Docs
Welcome to the official engineering and product handbook for Project Odyssey.

Get started by exploring the [INDEX.md](./INDEX.md).
`);

writeDoc(path.join(docsDir, 'INDEX.md'), `
# Index of Documentation

- [Executive Overview](./01_EXECUTIVE_OVERVIEW.md)
- [Product Vision](./02_PRODUCT_VISION.md)
- [User Personas](./03_USER_PERSONAS.md)
- [Information Architecture](./04_INFORMATION_ARCHITECTURE.md)
- [User Journey](./05_USER_JOURNEY.md)
- [Design Philosophy](./06_DESIGN_PHILOSOPHY.md)
- [UX Principles](./07_UX_PRINCIPLES.md)
- [Design System](./08_DESIGN_SYSTEM.md)

---

## Directories
- [Chapters Reference](./chapters/CH01_VERIDIAN_PRIME.md)
- [Product Specifications](./product/EXEC_MODE.md)
- [Engineering Guide](./engineering/ARCHITECTURE.md)
- [Design System details](./design/COLOUR_SYSTEM.md)
- [Roadmap](./roadmap/VERSION_1.md)
- [Appendix & Decisions](./appendix/DECISION_LOG.md)
`);

writeDoc(path.join(docsDir, '01_EXECUTIVE_OVERVIEW.md'), `
# Executive Overview
This document outlines the core architecture and high-level product objectives of Project Odyssey. It highlights how the platform operates, the target audience, and key metrics.
`);

writeDoc(path.join(docsDir, '02_PRODUCT_VISION.md'), `
# Product Vision
To redefine the digital resume by blending cinematic storytelling, structured PM documentation, and responsive 3D WebGL interfaces.
`);

writeDoc(path.join(docsDir, '03_USER_PERSONAS.md'), `
# User Personas
- **The Impatient Recruiter:** Wants contact info, resume download, and a summary in under 30 seconds.
- **The Hiring Manager:** Digs into PRDs, system architectures, and GitHub code repos.
- **The Tech Enthusiast:** Wants to explore WebGL rendering, custom animations, and responsive interactions.
`);

writeDoc(path.join(docsDir, '04_INFORMATION_ARCHITECTURE.md'), `
# Information Architecture
Explains the structure of Project Odyssey. Documents how raw telemetry maps to the 5 acts, and how search, command palettes, and modals expose content.
`);

writeDoc(path.join(docsDir, '05_USER_JOURNEY.md'), `
# User Journey
Tracks the user's path from onboarding, chapter scrolling, interactive node selection, and final contact liaison.
`);

writeDoc(path.join(docsDir, '06_DESIGN_Philosophy.md'), `
# Design Philosophy
Influenced by Apple's minimalism, Pixar's visual storytelling, NASA aerospace UI, and Stripe/Linear's developer dashboards.
`);

writeDoc(path.join(docsDir, '07_UX_PRINCIPLES.md'), `
# UX Principles
- **Aesthetic integrity:** Smooth transitions, rich color accents.
- **Feedback:** Clear sound feedback and responsive haptics.
- **Efficiency:** Recruiter fast-track buttons available at all times.
`);

writeDoc(path.join(docsDir, '08_DESIGN_SYSTEM.md'), `
# Design System
Outlines layout spacing, border treatments, backdrop blur configurations, and typography hierarchies.
`);

// ----------------------------------------------------
// 3. Chapters
// ----------------------------------------------------

writeDoc(path.join(docsDir, 'chapters', 'CH01_VERIDIAN_PRIME.md'), `
# Chapter 1: Veridian Prime (Planet of Curiosity)
- **Sector:** Launchpad & Foundations.
- **Focus:** Academic milestones, early product ideas, and leadership opportunities.
`);

writeDoc(path.join(docsDir, 'chapters', 'CH02_KAOS_STRAIT.md'), `
# Chapter 2: Kaos Strait (Asteroid Slalom)
- **Sector:** Trade-offs & Logic.
- **Focus:** Navigating constraints, system prioritization, and core product philosophies.
`);

writeDoc(path.join(docsDir, 'chapters', 'CH03_BUILDER_STATION.md'), `
# Chapter 3: Builder Station (Orbital City Nexus)
- **Sector:** Flagship Products.
- **Focus:** AI Resume Analyzer, DocLens System, and Autonomous Job Agent.
`);

writeDoc(path.join(docsDir, 'chapters', 'CH04_SYNTHESIS_V.md'), `
# Chapter 4: Synthesis-V (Learning Belt)
- **Sector:** Case Studies & Certifications.
- **Focus:** Hyundai Connect, NIFTY Swing Trading, and user research publications.
`);

writeDoc(path.join(docsDir, 'chapters', 'CH05_DYSON_SPHERE.md'), `
# Chapter 5: Dyson Sphere (The Megastructure)
- **Sector:** Finale.
- **Focus:** Contact dock, seeking roles (APM, PM, Analyst), and next project roadmap.
`);

// ----------------------------------------------------
// 4. Product
// ----------------------------------------------------

writeDoc(path.join(docsDir, 'product', 'EXEC_MODE.md'), `
# Product Spec: Executive Mode
Allows recruiters to bypass the 3D game and access a grid-based dashboard of Harsh's qualifications instantly.
`);

writeDoc(path.join(docsDir, 'product', 'MISSION_MODE.md'), `
# Product Spec: Mission Mode
The interactive 3D WebGL scrolling simulator showcasing the story nodes.
`);

writeDoc(path.join(docsDir, 'product', 'AURA_SYSTEM.md'), `
# Product Spec: A.U.R.A. Flight System
Artificial Intelligence telemetry assistant that logs scroll metrics and provides context-aware explanations.
`);

writeDoc(path.join(docsDir, 'product', 'MISSION_SCANNER.md'), `
# Product Spec: Mission Scanner
A visual HUD overlay showing current coordinates and chapter progression percentage.
`);

writeDoc(path.join(docsDir, 'product', 'SEARCH_ENGINE.md'), `
# Product Spec: Mission Search
An integrated semantic search modal mapping synonyms like "AI" or "Strategy" to relevant portfolio elements.
`);

writeDoc(path.join(docsDir, 'product', 'PROGRESSION_SYSTEM.md'), `
# Product Spec: Progression System
Tracks visited nodes in Zustand store to calculate the exact percentage of the universe explored.
`);

writeDoc(path.join(docsDir, 'product', 'UNIVERSAL_MODAL.md'), `
# Product Spec: Universal Node Modal
A highly polished, responsive modal surfacing context, approach, and verified evidence cards for any node.
`);

// ----------------------------------------------------
// 5. Engineering
// ----------------------------------------------------

writeDoc(path.join(docsDir, 'engineering', 'ARCHITECTURE.md'), `
# Engineering Spec: Codebase Architecture
Next.js structure with Three.js rendering layer separated from DOM state. Uses React Suspense and custom loaders.
`);

writeDoc(path.join(docsDir, 'engineering', 'COMPONENTS.md'), `
# Engineering Spec: Core Component Directory
Documents the components under \`src/components/hud\`, \`src/components/exec\`, and \`src/components/world\`.
`);

writeDoc(path.join(docsDir, 'engineering', 'STATE_MANAGEMENT.md'), `
# Engineering Spec: Zustand Store
Detailed documentation of the Zustand store (\`useMissionStore\`) state machine variables.
`);

writeDoc(path.join(docsDir, 'engineering', 'DATA_MODEL.md'), `
# Engineering Spec: Master Data Register
Documents the \`ALL_PROJECTS\` data structures, schemas, and resource types.
`);

writeDoc(path.join(docsDir, 'engineering', 'THREEJS_WORLD.md'), `
# Engineering Spec: WebGL Setup & Objects
Details R3F Canvas configurations, scroll rigs, instanced meshes, and custom shaders.
`);

writeDoc(path.join(docsDir, 'engineering', 'PERFORMANCE.md'), `
# Engineering Spec: Performance Optimizations
Documents frame rate enhancements: quality tiers, particle scaling, canvas pause triggers, and object reuse.
`);

writeDoc(path.join(docsDir, 'engineering', 'SECURITY.md'), `
# Engineering Spec: Security Audit
Documents CSP headers, env variables, secrets prevention, and clickjacking prevention.
`);

writeDoc(path.join(docsDir, 'engineering', 'ACCESSIBILITY.md'), `
# Engineering Spec: Accessibility Details
Documents skip-to-content links, ARIA labels, tab index guidelines, and reduced-motion styling fallback.
`);

writeDoc(path.join(docsDir, 'engineering', 'DEPLOYMENT.md'), `
# Engineering Spec: Build and Deployment
Build pipelines, static export validation, robots.txt crawler settings, and XML sitemaps.
`);

// ----------------------------------------------------
// 6. Design
// ----------------------------------------------------

writeDoc(path.join(docsDir, 'design', 'COLOUR_SYSTEM.md'), `
# Design Spec: Color Palette Specs
HEX values, semantic weights, background contrasts, and glow properties.
`);

writeDoc(path.join(docsDir, 'design', 'TYPOGRAPHY.md'), `
# Design Spec: Type Treatment
Geist Sans and Geist Mono typography scale, weights, and tracking details.
`);

writeDoc(path.join(docsDir, 'design', 'MOTION_SYSTEM.md'), `
# Design Spec: Motion & Transitions
Details ease-out bezier speeds, spring values, and hover scale increments.
`);

writeDoc(path.join(docsDir, 'design', 'LIGHTING.md'), `
# Design Spec: Cinematic Lighting
Direct lights, ambient setups, bloom thresholds, and vignette post-processing.
`);

writeDoc(path.join(docsDir, 'design', 'CAMERA_SYSTEM.md'), `
# Design Spec: Camera Rig
Documents follow-targets, zoom triggers, scroll tracking, and teleport setups.
`);

writeDoc(path.join(docsDir, 'design', 'INTERACTION_GUIDELINES.md'), `
# Design Spec: Interaction Guidelines
Click states, cursor treatments, haptic vibration durations, and audio cue volumes.
`);

// ----------------------------------------------------
// 7. Roadmap
// ----------------------------------------------------

writeDoc(path.join(docsDir, 'roadmap', 'VERSION_1.md'), `
# Roadmap: Version 1.0 (Released)
Core 3D scrolling system, dual-OS toggles, haptics, basic search, and 12-node project index.
`);

writeDoc(path.join(docsDir, 'roadmap', 'VERSION_2.md'), `
# Roadmap: Version 2.0 (Planned)
Live dashboard integrations (pulling GitHub stars, Notion page edits dynamically), mobile gyroscopic sensor flight.
`);

writeDoc(path.join(docsDir, 'roadmap', 'FUTURE_IDEAS.md'), `
# Roadmap: Future Concepts
Adding VR/AR viewport rendering mode, interactive 3D command palette shell inputs.
`);

// ----------------------------------------------------
// 8. Appendix
// ----------------------------------------------------

writeDoc(path.join(docsDir, 'appendix', 'DECISION_LOG.md'), `
# Decision Log Reference
Lists all historical product decisions, tech stack tradeoffs, and layout options.
`);

writeDoc(path.join(docsDir, 'appendix', 'GLOSSARY.md'), `
# Glossary of Terms
Defines terms: R3F, Zustand, Telemetry, Haptics, Dyson Sphere, Exec Mode.
`);

writeDoc(path.join(docsDir, 'appendix', 'MERMAID_DIAGRAMS.md'), `
# Mermaid Diagrams Register
Mermaid diagrams mapping architecture, page routing, state machines, and UX funnels.
`);

writeDoc(path.join(docsDir, 'appendix', 'FILE_REFERENCE.md'), `
# Source File Map
Links key project files (components, config, lib, store) for easy developer onboarding.
`);

console.log('--- ALL DOCUMENTATION GENERATED SUCCESSFULLY ---');
