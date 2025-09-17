/**
 * Tests for Argumentation Tools
 * Tests steelman and strawman analysis tools
 */

import { SteelmanTool, StrawmanTool } from '../src/tools/argumentation.js';
import type { SteelmanArgs, StrawmanArgs } from '../src/tools/argumentation.js';

describe('SteelmanTool', () => {
  let tool: SteelmanTool;

  beforeEach(() => {
    tool = new SteelmanTool();
  });

  it('should strengthen a basic claim', async () => {
    const args: SteelmanArgs = {
      opponentClaim: 'Technology is bad for society',
      context: 'Social impact analysis'
    };

    const result = await tool.execute(args);

    expect(result.improvedClaim).toBeDefined();
    expect(result.improvedClaim).not.toBe(args.opponentClaim);
    expect(result.premises).toBeDefined();
    expect(result.addressedObjections).toBeDefined();
    expect(result.residualRisks).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(5);
  });

  it('should handle provided premises and objections', async () => {
    const args: SteelmanArgs = {
      opponentClaim: 'Renewable energy is the future',
      strongestPremises: [
        {
          text: 'Renewable energy reduces carbon emissions',
          support: 'Scientific consensus on climate change',
          evidence: [{ title: 'IPCC Report 2023', url: 'https://example.com' }]
        }
      ],
      anticipatedObjections: [
        {
          text: 'Renewable energy is too expensive',
          severity: 'high',
          response: 'Costs are decreasing rapidly'
        }
      ],
      charitableAssumptions: ['Good faith environmental concern'],
      requestImprovedFormulation: true
    };

    const result = await tool.execute(args);

    expect(result.improvedClaim).toContain('Assuming: Good faith environmental concern');
    expect(result.premises.length).toBeGreaterThan(0);
    expect(result.addressedObjections.length).toBeGreaterThan(0);
    expect(result.notes).toBeDefined();
  });

  it('should calculate confidence based on argument strength', async () => {
    const strongArgs: SteelmanArgs = {
      opponentClaim: 'Well-supported claim',
      strongestPremises: [
        { text: 'Strong premise 1', support: 'Evidence A' },
        { text: 'Strong premise 2', support: 'Evidence B' },
        { text: 'Strong premise 3', support: 'Evidence C' }
      ],
      anticipatedObjections: [
        { text: 'Minor objection', severity: 'low', response: 'Addressed' }
      ]
    };

    const weakArgs: SteelmanArgs = {
      opponentClaim: 'Weak claim',
      strongestPremises: [],
      anticipatedObjections: [
        { text: 'Major objection', severity: 'high' }
      ]
    };

    const strongResult = await tool.execute(strongArgs);
    const weakResult = await tool.execute(weakArgs);

    expect(strongResult.confidence).toBeGreaterThan(weakResult.confidence);
  });
});

describe('StrawmanTool', () => {
  let tool: StrawmanTool;

  beforeEach(() => {
    tool = new StrawmanTool();
  });

  it('should generate distorted claim when not provided', async () => {
    const args: StrawmanArgs = {
      originalClaim: 'Some people believe in climate change',
      distortions: ['exaggeration', 'oversimplification']
    };

    const result = await tool.execute(args);

    expect(result.distortedClaim).toBeDefined();
    expect(result.distortedClaim).not.toBe(args.originalClaim);
    expect(result.identifiedDistortions).toContain('exaggeration');
    expect(result.identifiedDistortions).toContain('oversimplification');
  });

  it('should analyze provided distorted claim', async () => {
    const args: StrawmanArgs = {
      originalClaim: 'Some studies suggest benefits',
      distortedClaim: 'ALL studies prove benefits',
      distortions: ['exaggeration'],
      fallacies: ['hasty_generalization'],
      requestRefutation: true
    };

    const result = await tool.execute(args);

    expect(result.distortedClaim).toBe('ALL studies prove benefits');
    expect(result.identifiedDistortions).toContain('exaggeration');
    expect(result.identifiedFallacies).toContain('hasty_generalization');
    expect(result.easyRefutation).toBeDefined();
    expect(result.improvementHint).toBeDefined();
  });

  it('should identify various distortion types', async () => {
    const args: StrawmanArgs = {
      originalClaim: 'Complex nuanced argument with context [important details]',
      distortions: ['exaggeration', 'context_stripping', 'false_dichotomy']
    };

    const result = await tool.execute(args);

    expect(result.identifiedDistortions).toContain('exaggeration');
    expect(result.identifiedDistortions).toContain('context_stripping');
    expect(result.identifiedDistortions).toContain('false_dichotomy');
  });

  it('should generate weak premises and refutation', async () => {
    const args: StrawmanArgs = {
      originalClaim: 'Evidence-based claim',
      requestRefutation: true
    };

    const result = await tool.execute(args);

    expect(result.weakPremises.length).toBeGreaterThan(0);
    expect(result.easyRefutation).toBeDefined();
    expect(result.improvementHint).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(5);
  });

  it('should calculate confidence based on identified issues', async () => {
    const manyIssuesArgs: StrawmanArgs = {
      originalClaim: 'Test claim',
      distortions: ['exaggeration', 'oversimplification', 'false_dichotomy'],
      fallacies: ['strawman', 'hasty_generalization'],
      weakPremises: [
        { text: 'Weak premise 1' },
        { text: 'Weak premise 2' }
      ]
    };

    const fewIssuesArgs: StrawmanArgs = {
      originalClaim: 'Test claim',
      distortions: ['exaggeration']
    };

    const manyResult = await tool.execute(manyIssuesArgs);
    const fewResult = await tool.execute(fewIssuesArgs);

    expect(manyResult.confidence).toBeGreaterThan(fewResult.confidence);
  });
});

describe('Tool Integration', () => {
  it('should have consistent tool definitions', () => {
    const steelmanTool = new SteelmanTool();
    const strawmanTool = new StrawmanTool();

    expect(steelmanTool.name).toBe('argument.steelman');
    expect(strawmanTool.name).toBe('argument.strawman');
    expect(steelmanTool.description).toBeDefined();
    expect(strawmanTool.description).toBeDefined();
    expect(steelmanTool.inputSchema).toBeDefined();
    expect(strawmanTool.inputSchema).toBeDefined();
  });

  it('should validate input schemas', () => {
    const steelmanTool = new SteelmanTool();
    const strawmanTool = new StrawmanTool();

    // Test valid steelman args
    const validSteelmanArgs = {
      opponentClaim: 'Test claim'
    };
    expect(() => steelmanTool.validateArgs(validSteelmanArgs)).not.toThrow();

    // Test valid strawman args
    const validStrawmanArgs = {
      originalClaim: 'Test claim'
    };
    expect(() => strawmanTool.validateArgs(validStrawmanArgs)).not.toThrow();
  });
});
