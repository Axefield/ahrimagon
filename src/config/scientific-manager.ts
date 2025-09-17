/**
 * Ahrimagon Scientific Configuration Manager
 * Enterprise-grade configuration management with cryptographic security
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { createHash } from 'crypto';
import type { AhrimagonConfig } from './types.js';
import { configValidator, type ValidationResult } from './validator.js';
import { configEncryption, type EncryptedConfig } from './encryption.js';
import { DEFAULT_CONFIG } from './types.js';

export interface ScientificConfigOptions {
  configPath?: string;
  environment?: string;
  verifySignature?: boolean;
  publicKey?: string;
  enableEncryption?: boolean;
  encryptionPassword?: string;
  strictMode?: boolean;
  auditLogging?: boolean;
}

export interface ConfigAuditLog {
  timestamp: string;
  action: 'load' | 'save' | 'validate' | 'encrypt' | 'decrypt';
  configPath: string;
  success: boolean;
  errors?: string[];
  warnings?: string[];
  securityChecks?: string[];
  duration: number;
}

export class AhrimagonScientificConfigManager {
  private static instance: AhrimagonScientificConfigManager;
  private config: AhrimagonConfig = { ...DEFAULT_CONFIG };
  private auditLogs: ConfigAuditLog[] = [];
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AhrimagonScientificConfigManager {
    if (!AhrimagonScientificConfigManager.instance) {
      AhrimagonScientificConfigManager.instance = new AhrimagonScientificConfigManager();
    }
    return AhrimagonScientificConfigManager.instance;
  }

  /**
   * Initialize configuration with scientific rigor
   */
  async initialize(options: ScientificConfigOptions = {}): Promise<{
    success: boolean;
    config: AhrimagonConfig;
    validation: ValidationResult;
    auditLog: ConfigAuditLog;
  }> {
    const startTime = Date.now();
    const auditLog: ConfigAuditLog = {
      timestamp: new Date().toISOString(),
      action: 'load',
      configPath: options.configPath || 'auto-detected',
      success: false,
      duration: 0
    };

    try {
      // Find configuration file
      const configPath = options.configPath || this.findConfigFile();
      if (!configPath || !existsSync(configPath)) {
        throw new Error(`Configuration file not found: ${configPath}`);
      }

      auditLog.configPath = configPath;

      // Load configuration
      const rawConfig = await this.loadConfigFile(configPath, options);
      
      // Validate configuration
      const validationOptions: {
        verifySignature?: boolean;
        publicKey?: string;
        strictMode?: boolean;
      } = {
        verifySignature: options.verifySignature ?? false,
        strictMode: options.strictMode ?? false
      };
      
      if (options.publicKey) {
        validationOptions.publicKey = options.publicKey;
      }
      
      const validation = await configValidator.validateConfig(rawConfig, validationOptions);

      if (!validation.valid) {
        throw new Error(`Configuration validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      // Apply environment-specific overrides
      const finalConfig = this.applyEnvironmentOverrides(rawConfig, options.environment || 'production');
      
      // Merge with defaults
      this.config = this.deepMerge(DEFAULT_CONFIG, finalConfig);
      this.isInitialized = true;

      auditLog.success = true;
      auditLog.warnings = validation.warnings.map(w => w.message);
      auditLog.securityChecks = validation.security.map(s => s.message);

      // Log audit entry
      if (options.auditLogging !== false) {
        this.logAuditEvent(auditLog);
      }

      return {
        success: true,
        config: this.config,
        validation,
        auditLog
      };

    } catch (error) {
      auditLog.success = false;
      auditLog.errors = [error instanceof Error ? error.message : 'Unknown error'];
      
      if (options.auditLogging !== false) {
        this.logAuditEvent(auditLog);
      }

      throw error;
    } finally {
      auditLog.duration = Date.now() - startTime;
    }
  }

  /**
   * Save configuration with encryption and signature
   */
  async saveConfig(
    config: AhrimagonConfig, 
    options: ScientificConfigOptions = {}
  ): Promise<{
    success: boolean;
    filePath: string;
    signature: string;
    auditLog: ConfigAuditLog;
  }> {
    const startTime = Date.now();
    const auditLog: ConfigAuditLog = {
      timestamp: new Date().toISOString(),
      action: 'save',
      configPath: options.configPath || '.ahrimagon',
      success: false,
      duration: 0
    };

    try {
      // Add metadata
      const configWithMetadata: AhrimagonConfig = {
        ...config,
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        checksum: this.generateChecksum(config)
      };

      // Generate signature if public key provided
      let signature = '';
      if (options.publicKey) {
        signature = configValidator.generateSignature(configWithMetadata, options.publicKey);
        configWithMetadata.signature = signature;
      }

      // Encrypt if requested
      let finalConfig: any = configWithMetadata;
      if (options.enableEncryption && options.encryptionPassword) {
        const encrypted = await configEncryption.encryptConfig(
          configWithMetadata, 
          options.encryptionPassword
        );
        finalConfig = encrypted;
      }

      // Write to file
      const filePath = options.configPath || '.ahrimagon';
      writeFileSync(filePath, JSON.stringify(finalConfig, null, 2), 'utf8');

      auditLog.success = true;

      if (options.auditLogging !== false) {
        this.logAuditEvent(auditLog);
      }

      return {
        success: true,
        filePath,
        signature,
        auditLog
      };

    } catch (error) {
      auditLog.success = false;
      auditLog.errors = [error instanceof Error ? error.message : 'Unknown error'];
      
      if (options.auditLogging !== false) {
        this.logAuditEvent(auditLog);
      }

      throw error;
    } finally {
      auditLog.duration = Date.now() - startTime;
    }
  }

  /**
   * Get configuration value with type safety
   */
  getValue<T>(path: string, defaultValue: T): T {
    if (!this.isInitialized) {
      console.warn('Configuration not initialized, using default value');
      return defaultValue;
    }

    const keys = path.split('.');
    let current: any = this.config;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    
    return current !== undefined ? current : defaultValue;
  }

  /**
   * Get mind balance configuration
   */
  getMindBalanceConfig() {
    return this.config.mindBalance || {};
  }

  /**
   * Get argumentation configuration
   */
  getArgumentationConfig() {
    return this.config.argumentation || {};
  }

  /**
   * Get security configuration
   */
  getSecurityConfig() {
    return this.config.security || {};
  }

  /**
   * Get audit logs
   */
  getAuditLogs(): ConfigAuditLog[] {
    return [...this.auditLogs];
  }

  /**
   * Clear audit logs
   */
  clearAuditLogs(): void {
    this.auditLogs = [];
  }

  /**
   * Export configuration for backup
   */
  exportConfig(includeSensitive: boolean = false): AhrimagonConfig {
    const exported = { ...this.config };
    
    if (!includeSensitive) {
      // Remove sensitive fields
      delete exported.security?.encryption;
      delete exported.signature;
    }
    
    return exported;
  }

  private async loadConfigFile(
    configPath: string, 
    options: ScientificConfigOptions
  ): Promise<any> {
    const content = readFileSync(configPath, 'utf8');
    
    // Check if it's encrypted
    if (content.startsWith('{') && JSON.parse(content).encrypted) {
      if (!options.enableEncryption || !options.encryptionPassword) {
        throw new Error('Encrypted configuration requires encryption password');
      }
      
      const encryptedConfig: EncryptedConfig = JSON.parse(content);
      return await configEncryption.decryptConfig(encryptedConfig, options.encryptionPassword);
    }
    
    // Regular JSON configuration
    return JSON.parse(content);
  }

  private findConfigFile(): string | null {
    const possibleNames = ['.ahrimagon', 'ahrimagon.json', 'ahrimagon.md'];
    let currentDir = process.cwd();

    while (currentDir !== dirname(currentDir)) {
      for (const name of possibleNames) {
        const filePath = join(currentDir, name);
        if (existsSync(filePath)) {
          return filePath;
        }
      }
      currentDir = dirname(currentDir);
    }

    return null;
  }

  private applyEnvironmentOverrides(config: any, environment: string): any {
    if (!config.environments || !config.environments[environment]) {
      return config;
    }

    const envOverrides = config.environments[environment];
    return this.deepMerge(config, envOverrides);
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  private generateChecksum(config: any): string {
    const configString = JSON.stringify(config, null, 2);
    return createHash('sha256')
      .update(configString)
      .digest('hex')
      .toUpperCase();
  }

  private logAuditEvent(auditLog: ConfigAuditLog): void {
    this.auditLogs.push(auditLog);
    
    // Keep only last 1000 entries
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }
  }
}

export const scientificConfigManager = AhrimagonScientificConfigManager.getInstance();
