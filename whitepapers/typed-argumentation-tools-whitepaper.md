# Typed Argumentation Tools for Model Context Protocol

**Authors:**  
Pedro "Axefield" de Castro Davila (Truligon)  
GPT-5 (collaborator & co-architect)

## Abstract

This paper introduces a pair of complementary argumentation tools—Steelman and Strawman—implemented as strongly-typed Model Context Protocol (MCP) tool commands. These tools allow reasoning systems and AI agents to formalize, evaluate, and improve arguments by explicitly modeling charitable reconstruction (steelman) and distortion analysis (strawman) in a JSON-RPC 2.0 environment.

By providing consistent schemas for premises, objections, fallacies, and evidence, the system enables robust, reproducible argument analysis across heterogeneous LLM agents, discussion platforms, and automated deliberation pipelines.

## 1. Motivation

Modern AI systems increasingly act as mediators in debates, decision support, and collaborative reasoning. However, most conversational protocols lack an explicit mechanism for:

- Strengthening opponent positions to ensure fair, good-faith reasoning (steelman).
- Diagnosing distortions, fallacies, and rhetorical misrepresentations (strawman).
- Providing structured outputs that downstream systems can consume, visualize, and store.

Without structured argumentation, LLM-based reasoning risks hallucination bias, low epistemic robustness, and echo-chamber amplification.

## 2. Design Principles

Our MCP argumentation tools follow five core design principles:

1. **Strong Typing**: Every argument component—premise, objection, distortion, fallacy—is a typed object with schema validation.
2. **Charity by Default**: Steelman encourages maximally charitable reconstruction before critique.
3. **Explainability**: Each result includes evidence references, severity annotations, and residual risk descriptions.
4. **Composability**: Tools can be chained in pipelines: e.g. strawman → steelman to transform a distorted claim back into its strongest version.
5. **Transport-Agnostic**: Defined over JSON-RPC 2.0, tools can run in any MCP-compliant server or client.

## 3. System Overview

### Client Side:
- Builds a `tools/call` request using `SteelmanCommand` or `StrawmanCommand`.
- Sends request over MCP transport (WebSocket, stdio, HTTP).

### Server Side:
- Validates request against JSON Schema.
- Runs reasoning model or logic engine to produce `SteelmanResult` or `StrawmanResult`.
- Responds with `ToolsCallResult`.

**Figure 1:** High-level data flow from client invocation to result.

## 4. Core Data Model

| Concept | Purpose | Key Fields |
|---------|---------|------------|
| Premise | Foundational claim supporting argument | `text`, `support`, `evidence[]` |
| Objection | Counterpoint or challenge | `text`, `severity`, `response` |
| Distortion | Specific rhetorical misrepresentation | Enum: `exaggeration`, `false_dichotomy`, etc. |
| Fallacy | Logical error or invalid inference | Enum: `strawman`, `ad_hominem`, etc. |
| Confidence | Quantized rating of strength/robustness | Integer 0-5 |

## 5. Steelman Tool

### Purpose
The Steelman tool produces the strongest, most charitable version of an opponent's claim, including best premises and addressed objections.

### Input Schema
```json
{
  "type": "object",
  "required": ["opponentClaim"],
  "properties": {
    "opponentClaim": {
      "type": "string",
      "minLength": 1,
      "description": "Opponent's claim in their best possible terms"
    },
    "charitableAssumptions": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Charitable assumptions added to make the claim maximally reasonable"
    },
    "strongestPremises": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["text"],
        "properties": {
          "text": { "type": "string", "minLength": 1 },
          "support": { "type": "string" },
          "evidence": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": { "type": "string" },
                "url": { "type": "string", "format": "uri" },
                "doi": { "type": "string" },
                "note": { "type": "string" }
              }
            }
          }
        }
      }
    },
    "anticipatedObjections": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["text"],
        "properties": {
          "text": { "type": "string" },
          "severity": { "type": "string", "enum": ["low", "medium", "high"] },
          "response": { "type": "string" }
        }
      }
    },
    "context": { "type": "string" },
    "requestImprovedFormulation": { "type": "boolean", "default": true }
  }
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "improvedClaim": { "type": "string" },
    "premises": { "type": "array", "items": { "$ref": "#/definitions/Premise" } },
    "addressedObjections": { "type": "array", "items": { "$ref": "#/definitions/Objection" } },
    "residualRisks": { "type": "array", "items": { "type": "string" } },
    "confidence": { "type": "integer", "minimum": 0, "maximum": 5 },
    "notes": { "type": "string" }
  }
}
```

## 6. Strawman Tool

### Purpose
The Strawman tool analyzes or synthesizes a strawman: shows distortions/fallacies, weak premises, and provides an easy refutation.

### Input Schema
```json
{
  "type": "object",
  "required": ["originalClaim"],
  "properties": {
    "originalClaim": {
      "type": "string",
      "minLength": 1,
      "description": "Original claim that (incorrectly) gets distorted"
    },
    "distortedClaim": {
      "type": "string",
      "description": "Concrete distorted version to analyze (or auto-generate if omitted)"
    },
    "distortions": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "exaggeration",
          "oversimplification",
          "misattribution",
          "context_stripping",
          "straw_person_minor",
          "quote_mining",
          "false_dichotomy"
        ]
      }
    },
    "weakPremises": {
      "type": "array",
      "items": { "$ref": "#/definitions/Premise" }
    },
    "fallacies": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "strawman",
          "ad_hominem",
          "slippery_slope",
          "hasty_generalization",
          "false_dichotomy",
          "appeal_to_ignorance",
          "appeal_to_emotion",
          "circular_reasoning"
        ]
      }
    },
    "context": { "type": "string" },
    "requestRefutation": { "type": "boolean", "default": true }
  }
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "distortedClaim": { "type": "string" },
    "weakPremises": { "type": "array", "items": { "$ref": "#/definitions/Premise" } },
    "identifiedDistortions": { "type": "array", "items": { "type": "string" } },
    "identifiedFallacies": { "type": "array", "items": { "type": "string" } },
    "easyRefutation": { "type": "string" },
    "improvementHint": { "type": "string" },
    "confidence": { "type": "integer", "minimum": 0, "maximum": 5 }
  }
}
```

## 7. Composability

The tools are designed to be composable in pipelines. For example:

1. **Strawman → Steelman Pipeline**: Apply distortions to a claim, then strengthen it back to its strongest form.
2. **Steelman → Strawman Pipeline**: Take a strengthened argument and identify potential weak points.
3. **Iterative Refinement**: Chain multiple applications for complex argument analysis.

## 8. Implementation Considerations

### Error Handling
- Comprehensive error codes for different failure modes
- Graceful degradation when optional parameters are missing
- Clear error messages for schema validation failures

### Performance
- Efficient JSON Schema validation
- Caching of common argument patterns
- Streaming support for large argument sets

### Security
- Input sanitization for all text fields
- Rate limiting for tool calls
- Audit logging for argument analysis

## 9. Future Directions

1. **Multi-Language Support**: Extend to support arguments in multiple languages
2. **Temporal Analysis**: Track argument evolution over time
3. **Collaborative Features**: Support for multi-user argument construction
4. **Integration with Knowledge Graphs**: Link arguments to structured knowledge bases
5. **Advanced Fallacy Detection**: Machine learning models for subtle fallacy identification

## 10. Conclusion

The Typed Argumentation Tools for Model Context Protocol provide a robust foundation for structured argument analysis in AI systems. By combining strong typing, charitable reconstruction, and composable design, these tools enable more reliable and transparent reasoning processes across diverse applications.

The implementation demonstrates how formal argumentation theory can be practically applied in modern AI systems, providing both technical rigor and practical utility for reasoning tasks.

---

*This white paper represents a collaborative effort between human and AI researchers to advance the state of structured argumentation in artificial intelligence systems.*
