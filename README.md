# Bridge Builder Challenge — Version 2.0

An original interactive engineering puzzle for the **Naches Learning Hub**. Students construct braced bridges, test them under increasingly demanding vehicle loads, study approximate stress, and revise their designs. Built with standard HTML, CSS, JavaScript, and SVG; no third-party packages or external services are required.

## Play the game

Publish the repository as GitHub Pages, then open:

`https://jkramer-cloud.github.io/bridge-builder-challenge/`

For local use, open `index.html` in a browser with its accompanying `styles.css` and `game.js` files.

## V2 improvements

- Rebuilt construction interface with **Triangle helper**, **Draw beam**, and **Erase** tools, and clearly numbered roadway panels.
- 12 vehicle-themed levels: bicycle, compact car, pickup, delivery van, camper, school bus, semi truck, fire engine, dump truck, crane truck, tank, and train.
- Illustrated 2D vehicles, scenic mountainous background, and larger interactive targets.
- Visibly animated load transfer, colored span stress, deck bowing, and animated collapses.
- A **Build Coach** identifies the weakest span and offers a one-click reinforcement option.
- Material and budget decisions: wood, steel, and cable.
- Undo and Reset Design controls.
- Previous successful tests no longer carry over after any change; the **Next mission** button is enabled only after the test vehicle reaches the far bank and the current bridge fully passes.
- Saved level unlocks, high scores, and construction drafts in browser local storage.
- Responsive mobile layout and optional synthesized sound effects.

## Instructions for students

1. **Start with Triangle helper.** Click a numbered span to place a supporting triangle. Repeat across the roadway.
2. **Choose wood, steel, or cable.** Steel carries more weight but costs more.
3. Optionally use **Draw beam**. Click one joint and then another; you may also drag between joints or click below the bridge to create a new joint.
4. Press **Test crossing** and watch how the deck reacts to the moving vehicle.
5. If your bridge fails, inspect the highlighted weak span. Change the materials or bracing, and test again.
6. Finish an entire crossing to unlock the next vehicle mission.

Completed missions can be replayed. The game tracks up to three stars per mission based on reserve strength and remaining budget.

## Publishing or upgrading on GitHub

Replace the repository's `index.html` and add/replace `styles.css`, `game.js`, and `README.md` from this package. Enable **Settings → Pages → Deploy from a branch → main / root** if not already enabled.

V2 imports the existing V1 unlocked-level and best-star record when it first runs in the same browser profile and at the same site address. It uses a new save key for V2 designs; users should not rely on browser storage as permanent records. Saved scores are local to the browser profile, not synchronized through Google accounts.

## Teacher notes

The bridge model is **a simplified, deterministic educational approximation**. It illustrates useful principles such as triangulation, uniform support, material choice, testing, cost, and iteration, but is not a finite-element structural solver, engineering calculation, construction specification, or safety-certified bridge model. Vehicle masses and bridge budgets are scaled for gameplay.

Suggested discussions: Which spans had the highest stress? Why did supporting only the middle fail? Why might steel be worth paying for? What changed after reinforcement? What is the trade-off between structural strength and cost?

## Files

- `index.html` — accessible page structure and controls
- `styles.css` — responsive styling
- `game.js` — construction tools, tests, progression, and graphics
- `README.md` — these instructions

No personal identifiers or student accounts are collected by the game.
