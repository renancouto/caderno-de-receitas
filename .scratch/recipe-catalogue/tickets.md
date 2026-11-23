# Ticket dependencies

```mermaid
flowchart TD
  T1["1 · Walking skeleton<br/>one recipe, two pages, every test layer"]
  T2["2 · CI and GitHub Pages"]
  T3["3 · Complete recipe rules"]
  T4["4 · Design foundation<br/>and screenshot tests"]
  T5["5 · Recipe page, complete"]
  T6["6 · Tick-off list"]
  T7["7 · Photos"]
  T8["8 · A–Z index"]
  T9["9 · Sorting and Tag filter"]
  T10["10 · Search"]
  T11["11 · @add-recipe skill"]
  T12["12 · @log-cook skill"]
  T13["13 · Step photos"]

  T1 --> T2
  T1 --> T3
  T1 --> T4
  T3 --> T5
  T4 --> T5
  T5 --> T6
  T5 --> T7
  T3 --> T8
  T4 --> T8
  T8 --> T9
  T9 --> T10
  T3 --> T11
  T7 --> T11
  T3 --> T12
  T7 --> T13
  T13 --> T11

  classDef foundation fill:#efe6d6,stroke:#8a5a3b,color:#1d1c1a
  classDef recipe fill:#f9f4ea,stroke:#8a5a3b,color:#1d1c1a
  classDef index fill:#f9f4ea,stroke:#6f6a62,color:#1d1c1a
  classDef skill fill:#ffffff,stroke:#6f6a62,stroke-dasharray:4 3,color:#1d1c1a

  class T1,T2,T3,T4 foundation
  class T5,T6,T7,T13 recipe
  class T8,T9,T10 index
  class T11,T12 skill
```

- Shaded: foundation. Brown border: Recipe page. Grey border: index. Dashed: agent skills.
- After 1, tickets 2, 3 and 4 can run in parallel. After 3 and 4, the Recipe page (5–7), the index (8–10) and `@log-cook` (12) can run in parallel.
