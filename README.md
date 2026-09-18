# Grid Master by Rikki Janae

A lightweight grid generator for Figma with five modes: floor grids with one-point perspective, flat grids with auto-calculated square cells, dot grids with adjustable spacing, layout grids with gutters and margins, and diagonal grids of evenly spaced parallel lines.

All modes support math in dimension inputs, live preview, and output as fully editable Figma vectors. Built for designers who want precise grids without the hassle.

## Installation

1. Download or clone this repository
2. Open Figma (desktop app)
3. Go to **Plugins** in the top menu bar
4. Select **Development** then **Import plugin from manifest...**
5. Navigate to the downloaded folder and select the `manifest.json` file
6. The plugin will appear under **Plugins > Development > Grid Master by Rikki Janae**

To run the plugin, right-click anywhere on the canvas, go to **Plugins > Development** and select **Grid Master by Rikki Janae**.

## Grid Modes

### Floor Grid

Generates one-point perspective grids with mathematically correct foreshortening. Great for architectural layouts, environments, product mockups, and adding visual depth to compositions.

**Controls:**

- **Columns / Rows** set the number of grid divisions
- **Grid Width** (10-300%) controls how wide the grid base is relative to the canvas, including past the edges for a full-floor look
- **Width / Height** set the output frame dimensions in pixels (default 1920x1080)
- **Angle** (5-80 degrees) controls how dramatic the perspective convergence is
- **VP Offset X** shifts the vanishing point left or right for asymmetric compositions
- **Stroke** adjusts line thickness
- **Show Vanishing Point** toggles the red VP crosshair and guide lines
- **Show Border** toggles the outer border

### Flat Grid

Generates pixel-perfect square grids. Enter your frame dimensions and the plugin automatically calculates every cell size that divides evenly into both width and height. No guesswork, no leftover pixels.

**Controls:**

- **Width / Height** set the output frame dimensions
- **Cell Size** pills show all perfect square sizes that fit your dimensions. Each pill displays the cell size and resulting grid dimensions (e.g. "60px (32x18)"). Click to select
- **Stroke** adjusts line thickness
- **Opacity** controls stroke transparency
- **Show Border** toggles the outer border

### Dot Grid

Generates evenly spaced dot patterns. Useful for subtle alignment guides, notebook-style backgrounds, and minimalist design elements.

**Controls:**

- **Width / Height** set the output frame dimensions
- **Spacing** controls the distance between dots (8-200px)
- **Dot Size** adjusts the diameter of each dot (1-10px)
- **Opacity** controls dot transparency
- **Show Border** toggles an optional outline around the grid area

### Layout Grid

Generates overlapping column and row lines with adjustable gutters and margins. Lines span the full frame width and height, crossing over each other at intersections. Useful for design system scaffolding and layout planning.

**Controls:**

- **Columns / Rows** set the number of divisions
- **Width / Height** set the output frame dimensions
- **Gutter** (0-60px) controls spacing between cells
- **Margin** (0-100px) controls padding around the outer edge
- **Stroke** adjusts line thickness
- **Opacity** controls line transparency
- **Show Border** toggles the outer frame border


### Diagonal Grid

Generates evenly spaced parallel lines at an angle, cut cleanly to the frame edges. Great for hatching, shading, striped backgrounds and pattern fills.

**Controls:**

- **Width / Height** set the output frame dimensions in pixels (math supported)
- **Spacing** (8-200px) sets the distance between lines, measured square to the lines
- **Angle** (5-85 degrees) sets how steep the lines are
- **Direction** switches between rising (╱) and falling (╲) lines
- **Stroke** adjusts line thickness
- **Opacity** controls line transparency
- **Show Border** toggles the frame border

## Math in Dimension Inputs

All width and height inputs support basic math expressions. Type an expression, then press Enter or click away to evaluate.

**Examples:**

- `1920-40` evaluates to `1880`
- `1080/2` evaluates to `540`
- `(1920-40)/2` evaluates to `940`
- `16*60` evaluates to `960`

Supported operators: `+`, `-`, `*`, `/`, and parentheses.

## Output

All grids are generated as fully editable Figma vector paths or shapes inside a frame. After creation you can ungroup the frame and modify individual lines, change stroke colors, adjust weights, or restyle anything to fit your project.

## Fonts

The plugin UI uses [Geist](https://vercel.com/font) and Geist Mono. These load from Google Fonts and require an internet connection on first launch. If fonts don't load, the UI falls back to system fonts and still works fine.

## Files

```
manifest.json    Figma plugin manifest
code.js          Plugin logic (grid generation)
ui.html          Plugin interface (controls and preview)
icon.svg         Plugin icon (source)
icon.png         Plugin icon (128x128 rasterized)
```

## Credits

Vibe coded by [Rikki Janae](http://rikkijanae.com/)
