# MCP Mind Balance & Argumentation Service

A Model Context Protocol (MCP) server providing tools for decision-making and argument analysis. Features an angel/demon advisory system for balanced decisions and argumentation tools for strengthening and analyzing arguments.

## 🚀 Quick Start

```bash
# Install and run
npm install
npm run build
npm start
```

The server runs on STDIO and provides 4 MCP tools for reasoning and decision-making.

## 🛠️ Available Tools

### 🧠 Mind Balance (`mind.balance`)
Balances angel (cosine) and demon (tangent) advisors to produce blended decisions with explainable rationale.

**Use for**: Decision-making, moral reasoning, AI personalities, ethical dilemmas

### 🛡️ Steelman (`argument.steelman`) 
Strengthens arguments by finding their most charitable, strongest version with enhanced premises.

**Use for**: Fair debate preparation, argument improvement, critical thinking

### 🎯 Strawman (`argument.strawman`)
Analyzes arguments to identify distortions, fallacies, and weak points with easy refutations.

**Use for**: Fallacy detection, argument critique, bias identification

### 🔗 Pipeline (`argument.pipeline.strawman-to-steelman`)
Chains strawman and steelman tools to transform distorted claims back to their strongest form.

**Use for**: Complex argument analysis, iterative refinement, comprehensive evaluation

## 📦 Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

## 🔧 Development

```bash
# Development mode with watch
npm run dev

# Run tests
npm test

# Lint and format
npm run lint
npm run format
```

## 💡 Usage Examples

### Mind Balance - Decision Making

```typescript
import { MindBalanceCommand } from './src/tools/mind-balance.js';

const mindBalance = new MindBalanceCommand();

// Build a decision request
const request = mindBalance.buildRequest('1', {
  topic: 'Should we implement this feature?',
  theta: Math.PI / 4,  // 45° - ethical consideration
  phi: Math.PI / 6,    // 30° - urgency factor  
  cosine: 0.7,         // angel weight (ethical)
  tangent: 0.4,        // demon weight (urgent)
  mode: 'blend',       // combine both signals
  normalize: true
});

// Send to MCP server
const response = await mcpTransport.send(request);
const advice = mindBalance.parseResponse(response);
console.log(advice.rationale);
```

### Steelman - Strengthen Arguments

```typescript
import { SteelmanCommand } from './src/tools/argumentation.js';

const steelman = new SteelmanCommand();

const request = steelman.buildRequest('2', {
  opponentClaim: 'AI models should be banned because they replace human creativity.',
  charitableAssumptions: ['We value human flourishing'],
  context: 'AI policy debate'
});

const response = await mcpTransport.send(request);
const strengthened = steelman.parseResponse(response);
console.log(strengthened.improvedClaim);
```

### Strawman - Analyze Weaknesses

```typescript
import { StrawmanCommand } from './src/tools/argumentation.js';

const strawman = new StrawmanCommand();

const request = strawman.buildRequest('3', {
  originalClaim: 'We should regulate AI models for transparency.',
  distortions: ['exaggeration', 'false_dichotomy'],
  requestRefutation: true
});

const response = await mcpTransport.send(request);
const analysis = strawman.parseResponse(response);
console.log(analysis.easyRefutation);
```

### Pipeline - Complex Analysis

```typescript
import { StrawmanToSteelmanCommand } from './src/tools/argumentation.js';

const pipeline = new StrawmanToSteelmanCommand();

const request = pipeline.buildRequest('4', {
  originalClaim: 'We should regulate AI models.',
  distortions: ['exaggeration', 'false_dichotomy'],
  context: 'AI policy debate'
});

const response = await mcpTransport.send(request);
const result = pipeline.parseResponse(response);
console.log(result.methodology);
```

## 📋 Tool Parameters

### Mind Balance Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `topic` | string | Decision context | "Should we implement this feature?" |
| `theta` | number | Angel phase angle (radians) | `Math.PI / 4` (45°) |
| `phi` | number | Demon phase angle (radians) | `Math.PI / 6` (30°) |
| `cosine` | number | Angel weight [-1, 1] | `0.7` (strong ethical) |
| `tangent` | number | Demon weight | `0.4` (moderate urgency) |
| `mode` | string | 'angel', 'demon', or 'blend' | `'blend'` |
| `tanClamp` | number | Safety clamp (default: 3.0) | `3.0` |
| `normalize` | boolean | Normalize signals (default: true) | `true` |

### Steelman Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `opponentClaim` | string | Claim to strengthen | "AI should be banned" |
| `charitableAssumptions` | string[] | Assumptions to add | `["We value human flourishing"]` |
| `context` | string | Domain context | "AI policy debate" |

### Strawman Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `originalClaim` | string | Claim to analyze | "We should regulate AI" |
| `distortions` | string[] | Distortion types | `["exaggeration", "false_dichotomy"]` |
| `requestRefutation` | boolean | Generate refutation | `true` |

## 🏗️ Project Structure

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

## 🧪 Testing

```bash
# Run the test suite
npm test

# Test specific tool
npm run test:server
```

## 📚 Documentation

- [White Papers](whitepapers/) - Complete technical specifications
- [Examples](examples/) - Usage examples and client code
- [API Reference](src/) - TypeScript interfaces and schemas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run `npm run lint` and `npm run format`
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
