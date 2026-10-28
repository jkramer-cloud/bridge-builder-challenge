# Bridge Builder Challenge v4.1 — Engineering Check

An offline-friendly browser engineering challenge for the Naches Learning Hub. Students design, test, analyze, and revise bridges through **48 missions**. Uses HTML, CSS and JavaScript only; no API key, server, or student login.

## What's new in v4.1

- **One-screen workshop layout** on desktop and reduced scrolling on smaller screens. The coach, predictions, and mission picker remain accessible in a right-side panel at desktop widths.
- **Select beam** tool: click a beam to inspect its material, approximate tension/compression role, span and estimated demand; click it again, the Deselect control, or Escape to clear selection. Selected beams can be changed to the currently selected material or removed.
- **Material deselection:** click an active material a second time or use **Deselect material**. A material must be selected to place or repaint structural members.
- **No automatic reinforcement shortcut:** *Highlight weakest span* now outlines the estimated problem area but never builds for the student. Students decide what and where to reinforce, including doubling or tripling braces if budget permits.
- **Post-test force diagram:** a visual illustration shows T (tension/pulling), C (compression/pushing), estimated span demand percentages, and the weakest span. Colors are green/cyan for tension, gold for compression, red for a likely issue.
- **One short engineering question after each test** is chosen from the student's actual design: e.g. missing braces, cables or chains under compression, concrete under tension, buckling, self-weight, or overall failure margin. Answer choices shuffle. One attempt is required before continuing; incorrect attempts give an explanation and still allow progress. Correct attempts earn that mission's Engineering badge.
- The older optional general-purpose Engineering Lab question is still available under **Additional practice question**. A prediction before testing is still optional.

## How to play

1. Choose Triangle helper or Draw beam and select Wood, Steel, Cable, Concrete, Chain, or Aluminum. Concrete unlocks at mission 5; overhead construction at mission 9.
2. Select roadway spans or beam joints to make a truss. Use **Select beam** to inspect/edit a specific member. Repeated supports are allowed, with tradeoffs in weight, cost, material performance and diminishing load-path efficiency.
3. Optionally predict whether the bridge passes, then select **Test crossing**.
4. Watch the vehicle cross or the bridge collapse. An **Engineering Check** report opens with a force diagram and a question tied to the actual test.
5. Choose an answer and read the explanation; on a pass, continue to the next mission. On a failure, return to building and revise.

## Material behaviors

| Material | Relative behavior | Tradeoff |
|---|---|---|
| Wood | Moderate tension and compression | Inexpensive, can buckle |
| Steel | Strong in tension and compression | More expensive, heavier |
| Cable | Strong in tension | Nearly no compression resistance |
| Concrete | Strong in compression | Weak in tension, very heavy |
| Chain | Strong in tension | Links go slack under compression |
| Aluminum | Good tension, moderate compression | Light, prone to buckling when long |

**Important:** This is an educational force-path approximation, **not a validated structural analysis or real-world engineering safety tool**. T/C roles and stress percentages are qualitative teaching estimates, not measured forces or finite-element results.

## Deploy to GitHub Pages

Upload `index.html`, `styles.css`, and `game.js` to the root of the existing `bridge-builder-challenge` repository, replacing the old files. Commit. Your existing Learning Hub link can remain unchanged. `README.md` and `CHANGELOG.md` are optional documentation updates.

The game saves drafts, completed missions and stars in the same browser `localStorage` key (`naches_bridge_builder_v2`). Existing bridges may need revision under the newer v4 force rules.

## Classroom notes

- Have students describe one evidence-based design change after a failed test.
- Compare what happens when using cable in a compression member versus steel or concrete.
- The weakest-span highlight is a **diagnostic**, not a one-click answer.
- Even when they initially answer a question incorrectly, students receive an explanation and can move forward; the aim is engineering reasoning rather than penalizing mistakes.
- On small screens, the report window scrolls independently, so the whole diagram and question remain available.
