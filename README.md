# MCP Mind Balance & Argumentation Service

A Model Context Protocol (MCP) server implementation providing strongly-typed argumentation tools for decision-making and argument analysis. This service implements the **Typed Argumentation Tools for Model Context Protocol** white paper design, featuring an angel/demon advisory system and complementary argumentation tools for strengthening (steelman) and weakening (strawman) arguments.

## 🎯 White Paper Compliance

This implementation follows the five core design principles from the white paper:

1. **Strong Typing**: Every argument component is a typed object with schema validation
2. **Charity by Default**: Steelman encourages maximally charitable reconstruction before critique  
3. **Explainability**: Each result includes evidence references, severity annotations, and residual risk descriptions
4. **Composability**: Tools can be chained in pipelines (e.g., strawman → steelman)
5. **Transport-Agnostic**: Defined over JSON-RPC 2.0, works in any MCP-compliant environment

## Features

### 🧠 Mind Balance Tool (`mind.balance`)
- **Parametric Advisory Model**: Implements the white paper's conceptual model with cosine (angel) and tangent (demon) advisors
- **Phase-Sensitive Modeling**: Theta and phi angles encode cognitive rhythm and timing
- **Nonlinear Dynamics**: Tangent growth captures escalating urgency or emotional pull
- **Clamp Control**: Safety mechanisms prevent infinite or runaway values
- **Explainability**: Returns angel/demon signals and blended score with detailed rationale
- **Weighted Vector Field**: Forms a decision space influenced by stable (cosine) and urgent (tangent) forces

### 🛡️ Steelman Tool (`argument.steelman`)
- **Argument Strengthening**: Produces the strongest, most charitable version of an opponent's claim
- **Premise Enhancement**: Identifies and strengthens supporting premises
- **Objection Handling**: Addresses anticipated objections
- **Confidence Scoring**: Provides confidence levels for the strengthened argument

### 🎯 Strawman Tool (`argument.strawman`)
- **Argument Weakening**: Analyzes or generates weakened versions of arguments
- **Distortion Detection**: Identifies various types of argument distortions
- **Fallacy Recognition**: Detects logical fallacies in arguments
- **Easy Refutation**: Provides concise takedowns of distorted claims

### 🔗 Pipeline Tool (`argument.pipeline.strawman-to-steelman`)
- **Composability**: Demonstrates tool chaining for complex analysis
- **Distortion → Strengthening**: Applies distortions then strengthens the claim
- **Methodology Tracking**: Provides detailed pipeline methodology notes
- **Confidence Scoring**: Combined confidence from both operations

## 🎯 White Paper Applications

The Mind Balance tool enables several key applications as outlined in the white paper:

### AI Personalities
Model moral conflicts for NPCs or agents with unique decision biases using different angel/demon weight combinations.

### Deliberation Simulations  
Explore what-if scenarios by shifting advisor weights and observing outcomes in decision-making contexts.

### Ethical Decision Support
Encode utilitarian vs. deontological pressures for policy modeling through strategic phase angle selection.

### Creative Tools
Represent artistic or narrative 'muses' as competing advisory forces for creative decision-making.

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

## Development

```bash
# Run in development mode with watch
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Usage

### Running the MCP Server

The server runs on STDIO and can be used with any MCP-compatible client:

```bash
node dist/index.js
```

### Client Usage Examples

#### Mind Balance Example

```typescript
import { MindBalanceCommand } from './src/tools/mind-balance.js';

const mindBalance = new MindBalanceCommand();

const request = mindBalance.buildRequest('1', {
  topic: 'Should we implement this feature?',
  theta: Math.PI / 4, // 45°
  phi: Math.PI / 6,   // 30°
  cosine: 0.7,        // angel weight
  tangent: 0.4,       // demon weight
  mode: 'blend',      // combine both signals
  normalize: true
});

// Send to MCP server and parse response
const response = await mcpTransport.send(request);
const advice = mindBalance.parseResponse(response);
```

#### Steelman Example

```typescript
import { SteelmanCommand } from './src/tools/argumentation.js';

const steelman = new SteelmanCommand();

const request = steelman.buildRequest('2', {
  opponentClaim: 'AI models should be banned because they replace human creativity.',
  charitableAssumptions: ['We value human flourishing'],
  context: 'AI policy debate',
  requestImprovedFormulation: true
});
```

#### Strawman Example

```typescript
import { StrawmanCommand } from './src/tools/argumentation.js';

const strawman = new StrawmanCommand();

const request = strawman.buildRequest('3', {
  originalClaim: 'We should regulate AI models for transparency.',
  distortions: ['exaggeration', 'false_dichotomy'],
  requestRefutation: true
});
```

## API Reference

### Mind Balance Tool

**Input Parameters:**
- `topic` (string): Decision context
- `theta` (number): Angel phase angle in radians
- `phi` (number): Demon phase angle in radians (avoid ±π/2)
- `cosine` (number): Angel weight [-1, 1]
- `tangent` (number): Demon weight
- `mode` (string): 'angel', 'demon', or 'blend'
- `tanClamp` (number, optional): Clamp for tan() to avoid infinities (default: 3.0)
- `normalize` (boolean, optional): Normalize signals (default: true)
- `tags` (string[], optional): Context tags

**Output:**
- `topic`: Original topic
- `angelSignal`: Calculated angel signal
- `demonSignal`: Calculated demon signal
- `mode`: Advisory mode used
- `blendedScore`: Final decision score
- `rationale`: Human-readable explanation
- `metadata`: Calculation details

### Steelman Tool

**Input Parameters:**
- `opponentClaim` (string): Claim to strengthen
- `charitableAssumptions` (string[], optional): Assumptions to add
- `strongestPremises` (Premise[], optional): Supporting premises
- `anticipatedObjections` (Objection[], optional): Objections to address
- `context` (string, optional): Domain context
- `requestImprovedFormulation` (boolean, optional): Request rewrite

**Output:**
- `improvedClaim`: Strengthened version of the claim
- `premises`: Enhanced premises
- `addressedObjections`: Objections with responses
- `residualRisks`: Remaining vulnerabilities
- `confidence`: Confidence level (0-5)
- `notes`: Additional insights

### Strawman Tool

**Input Parameters:**
- `originalClaim` (string): Claim to weaken
- `distortedClaim` (string, optional): Pre-distorted version
- `distortions` (Distortion[], optional): Distortion techniques
- `weakPremises` (Premise[], optional): Weak premises
- `fallacies` (Fallacy[], optional): Logical fallacies
- `context` (string, optional): Analysis context
- `requestRefutation` (boolean, optional): Generate refutation

**Output:**
- `distortedClaim`: Weakened version
- `weakPremises`: Identified weak premises
- `identifiedDistortions`: Detected distortions
- `identifiedFallacies`: Detected fallacies
- `easyRefutation`: Concise refutation
- `improvementHint`: How to strengthen
- `confidence`: Analysis confidence (0-5)

## Architecture

```
src/
├── types/           # Core MCP types and interfaces
├── core/            # Base classes and utilities
├── tools/           # Tool implementations
│   ├── mind-balance.ts
│   └── argumentation.ts
├── server/          # MCP server implementation
├── transports/      # Transport layer (STDIO)
└── index.ts         # Main entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and formatting
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Based on the Model Context Protocol specification
- Inspired by steelman/strawman argumentation techniques
- Angel/demon decision model inspired by cognitive psychology research
