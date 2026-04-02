---
estimated_steps: 4
estimated_files: 4
skills_used: []
---

# T02: Fix theme colors in 4 three.js/WebGL charts

Fix 4 three.js/WebGL chart components. These use react-three-fiber or raw three.js where CSS vars aren't directly accessible from the WebGL context.

Approach: Read CSS vars via getComputedStyle on a DOM ref, then pass the resolved color strings to three.js materials/lights.

Files: customer-network-3d.tsx (2), globe-chart.tsx (2), investor-network-3d.tsx (3), network-graph-3d.tsx (6)

If the hardcoded colors are used in three.js Color() constructors, resolve the CSS var first via JS and pass the hex result.

## Inputs

- `S01/S02-T01 pattern`
- `three.js Color class reference`

## Expected Output

- `4 3D chart files updated`

## Verification

npm run build passes. grep audit shows reduced hardcoded dark-theme colors in 3D files.
