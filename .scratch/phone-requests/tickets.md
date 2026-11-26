# Ticket dependencies

```mermaid
flowchart TD
  T1["1 · Confirm the facts<br/>Gemini limits, CI on bot commits, photo attachments"]
  T2["2 · One rules document"]
  T3["3 · Walking skeleton<br/>a new Recipe from a Request"]
  T4["4 · Photos from a Request"]
  T5["5 · Existing Recipes<br/>edits, Cooks, Ratings"]
  T6["6 · Running a Request again"]
  T7["7 · Auto-merge and publicar direto"]

  T1 --> T3
  T2 --> T3
  T3 --> T4
  T3 --> T5
  T3 --> T6
  T3 --> T7

  classDef foundation fill:#efe6d6,stroke:#8a5a3b,color:#1d1c1a
  classDef feature fill:#f9f4ea,stroke:#8a5a3b,color:#1d1c1a
  class T1,T2,T3 foundation
  class T4,T5,T6,T7 feature
```

- 1 and 2 can run in parallel. After 3, tickets 4 to 7 can run in parallel.
- 1 has an owner-only step (attaching a test photo from the phone); 3 needs the owner to add the Gemini API key.
