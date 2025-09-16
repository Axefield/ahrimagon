/**
 * STDIO Transport for MCP Server
 * Handles communication via standard input/output streams
 */

import { MCPServer } from '../server/mcp-server.js';
import type { JsonRpcRequest, JsonRpcResponse } from '../types/mcp.js';

export interface StdioTransportOptions {
  server: MCPServer;
  inputStream?: NodeJS.ReadableStream;
  outputStream?: NodeJS.WritableStream;
}

export class StdioTransport {
  private buffer = '';

  constructor(private options: StdioTransportOptions) {
    this.setupInputHandling();
  }

  /**
   * Start the transport
   */
  start(): void {
    console.error('MCP Server started on STDIO');
  }

  /**
   * Send a response
   */
  private sendResponse(response: JsonRpcResponse): void {
    const output = this.options.outputStream || process.stdout;
    output.write(JSON.stringify(response) + '\n');
  }

  /**
   * Setup input handling
   */
  private setupInputHandling(): void {
    const input = this.options.inputStream || process.stdin;
    
    input.setEncoding('utf8');
    
    input.on('data', (chunk: string) => {
      this.buffer += chunk;
      this.processBuffer();
    });

    input.on('end', () => {
      console.error('Input stream ended');
      process.exit(0);
    });

    input.on('error', (error: Error) => {
      console.error('Input stream error:', error);
      process.exit(1);
    });
  }

  /**
   * Process the input buffer
   */
  private async processBuffer(): Promise<void> {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.trim()) {
        try {
          const request: JsonRpcRequest = JSON.parse(line);
          const response = await this.options.server.handleRequest(request);
          this.sendResponse(response);
        } catch (error) {
          console.error('Error processing request:', error);
          this.sendResponse({
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32700, // Parse error
              message: 'Invalid JSON',
            },
          });
        }
      }
    }
  }
}
