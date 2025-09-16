# MCP Mind Balance White Paper

## Executive Summary

This white paper explores the conceptual and technical design of the MCP Mind Balance tool, a novel mechanism for modeling cognitive tension through 'angel' (cosine) and 'demon' (tangent) advisors. This approach introduces a formalized representation of internal deliberation, enabling agents to simulate moral weight, emotional bias, and rational trade-offs in decision-making contexts.

## Problem Statement

Traditional decision systems treat choices as binary or scalar optimizations without encoding the push-and-pull forces that influence human judgment. This results in overly linear reasoning that misses nuance, moral framing, and inner conflict modeling.

## Conceptual Model

Mind Balance introduces a parametric advisory model where two primary forces—angel (cos) and demon (tan)—influence decision space. The cosine term represents stable, harmonizing, or ethically grounded advice, while the tangent term captures destabilizing, urgent, or risky impulses. Together, they form a weighted vector field that produces a blended decision score. This provides a more faithful simulation of ambivalence and moral tension.

## Key Features

### 1. Phase-Sensitive Modeling
Theta and phi angles encode cognitive rhythm and timing, allowing the system to model how decision-making patterns change over time and context.

### 2. Nonlinear Dynamics
Tangent growth captures escalating urgency or emotional pull, providing a more realistic model of how pressure and urgency influence decisions.

### 3. Clamp Control
Safety mechanisms prevent infinite or runaway values from destabilizing output, ensuring robust and predictable behavior.

### 4. Explainability
The tool returns angel/demon signals and a blended score with a rationale string, providing transparency into the decision-making process.

### 5. Transport-Agnostic
Fully compatible with MCP tools/call over JSON-RPC 2.0, enabling integration with any MCP-compliant system.

## Technical Implementation

### Input Parameters

```typescript
interface MindBalanceArgs {
  topic: string;           // Decision context
  theta: number;          // Angel phase angle (radians)
  phi: number;            // Demon phase angle (radians, avoid ±π/2)
  cosine: number;         // Angel weight [-1, 1]
  tangent: number;        // Demon weight
  mode: 'angel' | 'demon' | 'blend';
  tanClamp?: number;      // Safety clamp (default: 3.0)
  normalize?: boolean;    // Normalize signals (default: true)
  tags?: string[];        // Context tags
}
```

### Output Schema

```typescript
interface MindBalanceAdvice {
  topic: string;              // Original decision context
  angelSignal: number;        // cos(theta) * cosine
  demonSignal: number;        // clamped tan(phi) * tangent
  mode: AdvisoryMode;         // Combination mode used
  blendedScore: number;       // Final decision score
  rationale: string;          // Explainable rationale
  metadata: {
    theta: number;
    phi: number;
    cosine: number;
    tangent: number;
    tanClamp: number;
    normalized: boolean;
  };
}
```

### Mathematical Model

The core decision model combines two trigonometric functions:

1. **Angel Signal**: `cos(theta) * cosine`
   - Represents stable, ethically grounded advice
   - Cosine function provides smooth, bounded behavior
   - Weight range [-1, 1] for balanced influence

2. **Demon Signal**: `clamped_tan(phi) * tangent`
   - Captures escalating urgency and emotional pull
   - Tangent function provides nonlinear growth
   - Clamped to prevent infinite values

3. **Blended Score**: Combination based on mode
   - `angel`: Use only angel signal
   - `demon`: Use only demon signal  
   - `blend`: Weighted combination of both signals

## Applications

### 1. AI Personalities
Model moral conflicts for NPCs or agents with unique decision biases using different angel/demon weight combinations.

**Example**: A cautious AI might have high cosine weight (0.8) and low tangent weight (0.2), while a risk-taking AI might have the opposite configuration.

### 2. Deliberation Simulations
Explore what-if scenarios by shifting advisor weights and observing outcomes in decision-making contexts.

**Example**: Simulate how different ethical frameworks (utilitarian vs. deontological) would influence the same decision by adjusting phase angles.

### 3. Ethical Decision Support
Encode utilitarian vs. deontological pressures for policy modeling through strategic phase angle selection.

**Example**: Use theta = 0 for utilitarian (consequence-focused) and theta = π/2 for deontological (rule-focused) ethical reasoning.

### 4. Creative Tools
Represent artistic or narrative 'muses' as competing advisory forces for creative decision-making.

**Example**: Angel represents structured, traditional approaches while demon represents experimental, boundary-pushing creativity.

## Use Cases

### Decision Support Systems
- **Medical Ethics**: Balance patient autonomy (angel) vs. medical paternalism (demon)
- **Business Strategy**: Weigh risk-averse (angel) vs. growth-oriented (demon) approaches
- **Policy Making**: Balance conservative (angel) vs. progressive (demon) policy directions

### Interactive Systems
- **Gaming**: Create NPCs with realistic internal conflicts
- **Education**: Model different learning approaches and teaching philosophies
- **Therapy**: Simulate internal dialogue for therapeutic applications

### Research Applications
- **Psychology**: Study decision-making patterns and cognitive biases
- **Economics**: Model behavioral economics scenarios
- **Philosophy**: Explore ethical reasoning frameworks

## Implementation Considerations

### Parameter Tuning
- **Theta Range**: [-π, π] for full angular coverage
- **Phi Range**: (-π/2, π/2) to avoid tangent singularities
- **Cosine Range**: [-1, 1] for balanced angel influence
- **Tangent Range**: Unbounded, but typically [-5, 5] for practical use
- **TanClamp**: Default 3.0, adjustable based on application needs

### Performance Optimization
- Pre-compute trigonometric values for common angles
- Cache rationale generation for similar parameter sets
- Use efficient clamping algorithms for real-time applications

### Error Handling
- Validate input ranges to prevent mathematical errors
- Provide clear error messages for invalid parameter combinations
- Implement graceful degradation for edge cases

## Future Directions

### 1. Multi-Advisory Extensions
Expand beyond two advisors to model pluralistic cognitive councils with multiple competing voices.

**Implementation**: Extend to N-dimensional vector space with multiple trigonometric functions.

### 2. Adaptive Weighting
Learn advisor weights dynamically from feedback loops or reinforcement signals.

**Implementation**: Machine learning integration to adjust weights based on decision outcomes.

### 3. Temporal Persistence
Maintain advisory influence across multiple steps for long-horizon planning.

**Implementation**: State management system to track advisory influence over time.

### 4. Integration with Argumentation Tools
Use angel signal to boost steelman premises and demon signal to flag objections.

**Implementation**: Cross-tool communication to enhance argument analysis with cognitive modeling.

## Technical Specifications

### JSON Schema
```json
{
  "type": "object",
  "required": ["topic", "theta", "phi", "cosine", "tangent", "mode"],
  "properties": {
    "topic": {
      "type": "string",
      "minLength": 1,
      "description": "Decision context - the core question or situation requiring advisory input"
    },
    "theta": {
      "type": "number",
      "minimum": -3.141592653589793,
      "maximum": 3.141592653589793,
      "description": "Angel phase angle (radians) for cos() - stable, ethical grounding"
    },
    "phi": {
      "type": "number",
      "minimum": -1.4707963267948965,
      "maximum": 1.4707963267948965,
      "description": "Demon phase angle (radians) for tan() - urgent, risky impulses"
    },
    "cosine": {
      "type": "number",
      "minimum": -1,
      "maximum": 1,
      "description": "Angel weight [-1, 1] - stable, harmonizing, ethically grounded advice"
    },
    "tangent": {
      "type": "number",
      "description": "Demon weight - captures destabilizing, urgent, or risky impulses"
    },
    "mode": {
      "type": "string",
      "enum": ["angel", "demon", "blend"],
      "description": "Advisory combination mode"
    },
    "tanClamp": {
      "type": "number",
      "default": 3.0,
      "minimum": 0.1,
      "maximum": 10.0,
      "description": "Safety clamp for |tan(phi)| to prevent infinite values"
    },
    "normalize": {
      "type": "boolean",
      "default": true,
      "description": "Normalize angel/demon signals before blending"
    }
  }
}
```

### MCP Tool Definition
```json
{
  "name": "mind.balance",
  "description": "Balances 'angel (cosine)' and 'demon (tangent)' advisors to produce a blended decision score and rationale.",
  "inputSchema": { /* JSON Schema above */ }
}
```

## Conclusion

The MCP Mind Balance tool represents a significant advancement in modeling cognitive tension and internal deliberation in AI systems. By combining trigonometric functions with parametric advisory models, it provides a mathematically rigorous yet intuitively understandable framework for decision-making that captures the complexity of human reasoning.

The tool's design principles—phase-sensitive modeling, nonlinear dynamics, clamp control, explainability, and transport-agnostic implementation—make it suitable for a wide range of applications from AI personalities to ethical decision support systems.

As AI systems become more sophisticated and integrated into human decision-making processes, tools like Mind Balance will be essential for creating more nuanced, transparent, and trustworthy artificial intelligence.

---

*This white paper represents a collaborative exploration of cognitive modeling in artificial intelligence, combining mathematical rigor with practical applicability.*
