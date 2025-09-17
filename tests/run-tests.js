#!/usr/bin/env node

/**
 * Simple test runner for MCP tools
 * Run with: node tests/run-tests.js
 */

import { MindBalanceTool } from '../dist/tools/mind-balance.js';
import { SteelmanTool, StrawmanTool } from '../dist/tools/argumentation.js';

async function runTests() {
  console.log('🧪 Running MCP Tools Tests...\n');

  // Test Mind Balance Tool
  console.log('Testing mind.balance tool...');
  try {
    const mindTool = new MindBalanceTool();
    
    // Test probabilistic mode
    const mindResult = await mindTool.execute({
      topic: 'YOLO breakout vs wait-for-confirmation',
      theta: Math.PI/5,
      phi: Math.PI/7,
      cosine: 0.8,
      tangent: 0.6,
      mode: 'probabilistic',
      tanClamp: 2.5,
      normalize: true,
      scoring: { 
        rules: ['brier', 'log'], 
        abstainThreshold: 0.7, 
        abstentionScore: 0.0 
      }
    });

    console.log('✅ mind.balance (probabilistic):', {
      decision: mindResult.decision,
      confidence: mindResult.confidence.toFixed(3),
      pPositive: mindResult.pPositive.toFixed(3),
      pNegative: mindResult.pNegative.toFixed(3)
    });
  } catch (error) {
    console.error('❌ mind.balance test failed:', error.message);
  }

  // Test Steelman Tool
  console.log('\nTesting argument.steelman tool...');
  try {
    const steelmanTool = new SteelmanTool();
    
    const steelmanResult = await steelmanTool.execute({
      opponentClaim: 'Technology is making us less social',
      charitableAssumptions: ['Good faith concern about social connection'],
      context: 'Digital age social dynamics'
    });

    console.log('✅ argument.steelman:', {
      improvedClaim: steelmanResult.improvedClaim.substring(0, 100) + '...',
      confidence: steelmanResult.confidence,
      premisesCount: steelmanResult.premises.length
    });
  } catch (error) {
    console.error('❌ argument.steelman test failed:', error.message);
  }

  // Test Strawman Tool
  console.log('\nTesting argument.strawman tool...');
  try {
    const strawmanTool = new StrawmanTool();
    
    const strawmanResult = await strawmanTool.execute({
      originalClaim: 'Some studies suggest social media has mixed effects',
      distortions: ['exaggeration', 'oversimplification'],
      requestRefutation: true
    });

    console.log('✅ argument.strawman:', {
      distortedClaim: strawmanResult.distortedClaim.substring(0, 100) + '...',
      distortions: strawmanResult.identifiedDistortions,
      confidence: strawmanResult.confidence
    });
  } catch (error) {
    console.error('❌ argument.strawman test failed:', error.message);
  }

  console.log('\n🎉 All tests completed!');
}

runTests().catch(console.error);
