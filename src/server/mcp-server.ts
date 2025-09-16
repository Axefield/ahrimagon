/**
 * MCP Server Implementation
 * Handles JSON-RPC requests and routes them to appropriate tools
 */

import type {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcError,
  InitializeParams,
  InitializeResult,
  ToolDefinition,
  ServerCapabilities,
} from '../types/mcp.js';
import { MCP_ERROR_CODES } from '../types/mcp.js';
import { MCPTool } from '../core/mcp-command.js';
import { MindBalanceTool } from '../tools/mind-balance.js';
import { SteelmanTool, StrawmanTool, StrawmanToSteelmanTool } from '../tools/argumentation.js';

export interface MCPServerOptions {
  name: string;
  version: string;
  capabilities?: ServerCapabilities;
}

export class MCPServer {
  private tools = new Map<string, MCPTool<unknown, unknown>>();
  private initialized = false;

  constructor(private options: MCPServerOptions) {
    this.registerDefaultTools();
  }

  /**
   * Register a tool with the server
   */
  registerTool<TArgs, TResult>(tool: MCPTool<TArgs, TResult>): void {
    this.tools.set(tool.name, tool as MCPTool<unknown, unknown>);
  }

  /**
   * Handle a JSON-RPC request
   */
  async handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    try {
      switch (request.method) {
        case 'initialize':
          return this.handleInitialize(request as JsonRpcRequest<InitializeParams>);
        case 'tools/list':
          return this.handleToolsList(request);
        case 'tools/call':
          return this.handleToolsCall(request as JsonRpcRequest<{ name: string; arguments: unknown }>);
        default:
          return this.createErrorResponse(
            request.id,
            MCP_ERROR_CODES.METHOD_NOT_FOUND,
            `Unknown method: ${request.method}`,
          );
      }
    } catch (error) {
      return this.createErrorResponse(
        request.id,
        MCP_ERROR_CODES.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  /**
   * Handle initialize request
   */
  private handleInitialize(request: JsonRpcRequest<InitializeParams>): JsonRpcResponse<InitializeResult> {
    if (this.initialized) {
      throw new Error('Server already initialized');
    }

    this.initialized = true;

    const result: InitializeResult = {
      protocolVersion: '2024-11-05',
      capabilities: this.options.capabilities || {
        tools: { listChanged: false },
      },
      serverInfo: {
        name: this.options.name,
        version: this.options.version,
      },
    };

    return {
      jsonrpc: '2.0',
      id: request.id,
      result,
    };
  }

  /**
   * Handle tools/list request
   */
  private handleToolsList(request: JsonRpcRequest): JsonRpcResponse<{ tools: ToolDefinition[] }> {
    const tools: ToolDefinition[] = Array.from(this.tools.values()).map((tool) => tool.toolDefinition);

    return {
      jsonrpc: '2.0',
      id: request.id,
      result: { tools },
    };
  }

  /**
   * Handle tools/call request
   */
  private async handleToolsCall(request: JsonRpcRequest<{ name: string; arguments: unknown }>): Promise<JsonRpcResponse> {
    const { name, arguments: args } = request.params!;

    const tool = this.tools.get(name);
    if (!tool) {
      return this.createErrorResponse(
        request.id,
        MCP_ERROR_CODES.TOOL_NOT_FOUND,
        `Tool not found: ${name}`,
      );
    }

    try {
      // Validate arguments
      const validatedArgs = tool.validateArgs(args);

      // Execute tool
      const result = await tool.execute(validatedArgs);

      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          contentType: 'application/json',
          content: result,
        },
      };
    } catch (error) {
      return this.createErrorResponse(
        request.id,
        MCP_ERROR_CODES.TOOL_EXECUTION_ERROR,
        error instanceof Error ? error.message : 'Tool execution failed',
      );
    }
  }

  /**
   * Create an error response
   */
  private createErrorResponse(
    id: string | number | null,
    code: number,
    message: string,
  ): JsonRpcError {
    return {
      jsonrpc: '2.0',
      id,
      error: { code, message },
    };
  }

  /**
   * Register default tools
   */
  private registerDefaultTools(): void {
    this.registerTool(new MindBalanceTool());
    this.registerTool(new SteelmanTool());
    this.registerTool(new StrawmanTool());
    this.registerTool(new StrawmanToSteelmanTool());
  }

  /**
   * Get all registered tools
   */
  getRegisteredTools(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.toolDefinition);
  }

  /**
   * Check if server is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}
