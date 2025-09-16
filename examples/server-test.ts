/**
 * Example server testing and validation
 * Demonstrates how to test the MCP server directly
 */

import { MCPServer } from '../src/server/mcp-server.js';
import type { JsonRpcRequest } from '../src/types/mcp.js';

async function testServer() {
  console.log('=== MCP Server Test ===');

  // Create server
  const server = new MCPServer({
    name: 'test-server',
    version: '1.0.0',
  });

  // Test 1: Initialize
  console.log('\n1. Testing initialization...');
  const initRequest: JsonRpcRequest = {
    jsonrpc: '2.0',
    id: '1',
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0',
      },
    },
  };

  const initResponse = await server.handleRequest(initRequest);
  console.log('Initialize response:', JSON.stringify(initResponse, null, 2));

  // Test 2: List tools
  console.log('\n2. Testing tools/list...');
  const listRequest: JsonRpcRequest = {
    jsonrpc: '2.0',
    id: '2',
    method: 'tools/list',
  };

  const listResponse = await server.handleRequest(listRequest);
  console.log('Tools list response:', JSON.stringify(listResponse, null, 2));

  // Test 3: Call mind.balance tool
  console.log('\n3. Testing mind.balance tool...');
  const mindBalanceRequest: JsonRpcRequest = {
    jsonrpc: '2.0',
    id: '3',
    method: 'tools/call',
    params: {
      name: 'mind.balance',
      arguments: {
        topic: 'Should we implement this feature?',
        theta: Math.PI / 4,
        phi: Math.PI / 6,
        cosine: 0.7,
        tangent: 0.4,
        mode: 'blend',
      },
    },
  };

  const mindBalanceResponse = await server.handleRequest(mindBalanceRequest);
  console.log('Mind balance response:', JSON.stringify(mindBalanceResponse, null, 2));

  // Test 4: Call argument.steelman tool
  console.log('\n4. Testing argument.steelman tool...');
  const steelmanRequest: JsonRpcRequest = {
    jsonrpc: '2.0',
    id: '4',
    method: 'tools/call',
    params: {
      name: 'argument.steelman',
      arguments: {
        opponentClaim: 'This approach is too risky.',
        context: 'Software development',
        requestImprovedFormulation: true,
      },
    },
  };

  const steelmanResponse = await server.handleRequest(steelmanRequest);
  console.log('Steelman response:', JSON.stringify(steelmanResponse, null, 2));

  // Test 5: Call argument.strawman tool
  console.log('\n5. Testing argument.strawman tool...');
  const strawmanRequest: JsonRpcRequest = {
    jsonrpc: '2.0',
    id: '5',
    method: 'tools/call',
    params: {
      name: 'argument.strawman',
      arguments: {
        originalClaim: 'We should be more careful with this decision.',
        requestRefutation: true,
      },
    },
  };

  const strawmanResponse = await server.handleRequest(strawmanRequest);
  console.log('Strawman response:', JSON.stringify(strawmanResponse, null, 2));

  // Test 6: Error handling
  console.log('\n6. Testing error handling...');
  const errorRequest: JsonRpcRequest = {
    jsonrpc: '2.0',
    id: '6',
    method: 'tools/call',
    params: {
      name: 'nonexistent.tool',
      arguments: {},
    },
  };

  const errorResponse = await server.handleRequest(errorRequest);
  console.log('Error response:', JSON.stringify(errorResponse, null, 2));

  console.log('\n=== Server Test Complete ===');
}

// Run the test
testServer().catch(console.error);
