# Bridge Builder Challenge v4.3 — Engineering Clearance

This version keeps the **48 distinct increasing vehicle missions** from v4.2 and makes the Engineering Check a required learning checkpoint after every successful crossing. Questions include guided arithmetic, force and stress interpretation, material behavior, structural failures, and science scenarios.

- Correct bridge crossing **and** correct science answer are required to unlock the next mission.
- Wrong answer: recover 1–2 missions; explicit Skip: recover 2–4 missions.
- Free two-step hints and worked explanations are included.
- Failed bridge tests provide diagnostic questions without additional setback.
- Prior stars and unlocked history migrate; temporary recovery restrictions prevent jumping ahead through the fleet menu.

For full classroom rules and sample calculations, see [`SCIENCE_CHALLENGE_GUIDE.md`](SCIENCE_CHALLENGE_GUIDE.md).

---

# Bridge Builder Challenge v4.2 — The Forty-Eight-Vehicle Journey

An offline-ready structural engineering learning game for the Naches Learning Hub. Build, stress-test, analyze, and refine truss bridges across 48 increasingly difficult missions.

## v4.2 features

- **48 distinct vehicle scenarios**, not the old 12-vehicle cycle repeated four times. The weight of the next vehicle is always greater.
- Progression begins with road bicycles and electric bikes, passes through scooters, trikes, motorcycles, sports cars, pickups, buses, semis and logging trucks, and ends with transporters, aircraft loads, and NASA-inspired machinery.
- Updated original SVG vehicle art, including a vehicle illustration in each mission card and separate shapes for the larger vehicle families.
- New **Browse all 48 vehicles** dialog showing approximate crossing mass and locked/unlocked progression. Students may choose any already-unlocked level from the dialog.
- **Approximate crossing weights in pounds and metric units**, generally including riders or cargo, rather than just a vehicle's empty weight.
- References linked for specific Ford and NASA examples. Other mass values are representative educational estimates, not model-specific official weights.
- Game balance recalibrated to progress steadily while keeping the final NASA challenge solvable as a game.

## What stays the same

The bridge construction tools, wood/steel/cable/concrete/chain/aluminum materials, forces and stress indicators, bridge flexing/collapse effects, predictions, Engineering Check, and progress saving remain. Successful vehicle crossing and completing its post-test review are still necessary to advance.

## Existing progress and saves

Stars, completed/accessible levels and achievements remain in browser storage using `naches_bridge_builder_v2`. Since level vehicle assignment, budget, span and panel layout have changed, **saved drafts of individual bridges are cleared once when upgrading to v4.2** to avoid importing old incompatible structures. All future v4.2 drafts save normally.

## Load-model limitations

**The displayed weights are approximate crossing loads, not engineering-certified specifications.** The strength challenge uses a deliberately normalized progression. Real-world loading depends on wheel/axle distribution, bridge length, dynamic effects, material engineering and code requirements; real trains and crawler transporters do not drive on standard highway bridges. The visuals are playful educational illustrations, not scale models. See `VEHICLE_FIELD_GUIDE.md` for the entire fleet and sources.

## Deploy on GitHub Pages

Replace the following three files in your existing Bridge Builder repository: `index.html`, `styles.css`, `game.js`. Keep their filenames and root-folder locations. Upload `README.md`, `CHANGELOG.md`, `INSTALL.txt`, and `VEHICLE_FIELD_GUIDE.md` if you want the updated instructions and level guide online. The Learning Hub link does not change.

No external libraries, registration, assets, location access, or API keys are needed for play. The optional specification source links do use the internet when clicked.
