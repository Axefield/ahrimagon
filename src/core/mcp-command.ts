/**
 * Generic MCP command builder and response parser
 */

import type { JsonRpcRequest, JsonRpcResponse, ToolsCallParams, ToolsCallResult } from '../types/mcp.js';

export class MCPCommand<TArgs, TResult> {
  constructor(public readonly toolName: string) {}

  /**
   * Build a JSON-RPC request for calling this tool
   */
  buildRequest(id: string | number, args: TArgs): JsonRpcRequest<ToolsCallParams<TArgs>> {
    return {
      jsonrpc: '2.0',
      id,
      method: 'tools/call',
      params: {
        name: this.toolName,
        arguments: args,
      },
    };
  }

  /**
   * Parse and validate a server response
   */
  parseResponse(resp: JsonRpcResponse<ToolsCallResult<TResult>>): TResult {
    if ('error' in resp) {
      const { code, message } = resp.error;
      throw new Error(`MCP tool error (${code}): ${message}`);
    }

    // Validate content type
    if (resp.result.contentType !== 'application/json') {
      throw new Error(`Unexpected content type: ${resp.result.contentType}`);
    }

    return resp.result.content;
  }

  /**
   * Validate arguments against a schema (client-side validation)
   */
  validateArgs(args: unknown): TArgs {
    // This is a placeholder - in a real implementation, you'd use a JSON Schema validator
    // like ajv or zod for runtime validation
    return args as TArgs;
  }
}

/**
 * Base class for MCP tool implementations
 */
export abstract class MCPTool<TArgs, TResult> {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly inputSchema: Record<string, unknown>;

  /**
   * Get the tool definition for registration
   */
  get toolDefinition() {
    return {
      name: this.name,
      description: this.description,
      inputSchema: this.inputSchema,
    };
  }

  /**
   * Execute the tool with the given arguments
   */
  abstract execute(args: TArgs): Promise<TResult>;

  /**
   * Validate arguments before execution
   */
  validateArgs(args: unknown): TArgs {
    // Override in subclasses for specific validation logic
    return args as TArgs;
  }
}
