# Engineering Handbook: Implementation Guide
This handbook documents setup, folder hierarchy, and build pipelines.

## 1. Folder Structure
- `src/app`: Next.js layouts, globals, metadata, and routing entry points.
- `src/components`: UI components grouped by `hud`, `exec`, and `world`.
- `src/config`: Master resources containing links and phone configurations.
- `src/data`: Master telemetry script data and centralized project attributes.
- `src/lib`: Audio engines, haptic configurations, and quality tier calculations.

## 2. Build Pipeline
Execute the following to compile page routes statically:
```bash
npm run build
```
