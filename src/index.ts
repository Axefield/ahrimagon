/**
 * MCP Mind Balance & Argumentation Service
 * Main entry point for the MCP server
 */

import { MCPServer } from './server/mcp-server.js';
import { StdioTransport } from './transports/stdio-transport.js';

// Create the MCP server
const server = new MCPServer({
  name: 'mcp-mind-argumentation',
  version: '1.0.0',
  capabilities: {
    tools: { listChanged: false },
  },
});

// Create and start the STDIO transport
const transport = new StdioTransport({ server });
transport.start();

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.error('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
