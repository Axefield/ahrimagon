/**
 * Example client usage of the MCP Mind Balance & Argumentation Service
 * Demonstrates how to use the tools from a client application
 */

import { MindBalanceCommand } from '../src/tools/mind-balance.js';
import { SteelmanCommand, StrawmanCommand, StrawmanToSteelmanCommand } from '../src/tools/argumentation.js';

// Example 1: Mind Balance - Angel/Demon Advisory System
async function exampleMindBalance() {
  console.log('=== Mind Balance Example ===');

  const mindBalance = new MindBalanceCommand();

  // Build a request for a trading decision
  const request = mindBalance.buildRequest('1', {
    topic: 'Should we YOLO the breakout or wait for confirmation?',
    tags: ['risk', 'timing', 'discipline'],
    theta: Math.PI / 4, // 45°
    phi: Math.PI / 6, // 30°
    cosine: 0.7, // stronger angel
    tangent: 0.4, // lighter demon
    mode: 'blend',
    tanClamp: 2.5,
    normalize: true,
  });

  console.log('Mind Balance Request:', JSON.stringify(request, null, 2));

  // In a real application, you would send this request to your MCP server
  // and then parse the response:
  // const response = await mcpTransport.send(request);
  // const advice = mindBalance.parseResponse(response);
  // console.log('Advice:', advice);
}

// Example 2: Steelman - Strengthening Arguments
async function exampleSteelman() {
  console.log('\n=== Steelman Example ===');

  const steelman = new SteelmanCommand();

  const request = steelman.buildRequest('2', {
    opponentClaim: 'AI models should be banned because they replace human creativity.',
    charitableAssumptions: [
      'We value long-term human flourishing',
      'We want fair attribution & compensation',
    ],
    strongestPremises: [
      {
        text: 'Automation risks devaluing creative labor',
        evidence: [{ title: 'Report X', url: 'https://example.com/report' }],
      },
      {
        text: 'Training may undercompensate original creators',
        support: 'Copyright and attribution concerns',
      },
    ],
    anticipatedObjections: [
      {
        text: 'Innovation also augments creators',
        severity: 'medium',
        response: 'This is a valid point that should be addressed',
      },
    ],
    context: 'AI policy and creative industries',
    requestImprovedFormulation: true,
  });

  console.log('Steelman Request:', JSON.stringify(request, null, 2));
}

// Example 3: Strawman - Weakening Arguments
async function exampleStrawman() {
  console.log('\n=== Strawman Example ===');

  const strawman = new StrawmanCommand();

  const request = strawman.buildRequest('3', {
    originalClaim: 'We should regulate foundation models to ensure transparency.',
    distortions: ['exaggeration', 'false_dichotomy'],
    requestRefutation: true,
    context: 'AI regulation debate',
  });

  console.log('Strawman Request:', JSON.stringify(request, null, 2));
}

// Example 4: Composability - Pipeline Tool (Strawman → Steelman)
async function exampleComposability() {
  console.log('\n=== Composability Example ===');

  const pipeline = new StrawmanToSteelmanCommand();

  const request = pipeline.buildRequest('pipeline-1', {
    originalClaim: 'We should regulate AI models to ensure transparency.',
    distortions: ['exaggeration', 'false_dichotomy'],
    context: 'AI policy and regulation debate',
  });

  console.log('Pipeline Request:', JSON.stringify(request, null, 2));
}

// Example 5: Complex Decision Making Workflow
async function exampleDecisionWorkflow() {
  console.log('\n=== Decision Workflow Example ===');

  // Step 1: Use mind balance for initial decision
  const mindBalance = new MindBalanceCommand();
  const decisionRequest = mindBalance.buildRequest('workflow-1', {
    topic: 'Should we implement a new feature or fix existing bugs?',
    tags: ['product', 'engineering', 'priorities'],
    theta: Math.PI / 3, // 60°
    phi: Math.PI / 4, // 45°
    cosine: 0.6, // moderate angel
    tangent: 0.8, // strong demon
    mode: 'blend',
  });

  console.log('Decision Request:', JSON.stringify(decisionRequest, null, 2));

  // Step 2: Steelman the "fix bugs" argument
  const steelman = new SteelmanCommand();
  const steelmanRequest = steelman.buildRequest('workflow-2', {
    opponentClaim: 'We should focus on fixing bugs instead of adding new features.',
    context: 'Software development priorities',
    requestImprovedFormulation: true,
  });

  console.log('Steelman Request:', JSON.stringify(steelmanRequest, null, 2));

  // Step 3: Identify potential strawman arguments
  const strawman = new StrawmanCommand();
  const strawmanRequest = strawman.buildRequest('workflow-3', {
    originalClaim: 'We should focus on fixing bugs instead of adding new features.',
    distortions: ['oversimplification', 'false_dichotomy'],
    requestRefutation: true,
  });

  console.log('Strawman Request:', JSON.stringify(strawmanRequest, null, 2));

  // Step 4: Use pipeline to transform distorted claim back to strongest version
  const pipeline = new StrawmanToSteelmanCommand();
  const pipelineRequest = pipeline.buildRequest('workflow-4', {
    originalClaim: 'We should focus on fixing bugs instead of adding new features.',
    distortions: ['oversimplification', 'false_dichotomy'],
    context: 'Software development priorities',
  });

  console.log('Pipeline Request:', JSON.stringify(pipelineRequest, null, 2));
}

// Run all examples
async function runExamples() {
  await exampleMindBalance();
  await exampleSteelman();
  await exampleStrawman();
  await exampleComposability();
  await exampleDecisionWorkflow();
}

// Export for use in other modules
export {
  exampleMindBalance,
  exampleSteelman,
  exampleStrawman,
  exampleComposability,
  exampleDecisionWorkflow,
  runExamples,
};

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}
