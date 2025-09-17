/**
 * Tests for Mind Balance Tool
 * Tests the probabilistic mode with abstention and proper scoring
 */

import { MindBalanceTool } from '../src/tools/mind-balance.js';
import type { MindBalanceArgs } from '../src/tools/mind-balance.js';

describe('MindBalanceTool', () => {
  let tool: MindBalanceTool;

  beforeEach(() => {
    tool = new MindBalanceTool();
  });

  describe('probabilistic mode', () => {
    it('should return probabilities and decision for high confidence', async () => {
      const args: MindBalanceArgs = {
        topic: 'Test decision',
        theta: Math.PI / 4,
        phi: Math.PI / 6,
        cosine: 0.8,
        tangent: 0.6,
        mode: 'probabilistic',
        scoring: {
          rules: ['brier', 'log'],
          abstainThreshold: 0.7,
          abstentionScore: 0.0
        }
      };

      const result = await tool.execute(args);

      expect(result.mode).toBe('probabilistic');
      expect(result.pPositive).toBeGreaterThan(0);
      expect(result.pNegative).toBeGreaterThan(0);
      expect(result.pPositive + result.pNegative).toBeCloseTo(1, 5);
      expect(['positive', 'negative', 'abstain']).toContain(result.decision);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should abstain when confidence is below threshold', async () => {
      const args: MindBalanceArgs = {
        topic: 'Ambiguous decision',
        theta: 0.1,
        phi: 0.1,
        cosine: 0.1,
        tangent: 0.1,
        mode: 'probabilistic',
        scoring: {
          rules: ['brier'],
          abstainThreshold: 0.8,
          abstentionScore: 0.0
        }
      };

      const result = await tool.execute(args);

      expect(result.decision).toBe('abstain');
      expect(result.confidence).toBeLessThan(0.8);
    });

    it('should include proper scores when requested', async () => {
      const args: MindBalanceArgs = {
        topic: 'Scored decision',
        theta: Math.PI / 3,
        phi: Math.PI / 4,
        cosine: 0.7,
        tangent: 0.5,
        mode: 'probabilistic',
        scoring: {
          rules: ['brier', 'log'],
          abstainThreshold: 0.6,
          abstentionScore: 0.0
        }
      };

      const result = await tool.execute(args);

      expect(result.scores).toBeDefined();
      if (result.scores) {
        expect(result.scores.brier).toBeDefined();
        expect(result.scores.log).toBeDefined();
      }
    });

    it('should use default values when not specified', async () => {
      const args: MindBalanceArgs = {
        topic: 'Default values test',
        theta: Math.PI / 2,
        phi: Math.PI / 3,
        cosine: 0.5,
        tangent: 0.3,
        mode: 'probabilistic'
      };

      const result = await tool.execute(args);

      expect(result.metadata.normalized).toBe(true);
      expect(result.metadata.tanClamp).toBe(3.0);
    });
  });

  describe('legacy modes', () => {
    it('should work with angel mode', async () => {
      const args: MindBalanceArgs = {
        topic: 'Angel test',
        theta: Math.PI / 4,
        phi: Math.PI / 6,
        cosine: 0.8,
        tangent: 0.6,
        mode: 'angel'
      };

      const result = await tool.execute(args);

      expect(result.mode).toBe('angel');
      expect(result.angelSignal).toBeDefined();
      expect(result.demonSignal).toBeDefined();
    });

    it('should work with demon mode', async () => {
      const args: MindBalanceArgs = {
        topic: 'Demon test',
        theta: Math.PI / 4,
        phi: Math.PI / 6,
        cosine: 0.8,
        tangent: 0.6,
        mode: 'demon'
      };

      const result = await tool.execute(args);

      expect(result.mode).toBe('demon');
      expect(result.angelSignal).toBeDefined();
      expect(result.demonSignal).toBeDefined();
    });

    it('should work with blend mode', async () => {
      const args: MindBalanceArgs = {
        topic: 'Blend test',
        theta: Math.PI / 4,
        phi: Math.PI / 6,
        cosine: 0.8,
        tangent: 0.6,
        mode: 'blend'
      };

      const result = await tool.execute(args);

      expect(result.mode).toBe('blend');
      expect(result.angelSignal).toBeDefined();
      expect(result.demonSignal).toBeDefined();
    });
  });

  describe('validation', () => {
    it('should throw error for invalid cosine weight', async () => {
      const args: MindBalanceArgs = {
        topic: 'Invalid test',
        theta: Math.PI / 4,
        phi: Math.PI / 6,
        cosine: 1.5, // Invalid: > 1
        tangent: 0.6,
        mode: 'probabilistic'
      };

      await expect(tool.execute(args)).rejects.toThrow('Cosine weight must be in range [-1, 1]');
    });

    it('should throw error for invalid phi angle', async () => {
      const args: MindBalanceArgs = {
        topic: 'Invalid test',
        theta: Math.PI / 4,
        phi: Math.PI / 2, // Invalid: exactly π/2
        cosine: 0.8,
        tangent: 0.6,
        mode: 'probabilistic'
      };

      await expect(tool.execute(args)).rejects.toThrow('Phi must be in range (-π/2, π/2)');
    });

    it('should throw error for invalid tanClamp', async () => {
      const args: MindBalanceArgs = {
        topic: 'Invalid test',
        theta: Math.PI / 4,
        phi: Math.PI / 6,
        cosine: 0.8,
        tangent: 0.6,
        mode: 'probabilistic',
        tanClamp: -1 // Invalid: negative
      };

      await expect(tool.execute(args)).rejects.toThrow('tanClamp must be positive');
    });
  });

  describe('rationale generation', () => {
    it('should generate detailed rationale for probabilistic mode', async () => {
      const args: MindBalanceArgs = {
        topic: 'Rationale test',
        theta: Math.PI / 4,
        phi: Math.PI / 6,
        cosine: 0.8,
        tangent: 0.6,
        mode: 'probabilistic',
        tags: ['urgent', 'ethical']
      };

      const result = await tool.execute(args);

      expect(result.rationale).toContain('Mind Balance Analysis');
      expect(result.rationale).toContain('angel advisor');
      expect(result.rationale).toContain('demon advisor');
      expect(result.rationale).toContain('Probabilistic mode');
      expect(result.rationale).toContain('urgent, ethical');
    });
  });
});
