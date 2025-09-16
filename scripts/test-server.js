#!/usr/bin/env node

/**
 * Simple test script to verify the MCP server works
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function testServer() {
  console.log('🧪 Testing MCP Server...\n');

  // Build the project first
  console.log('📦 Building project...');
  const buildProcess = spawn('npm.cmd', ['run', 'build'], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  });

  await new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build successful\n');
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });

  // Test the server with a simple request
  console.log('🚀 Testing server with sample requests...\n');

  const serverProcess = spawn('node', ['dist/index.js'], {
    cwd: projectRoot,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let output = '';
  let errorOutput = '';

  serverProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  serverProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  // Send test requests
  const testRequests = [
    // Initialize
    {
      jsonrpc: '2.0',
      id: '1',
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
      },
    },
    // List tools
    {
      jsonrpc: '2.0',
      id: '2',
      method: 'tools/list',
    },
    // Test mind.balance
    {
      jsonrpc: '2.0',
      id: '3',
      method: 'tools/call',
      params: {
        name: 'mind.balance',
        arguments: {
          topic: 'Test decision',
          theta: Math.PI / 4,
          phi: Math.PI / 6,
          cosine: 0.7,
          tangent: 0.4,
          mode: 'blend',
        },
      },
    },
  ];

  // Send requests with delay
  for (let i = 0; i < testRequests.length; i++) {
    const request = testRequests[i];
    console.log(`📤 Sending request ${i + 1}: ${request.method}`);
    
    serverProcess.stdin.write(JSON.stringify(request) + '\n');
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Wait for responses
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Close the server
  serverProcess.kill();

  console.log('\n📥 Server output:');
  console.log(output);

  if (errorOutput) {
    console.log('\n⚠️  Server errors:');
    console.log(errorOutput);
  }

  // Check if we got responses
  const responses = output.trim().split('\n').filter(line => line.trim());
  console.log(`\n📊 Received ${responses.length} responses`);

  if (responses.length >= 3) {
    console.log('✅ Server test completed successfully!');
  } else {
    console.log('❌ Server test failed - insufficient responses');
    process.exit(1);
  }
}

// Run the test
testServer().catch((error) => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});
