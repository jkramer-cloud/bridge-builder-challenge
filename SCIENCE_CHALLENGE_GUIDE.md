# Bridge Builder v4.3 — Engineering Challenge Guide

## Why the checkpoint changed

Earlier builds asked one of twelve repeated questions, and an incorrect answer still allowed advancement. In v4.3, completing the vehicle crossing is only the **first** requirement. To unlock the next mission, students must also answer an engineering science question correctly. Free, optional hints support calculations without giving away the answer immediately.

## Student workflow

1. Build a bridge with connected support members, and optionally predict whether it will pass.
2. Run the crossing. Inspect the diagram, especially the weakest span and modeled tension/compression members.
3. If the bridge fails, diagnose the weak span and revise the structure. These failure-analysis questions are practice and do **not** cause an additional rollback.
4. If it passes, solve the **Engineering Check**. The question may require entering a number (including the requested unit) or choosing the best science explanation.
5. Use **Show a hint** to see up to two reasoning steps, free of penalty. The explanation after submission shows the method and final answer.

### Consequences on a passing bridge test

| Result | What happens |
| --- | --- |
| Correct answer | The next vehicle mission unlocks (after a fully completed crossing). |
| Incorrect answer, levels 1–16 | Return one mission. |
| Incorrect answer, levels 17–48 | Return two missions. |
| Skip, levels 1–16 | Return two missions. |
| Skip, levels 17–32 | Return three missions. |
| Skip, levels 33–48 | Return four missions. |
| Wrong or skipped at level 1 | No lower level exists; the learner must solve a different question before advancing. |

Previously earned stars and historical unlocked-level records are retained. During recovery, higher missions are **temporarily unavailable** in both the level grid and the vehicle gallery. Students restore their previous access after passing the bridge and a new engineering question for each of the 1–4 lost missions. Replaying an old mission does not force re-clearing every later historical unlock.

## Topics in the rotating challenge bank

Twenty question families, with level-based parameters and rotating reattempts, cover: reading peak stress and percent margins; interpreting model data; adding masses; force and acceleration (F = ma); weight and gravity; speed (distance / time); pressure (force / area); work (force × displacement); moments (force × perpendicular distance); load sharing; cost arithmetic; triangle counts; tension; compression; buckling; fatigue and repeated loading; moving vs permanent loads; scour and foundation stability; structural load cases; and cable design.

A 24-prompt optional Engineering Lab is also available separately for extra practice. Some engineering concepts recur as retrieval practice across the 48 missions, but questions change numerically or contextually and failed attempts rotate to another family.

## Example guided problem

> Your bridge reached 83% of its estimated capacity. How many percentage points remain before 100%?

Hint 1: Find the difference between the maximum (100%) and the reading.

Hint 2: Subtract the stress percentage from 100.

Solution after submission: 100 − 83 = 17 percentage points. The percentage is from the game's simplified force model, not a certified safety factor.

## Classroom use / technical considerations

- Recommended for middle-school engineering and physical science practice; the question bank includes scaffolded arithmetic and conceptual explanations.
- No timer penalizes slower readers; questions cannot be dismissed without an answer or an explicit skip consequence.
- Historical progress from v4.2 migrates automatically. Current recovery restrictions are stored in the browser profile with the existing save key `naches_bridge_builder_v2`.
- School devices with shared browser profiles also share mission and science progress. The application does not use school accounts, a backend, or a teacher gradebook.
- The game is a **simplified teaching simulation**, not finite-element engineering analysis. Simulated stress percentages and material properties are comparative estimates. Physics calculations in questions are explicitly given illustrated conditions and units, not derived real-world load ratings for the displayed vehicles.
- Students can always use hints without losing levels. A wrong answer results in an instructional explanation and a recovery route, rather than hiding the solution.
