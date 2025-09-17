# Ahrimagon MCP Service
## Scientific-Grade Mind Balance & Argumentation Tools

A **Model Context Protocol (MCP) server** providing enterprise-grade tools for decision-making and argument analysis. Features a probabilistic angel/demon advisory system with abstention-aware scoring and comprehensive argumentation tools for strengthening and analyzing arguments.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-2024.11.05-green.svg)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Quick Start

```bash
# Install and run
npm install
npm run build
npm start
```

The server runs on STDIO and provides **4 MCP tools** for scientific-grade reasoning and decision-making.

## 🧠 Core Philosophy

Ahrimagon implements a **parametric advisory model** where:
- **Angel (cosine)** = Stable, harmonizing, ethically grounded advice
- **Demon (tangent)** = Destabilizing, urgent, risky impulses
- **Blended decision** = Weighted vector field producing calibrated probabilities

This creates a **confidence-aware decision system** with proper scoring and abstention capabilities.

## 🛠️ Available Tools

### 🧠 Mind Balance (`mind.balance`)
**Probabilistic decision-making with abstention-aware scoring**

Balances angel (cosine) and demon (tangent) advisors to produce calibrated probabilities with scientific-grade abstention logic and proper scoring (Brier, Log).

**Features:**
- ✅ **Probabilistic mode** with confidence thresholds
- ✅ **Abstention logic** for uncertain decisions
- ✅ **Proper scoring** (Brier, Log, Quadratic, Spherical)
- ✅ **Numerical stability** with tangent clamping
- ✅ **Signal normalization** for consistent scaling

**Use for**: Decision-making, moral reasoning, AI personalities, ethical dilemmas, risk assessment

### 🛡️ Steelman (`argument.steelman`) 
**Charitable argument reconstruction**

Strengthens arguments by finding their most charitable, strongest version with enhanced premises and addressed objections.

**Features:**
- ✅ **Charitable assumptions** for fair representation
- ✅ **Strongest premises** with evidence citations
- ✅ **Anticipated objections** with responses
- ✅ **Confidence scoring** with uncertainty models
- ✅ **Evidence verification** and logical consistency

**Use for**: Fair debate preparation, argument improvement, critical thinking, policy analysis

### 🎯 Strawman (`argument.strawman`)
**Distortion analysis and fallacy detection**

Analyzes arguments to identify distortions, fallacies, and weak points with easy refutations and improvement suggestions.

**Features:**
- ✅ **Distortion detection** (exaggeration, oversimplification, etc.)
- ✅ **Fallacy identification** (strawman, ad hominem, etc.)
- ✅ **Weak premise analysis** with evidence gaps
- ✅ **Easy refutation** generation
- ✅ **Improvement hints** for better arguments

**Use for**: Fallacy detection, argument critique, bias identification, media analysis

### 🔗 Pipeline (`argument.pipeline.strawman-to-steelman`)
**Complex argument transformation**

Chains strawman and steelman tools to transform distorted claims back to their strongest form through systematic analysis.

**Features:**
- ✅ **Multi-step analysis** pipeline
- ✅ **Distortion application** and detection
- ✅ **Systematic strengthening** process
- ✅ **Comprehensive evaluation** methodology
- ✅ **Audit trail** for transparency

**Use for**: Complex argument analysis, iterative refinement, comprehensive evaluation, research methodology

## 🔧 Scientific Configuration System

Ahrimagon features a **enterprise-grade configuration system** with:

### 📋 Configuration Files
- **`.ahrimagon`** - Primary JSON configuration
- **`.ahrimagon.scientific`** - Scientific-grade config with full validation
- **`ahrimagon.json`** - Alternative JSON format
- **`ahrimagon.md`** - Markdown configuration support

### 🔒 Security Features
- **Cryptographic signature verification** (HMAC-SHA256)
- **Configuration checksum validation**
- **Sensitive data detection** and warnings
- **Audit logging** with detailed change tracking
- **Environment-specific security policies**

### 📊 Validation & Monitoring
- **JSON Schema validation** with comprehensive type checking
- **Numerical stability validation** for mathematical parameters
- **Business logic validation** with warnings and suggestions
- **Security checks** for data exposure and permissions
- **Performance monitoring** with audit logs

### Example Configuration

```json
{
  "version": "1.0.0",
  "signature": "B9039306F0219E48B37D82AF4101DD387E04A5BFFB1A494EC717C0752000E025",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "mindBalance": {
    "abstainThreshold": 0.70,
    "tanClamp": 3.0,
    "normalize": true,
    "scoring": {
      "rules": ["brier", "log", "quadratic"],
      "abstentionScore": 0.0,
      "calibration": {
        "temperature": 1.0,
        "method": "platt"
      }
    }
  },
  "argumentation": {
    "confidence": {
      "premiseWeight": 0.5,
      "objectionWeight": 0.3,
      "uncertaintyModel": "bayesian"
    }
  },
  "security": {
    "encryption": {
      "enabled": true,
      "algorithm": "AES-256-GCM"
    },
    "access": {
      "requireAuth": true,
      "rateLimiting": {
        "requestsPerMinute": 1000
      }
    }
  }
}
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start

# Development mode with watch
npm run dev
```

## 💡 Usage Examples

### Mind Balance - Probabilistic Decision Making

```typescript
import { MindBalanceCommand } from './src/tools/mind-balance.js';

const mindBalance = new MindBalanceCommand();

// Probabilistic decision with abstention
const request = mindBalance.buildRequest('1', {
  topic: 'Should we implement this AI feature?',
  theta: Math.PI / 4,  // 45° - ethical consideration
  phi: Math.PI / 6,    // 30° - urgency factor  
  cosine: 0.7,         // angel weight (ethical)
  tangent: 0.4,        // demon weight (urgent)
  mode: 'probabilistic', // probabilistic mode
  scoring: {
    rules: ['brier', 'log'],
    abstainThreshold: 0.7,
    abstentionScore: 0.0
  }
});

const response = await mcpTransport.send(request);
const advice = mindBalance.parseResponse(response);

console.log(`Decision: ${advice.decision}`);
console.log(`Confidence: ${advice.confidence}`);
console.log(`P(Positive): ${advice.pPositive}`);
console.log(`Rationale: ${advice.rationale}`);
```

### Steelman - Charitable Argument Strengthening

```typescript
import { SteelmanCommand } from './src/tools/argumentation.js';

const steelman = new SteelmanCommand();

const request = steelman.buildRequest('2', {
  opponentClaim: 'AI models should be banned because they replace human creativity.',
  charitableAssumptions: [
    'We value human flourishing and creative expression',
    'AI should augment rather than replace human capabilities'
  ],
  strongestPremises: [
    {
      text: 'AI can enhance human creativity through collaboration',
      support: 'Research shows AI-human collaboration produces novel creative outputs',
      evidence: [
        {
          title: 'AI-Human Creative Collaboration Study',
          url: 'https://example.com/study',
          doi: '10.1000/example'
        }
      ]
    }
  ],
  context: 'AI policy debate in educational settings'
});

const response = await mcpTransport.send(request);
const strengthened = steelman.parseResponse(response);

console.log(`Improved Claim: ${strengthened.improvedClaim}`);
console.log(`Confidence: ${strengthened.confidence}`);
console.log(`Premises: ${strengthened.premises.length}`);
```

### Strawman - Distortion Analysis

```typescript
import { StrawmanCommand } from './src/tools/argumentation.js';

const strawman = new StrawmanCommand();

const request = strawman.buildRequest('3', {
  originalClaim: 'We should regulate AI models for transparency and accountability.',
  distortions: ['exaggeration', 'false_dichotomy', 'context_stripping'],
  fallacies: ['strawman', 'slippery_slope'],
  requestRefutation: true,
  context: 'AI governance policy discussion'
});

const response = await mcpTransport.send(request);
const analysis = strawman.parseResponse(response);

console.log(`Distorted Claim: ${analysis.distortedClaim}`);
console.log(`Distortions: ${analysis.identifiedDistortions.join(', ')}`);
console.log(`Fallacies: ${analysis.identifiedFallacies.join(', ')}`);
console.log(`Refutation: ${analysis.easyRefutation}`);
```

### Pipeline - Complex Analysis

```typescript
import { StrawmanToSteelmanCommand } from './src/tools/argumentation.js';

const pipeline = new StrawmanToSteelmanCommand();

const request = pipeline.buildRequest('4', {
  originalClaim: 'We should regulate AI models to prevent misuse.',
  distortions: ['exaggeration', 'false_dichotomy'],
  context: 'AI safety and governance policy'
});

const response = await mcpTransport.send(request);
const result = pipeline.parseResponse(response);

console.log(`Methodology: ${result.methodology}`);
console.log(`Final Claim: ${result.finalClaim}`);
console.log(`Analysis Steps: ${result.analysisSteps.length}`);
```

## 📋 Tool Parameters

### Mind Balance Parameters
| Parameter | Type | Description | Example | Default |
|-----------|------|-------------|---------|---------|
| `topic` | string | Decision context | "Should we implement this feature?" | Required |
| `theta` | number | Angel phase angle (radians) | `Math.PI / 4` (45°) | Required |
| `phi` | number | Demon phase angle (radians) | `Math.PI / 6` (30°) | Required |
| `cosine` | number | Angel weight [-1, 1] | `0.7` (strong ethical) | Required |
| `tangent` | number | Demon weight | `0.4` (moderate urgency) | Required |
| `mode` | string | 'angel', 'demon', 'blend', 'probabilistic' | `'probabilistic'` | Required |
| `tanClamp` | number | Safety clamp | `3.0` | 3.0 |
| `normalize` | boolean | Normalize signals | `true` | true |
| `scoring` | object | Scoring configuration | `{rules: ['brier'], abstainThreshold: 0.7}` | Optional |

### Steelman Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `opponentClaim` | string | Claim to strengthen | "AI should be banned" |
| `charitableAssumptions` | string[] | Assumptions to add | `["We value human flourishing"]` |
| `strongestPremises` | Premise[] | Supporting evidence | `[{text: "...", support: "..."}]` |
| `anticipatedObjections` | Objection[] | Known objections | `[{text: "...", severity: "high"}]` |
| `context` | string | Domain context | "AI policy debate" |

### Strawman Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `originalClaim` | string | Claim to analyze | "We should regulate AI" |
| `distortions` | string[] | Distortion types | `["exaggeration", "false_dichotomy"]` |
| `fallacies` | string[] | Fallacy types | `["strawman", "slippery_slope"]` |
| `requestRefutation` | boolean | Generate refutation | `true` |

## 🏗️ Project Structure

```
src/
├── types/           # Core MCP types and interfaces
├── core/            # Base classes and utilities
├── tools/           # Tool implementations
│   ├── mind-balance.ts      # Probabilistic decision tool
│   └── argumentation.ts     # Argument analysis tools
├── config/          # Scientific configuration system
│   ├── types.ts            # Configuration interfaces
│   ├── schema.ts           # JSON Schema validation
│   ├── validator.ts        # Validation engine
│   ├── secure-manager.ts   # Configuration manager
│   └── loader.ts           # Configuration loader
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

# Test configuration system
node tests/scientific-config.test.js
```

## 📚 Documentation

- [**White Papers**](whitepapers/) - Complete technical specifications
- [**Examples**](examples/) - Usage examples and client code
- [**API Reference**](src/) - TypeScript interfaces and schemas
- [**Configuration Guide**](.ahrimagon.scientific) - Scientific configuration example

## 🔬 Scientific Features

### Probabilistic Decision Making
- **Calibrated probabilities** with proper scoring
- **Abstention logic** for uncertain decisions
- **Numerical stability** with tangent clamping
- **Signal normalization** for consistent scaling

### Argument Analysis
- **Charitable reconstruction** with steelman technique
- **Distortion detection** and fallacy identification
- **Evidence verification** and logical consistency
- **Confidence scoring** with uncertainty models

### Configuration Management
- **JSON Schema validation** with comprehensive type checking
- **Cryptographic verification** with signature validation
- **Audit logging** with detailed change tracking
- **Environment-specific** configuration overrides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run `npm run lint` and `npm run format`
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
[![Verified on MseeP](https://mseep.ai/badge.svg)](https://mseep.ai/app/24d8d9b7-e817-4e80-aee0-b3c6d3127a71)
