/**
 * MCP Mind Balance Tool - Angel/Demon Advisory System
 * 
 * This tool implements the conceptual model from the "MCP Mind Balance White Paper":
 * - Phase-Sensitive Modeling: Theta and phi angles encode cognitive rhythm and timing
 * - Nonlinear Dynamics: Tangent growth captures escalating urgency or emotional pull
 * - Clamp Control: Safety mechanisms prevent infinite or runaway values
 * - Explainability: Returns angel/demon signals and blended score with rationale
 * - Transport-Agnostic: Fully compatible with MCP tools/call over JSON-RPC 2.0
 * 
 * The cosine term represents stable, harmonizing, or ethically grounded advice,
 * while the tangent term captures destabilizing, urgent, or risky impulses.
 * Together, they form a weighted vector field that produces a blended decision score.
 */

import { MCPCommand, MCPTool } from '../core/mcp-command.js';

// ---- Angel/Demon Model Domain (per White Paper) ----
export type AdvisoryMode = 'angel' | 'demon' | 'blend';

/**
 * Advisor Weights - Parametric Advisory Model
 * The cosine term represents stable, harmonizing, or ethically grounded advice
 * The tangent term captures destabilizing, urgent, or risky impulses
 */
export interface AdvisorWeights {
  /** Angel influence ∝ cos(theta). Range [-1, 1] for stable, harmonizing advice. */
  cosine: number;
  /** Demon influence ∝ tan(phi). Captures escalating urgency or emotional pull. */
  tangent: number;
}

/**
 * Phase-Sensitive Modeling - Cognitive Rhythm and Timing
 * Theta and phi angles encode the cognitive rhythm and timing of decision-making
 */
export interface PhaseInputs {
  /** Angel phase angle (radians) for cos component - stable, ethical grounding. */
  theta: number;
  /** Demon phase angle (radians) for tan component - urgent, risky impulses (avoid ±π/2). */
  phi: number;
}

/**
 * Mental Context - Decision Space Context
 * Free-form context and tags to steer interpretation of the advisory forces
 */
export interface MentalContext {
  /** Free-form context (prompt) for the decision - the core question or situation. */
  topic: string;
  /** Optional tags to steer interpretation (risk, ethics, speed, creativity, etc.). */
  tags?: string[];
}

/**
 * Mind Balance Arguments - Weighted Vector Field Input
 * Forms a parametric advisory model where two primary forces influence decision space
 */
export interface MindBalanceArgs extends AdvisorWeights, PhaseInputs, MentalContext {
  /** How to combine advisors - angel-only, demon-only, or blended decision. */
  mode: AdvisoryMode;
  /** Clamp Control: Safety clamp for tan() to prevent infinite or runaway values. */
  tanClamp?: number;
  /** Optional normalization across signals for consistent scaling. */
  normalize?: boolean;
}

/**
 * Mind Balance Advice - Explainable Decision Output
 * Returns angel/demon signals and blended score with rationale for explainability
 */
export interface MindBalanceAdvice {
  /** The original decision context */
  topic: string;
  /** Angel signal: evaluated cos(theta) * cosine - stable, ethical advice */
  angelSignal: number;
  /** Demon signal: clamped tan(phi) * tangent - urgent, risky impulses */
  demonSignal: number;
  /** Advisory mode used for combination */
  mode: AdvisoryMode;
  /** Blended decision score after combination and normalization */
  blendedScore: number;
  /** Explainable rationale string describing the decision process */
  rationale: string;
  /** Complete metadata for reproducibility and analysis */
  metadata: {
    theta: number;
    phi: number;
    cosine: number;
    tangent: number;
    tanClamp: number;
    normalized: boolean;
  };
}

/**
 * JSON Schema - Phase-Sensitive Modeling with Clamp Control
 * Implements the white paper's conceptual model with strong typing and safety mechanisms
 */
export const MindBalanceSchema = {
  type: 'object',
  required: ['topic', 'theta', 'phi', 'cosine', 'tangent', 'mode'],
  properties: {
    topic: { 
      type: 'string', 
      minLength: 1, 
      description: 'Decision context - the core question or situation requiring advisory input' 
    },
    tags: { 
      type: 'array', 
      items: { type: 'string' },
      description: 'Optional tags to steer interpretation (risk, ethics, speed, creativity, etc.)'
    },
    theta: { 
      type: 'number', 
      description: 'Angel phase angle (radians) for cos() - stable, ethical grounding',
      minimum: -Math.PI,
      maximum: Math.PI
    },
    phi: {
      type: 'number',
      description: 'Demon phase angle (radians) for tan() - urgent, risky impulses (avoid ±π/2)',
      minimum: -Math.PI/2 + 0.1,
      maximum: Math.PI/2 - 0.1
    },
    cosine: {
      type: 'number',
      minimum: -1,
      maximum: 1,
      description: 'Angel weight [-1, 1] - stable, harmonizing, ethically grounded advice',
    },
    tangent: {
      type: 'number',
      description: 'Demon weight - captures destabilizing, urgent, or risky impulses',
    },
    mode: { 
      type: 'string', 
      enum: ['angel', 'demon', 'blend'],
      description: 'Advisory combination mode - angel-only, demon-only, or blended decision'
    },
    tanClamp: {
      type: 'number',
      default: 3.0,
      minimum: 0.1,
      maximum: 10.0,
      description: 'Clamp Control: Safety clamp for |tan(phi)| to prevent infinite or runaway values',
    },
    normalize: {
      type: 'boolean',
      default: true,
      description: 'Normalize angel/demon signals before blending for consistent scaling',
    },
  },
  additionalProperties: false,
} as const;

/**
 * Mind Balance Command - Client-side tool for building requests
 */
export class MindBalanceCommand extends MCPCommand<MindBalanceArgs, MindBalanceAdvice> {
  static override readonly name = 'mind.balance';

  // Expose the tool definition you'd register on an MCP server
  static toolDefinition = {
    name: MindBalanceCommand.name,
    description:
      "Balances 'angel (cosine)' and 'demon (tangent)' advisors to produce a blended decision score and rationale.",
    inputSchema: MindBalanceSchema,
  };

  constructor() {
    super(MindBalanceCommand.name);
  }
}

/**
 * Mind Balance Tool - Server-side implementation
 */
export class MindBalanceTool extends MCPTool<MindBalanceArgs, MindBalanceAdvice> {
  readonly name = 'mind.balance';
  readonly description =
    "Balances 'angel (cosine)' and 'demon (tangent)' advisors to produce a blended decision score and rationale.";
  readonly inputSchema = MindBalanceSchema;

  async execute(args: MindBalanceArgs): Promise<MindBalanceAdvice> {
    const {
      topic,
      tags = [],
      theta,
      phi,
      cosine,
      tangent,
      mode,
      tanClamp = 3.0,
      normalize = true,
    } = args;

    // Validate inputs
    this.validateInputs(args);

    // Calculate angel signal: cos(theta) * cosine
    const angelSignal = Math.cos(theta) * cosine;

    // Calculate demon signal: clamped tan(phi) * tangent
    const tanPhi = Math.tan(phi);
    const clampedTanPhi = Math.max(-tanClamp, Math.min(tanClamp, tanPhi));
    const demonSignal = clampedTanPhi * tangent;

    // Normalize signals if requested
    let normalizedAngel = angelSignal;
    let normalizedDemon = demonSignal;
    if (normalize) {
      const magnitude = Math.sqrt(angelSignal * angelSignal + demonSignal * demonSignal);
      if (magnitude > 0) {
        normalizedAngel = angelSignal / magnitude;
        normalizedDemon = demonSignal / magnitude;
      }
    }

    // Calculate blended score based on mode
    let blendedScore: number;
    switch (mode) {
      case 'angel':
        blendedScore = normalizedAngel;
        break;
      case 'demon':
        blendedScore = normalizedDemon;
        break;
      case 'blend':
      default:
        blendedScore = (normalizedAngel + normalizedDemon) / 2;
        break;
    }

    // Generate rationale
    const rationale = this.generateRationale({
      topic,
      tags,
      angelSignal: normalizedAngel,
      demonSignal: normalizedDemon,
      mode,
      blendedScore,
      theta,
      phi,
    });

    return {
      topic,
      angelSignal: normalizedAngel,
      demonSignal: normalizedDemon,
      mode,
      blendedScore,
      rationale,
      metadata: {
        theta,
        phi,
        cosine,
        tangent,
        tanClamp,
        normalized: normalize,
      },
    };
  }

  private validateInputs(args: MindBalanceArgs): void {
    if (Math.abs(args.cosine) > 1) {
      throw new Error('Cosine weight must be in range [-1, 1]');
    }

    if (Math.abs(args.phi) >= Math.PI / 2) {
      throw new Error('Phi must be in range (-π/2, π/2) to avoid tan() singularities');
    }

    if (args.tanClamp && args.tanClamp <= 0) {
      throw new Error('tanClamp must be positive');
    }
  }

  /**
   * Generate Explainable Rationale - White Paper Conceptual Model
   * Provides detailed explanation of the weighted vector field decision process
   */
  private generateRationale(params: {
    topic: string;
    tags: string[];
    angelSignal: number;
    demonSignal: number;
    mode: AdvisoryMode;
    blendedScore: number;
    theta: number;
    phi: number;
  }): string {
    const { topic, tags, angelSignal, demonSignal, mode, blendedScore, theta, phi } = params;

    const angelStrength = Math.abs(angelSignal);
    const demonStrength = Math.abs(demonSignal);
    const angelDirection = angelSignal > 0 ? 'positive' : 'negative';
    const demonDirection = demonSignal > 0 ? 'positive' : 'negative';

    let rationale = `Mind Balance Analysis for "${topic}": `;

    // Angel Analysis - Stable, Harmonizing, Ethically Grounded
    if (angelStrength > 0.7) {
      rationale += `The angel advisor strongly advocates ${angelDirection} action (${angelSignal.toFixed(3)}) - this represents stable, ethically grounded guidance from phase angle ${theta.toFixed(2)}. `;
    } else if (angelStrength > 0.4) {
      rationale += `The angel advisor moderately favors ${angelDirection} action (${angelSignal.toFixed(3)}) - harmonizing influence from stable cosine dynamics. `;
    } else if (angelStrength > 0.1) {
      rationale += `The angel advisor shows mild ${angelDirection} lean (${angelSignal.toFixed(3)}) - subtle ethical grounding. `;
    } else {
      rationale += `The angel advisor is neutral (${angelSignal.toFixed(3)}) - no strong ethical pull in either direction. `;
    }

    // Demon Analysis - Destabilizing, Urgent, Risky Impulses
    if (demonStrength > 0.7) {
      rationale += `The demon advisor strongly urges ${demonDirection} action (${demonSignal.toFixed(3)}) - escalating urgency and emotional pull from phase ${phi.toFixed(2)}. `;
    } else if (demonStrength > 0.4) {
      rationale += `The demon advisor pushes moderately toward ${demonDirection} action (${demonSignal.toFixed(3)}) - notable risky impulse. `;
    } else if (demonStrength > 0.1) {
      rationale += `The demon advisor shows mild ${demonDirection} pressure (${demonSignal.toFixed(3)}) - subtle destabilizing influence. `;
    } else {
      rationale += `The demon advisor is subdued (${demonSignal.toFixed(3)}) - minimal risky or urgent impulses. `;
    }

    // Mode-Specific Decision - Weighted Vector Field Output
    switch (mode) {
      case 'angel':
        rationale += `Angel-only mode prioritizes stable, ethical guidance: ${blendedScore > 0 ? 'Proceed with ethical grounding' : 'Hold for more stable conditions'}.`;
        break;
      case 'demon':
        rationale += `Demon-only mode follows urgent impulses: ${blendedScore > 0 ? 'Act on immediate pressure' : 'Wait despite urgency'}.`;
        break;
      case 'blend':
      default:
        const decision = Math.abs(blendedScore) > 0.4 
          ? (blendedScore > 0 ? 'Proceed with balanced guidance' : 'Hold with balanced caution')
          : 'Consider further - balanced forces create ambivalence';
        rationale += `Blended decision from weighted vector field: ${decision} (combined score: ${blendedScore.toFixed(3)}).`;
        break;
    }

    // Add Context Tags for Interpretation
    if (tags.length > 0) {
      rationale += ` Contextual factors: ${tags.join(', ')}.`;
    }

    // Add Conceptual Model Note
    rationale += ` This represents the parametric advisory model where cosine provides stable grounding and tangent captures escalating urgency.`;

    return rationale;
  }
}
