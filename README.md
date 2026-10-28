# Bridge Builder Challenge — Version 3.0

An interactive engineering and reasoning game for the Naches Learning Hub. Build a bridge, test vehicles, study estimated stress and deflection, then revise the design. Designed for grades 5–8, with no AI service, paid APIs, or external game libraries.

## What's new in v3.0

- **48 missions**, up from 12, grouped into eight six-mission environments with distinct colors and escalating loads, spans, and budgets.
- **Concrete material** (unlocked at mission 5) alongside wood, steel, and cable. Concrete is modeled as useful in compression and adds self-weight; cables are more effective in tension. Costs vary by member length.
- **Upper truss construction** (unlocked at mission 9). Use the Above Roadway / Below Roadway controls with Triangle Helper, or use Draw Beam for custom geometry. Upper truss members are rendered *in front of* the vehicle, making the vehicle visible behind the framing.
- **Engineering Lab** with an optional prediction before each test and a short multiple-choice math, science, or engineering reasoning question. Students earn saved badges for correct answers; the lab never blocks mission progression.
- **Revised teaching model for stress:** load is concentrated near the moving vehicle, with more demand at central spans, triangular reinforcement, member strength, and added weight from concrete. Colors and animated deck sagging are approximate.
- **Preserves browser progress** from Bridge Builder v2 (unlocked missions, stars, and compatible saved bridge drafts).

## How to play

1. Choose **Triangle Helper** and click the numbered roadway panels. Each click builds a triangular support using your selected material, if it fits within the budget.
2. Early missions support building **below** the road. On mission 9, **Above Roadway** becomes available. The Draw Beam and Erase tools allow custom supports.
3. Compare material prices and the estimated weakest span. A single unsupported panel can cause failure, even if other panels are reinforced.
4. In the optional **Engineering Lab**, predict whether the bridge will pass, and answer a short question for a learning badge.
5. Press **Test Crossing**. The vehicle must reach the **far bank** before the next mission unlocks. Failed tests show a collapse and a weak span for redesign.
6. Replay, improve the design, and work toward more stars by spending less and keeping estimated utilization lower.

## GitHub Pages

Create or use an existing GitHub repository, for example `bridge-builder-challenge`. Upload `index.html`, `styles.css`, and `game.js` to the repository root. In **Settings → Pages**, publish `main` / `(root)`.

The game also comes as a standalone HTML file containing the same CSS and JavaScript inline, for offline browser use. To update an existing repository, replace those three source files. The Learning Hub launch link will stay the same if you keep the repository name.

## About the physics

**This is an educational approximation, not a structural analysis tool.** The game does not perform finite-element analysis, engineering code checks, buckling calculations, detailed axle loading, or real-world material design. The metric called “stress” represents an illustrative **load-to-estimated-capacity ratio** in each roadway panel. It is useful for observing patterns and consequences, but results must not be used to design real bridges.

## Privacy and accessibility

Everything runs locally in the browser. Progress and earned badges use browser localStorage. No students' names, accounts, or personal data are required. The design adapts to narrower screens, and buttons support keyboard focus. Drawing the bridge is easiest with mouse, touch, or a touchscreen/stylus.

## Credits

Prepared for the Naches Learning Hub. Includes student-requested concrete, overhead materials, and a larger level campaign.
