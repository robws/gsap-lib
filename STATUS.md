# gsap-lib Development Status

**Version:** 0.1.1-alpha1  
**Last Updated:** November 12, 2025  
**Repository:** Separate git repository within gsap-work workspace

## Purpose

A shared function library for abstracting GSAP animations to be used across multiple demo projects in the `gsap/` folder.

## Git History

```
b054999 (HEAD -> main, tag: 0.1.1-alpha1) prettier formatting and updated lib ready for release
46ae08a (tag: 0.1.0-alpha.1) initial commit
6483eef Initial commit
```

## Current Contents

### File Structure
```
gsap-lib/
├── README.md (minimal - only project title)
└── js/
    └── general-utils.js (242 lines)
```

## Exported Functions (10 total)

### 1. SVG & DOM Loading
- **`loadSVG(url, target, x, y, callback)`** - Fetches and inserts SVG, positions with GSAP

### 2. Animation Helpers
- **`spinTheThings(timeline, duration)`** - Rotates all `.spinnable` class elements
- **`openDoorLeft(timeline, doorId)`** - Animates door opening from left pivot
- **`moveAlong(timeline, elementId, pathId, position, repeat)`** - Moves element along SVG path
- **`moveOnPath(timeline, id, path, duration, startWithPrevious)`** - Motion path animation

### 3. Timing Utilities
- **`startWithPrevious(secondsOffset)`** - Returns `"<"` or `"<{offset}"` for timeline positioning
- **`startAfterPrevious(secondsOffset)`** - Returns `"+=0"` or `"+={offset}"` for timeline positioning

### 4. View Manipulation
- **`bringToFront(elementId)`** - Re-appends element to bring to front in DOM
- **`switchLights(lights, timeline, delay)`** - Sequentially changes light colors
- **`zoomTo(timeline, id, viewBoxParams)`** - Animates SVG viewBox for zoom effect

## Exported Constants & Enums (4 total)

### `TransformOrigin` (Enum)
Descriptive keywords for transform origins (9 positions):
- topLeft, topCenter, topRight
- centerLeft, center, centerRight  
- bottomLeft, bottomCenter, bottomRight

Values are percentage-based strings (e.g., `"50% 50%"`)

### `PositionReference` (Enum)
Array-based positions for `MotionPathPlugin.getRelativePosition()` (11 positions):
- centerTop, centerBottom, centerCenter
- topLeft, topCenter, topRight
- centerLeft, centerRight
- bottomLeft, bottomCenter, bottomRight

Values are `[x, y]` progress arrays (e.g., `[0.5, 0.5]`)

### Helper Functions
- **`make(identifier)`** - Shorthand for `document.querySelector('#' + id)`
- **`makeAll(selector)`** - Shorthand for `querySelectorAll`

## Design Patterns

### Timeline-First Approach
Most functions take a GSAP timeline as the first parameter and add animations to it:
```javascript
function myAnimation(timeline, element, duration) {
    timeline.to(element, { ... });
}
```

### Optional Positioning
Functions support optional timeline positioning for insertion control:
```javascript
moveAlong(timeline, '#ball', '#path', startWithPrevious(0.5), 2);
```

## Dependencies

- **GSAP Core** (gsap.min.js from CDN)
- **MotionPathPlugin** (for path-based animations)
- **Browser Fetch API** (for loadSVG)

## Known Issues

1. **No module exports** - Functions are global, not ES6 modules
2. **Minimal documentation** - README is just a title
3. **Limited JSDoc** - Some functions have incomplete documentation
4. **No build process** - Raw JavaScript file, no bundling
5. **No tests** - No test suite or examples

## Release Strategy

Based on git tags:
- Alpha releases (0.1.x-alpha)
- Appears to be manually versioned
- Referenced in parent `gsap/README.md` as latest release

## Integration Points

Functions from this library are intended to be copied into `gsap/demos/js/lib.js` for use in demos. See `INTEGRATION-STATUS.md` for synchronization tracking.
