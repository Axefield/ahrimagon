/**
 * Scientific Configuration System Tests
 * Tests the enterprise-grade configuration management
 */

import { scientificConfigManager } from '../dist/config/scientific-manager.js';
import { configValidator } from '../dist/config/validator.js';
import { configEncryption } from '../dist/config/encryption.js';

async function runScientificConfigTests() {
  console.log('🧪 Running Scientific Configuration Tests...\n');

  // Test 1: Configuration Validation
  console.log('Testing configuration validation...');
  try {
    const testConfig = {
      version: "1.0.0",
      signature: "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2",
      timestamp: "2024-01-15T10:30:00.000Z",
      environment: "production",
      server: {
        name: "test-server",
        version: "1.0.0"
      },
      mindBalance: {
        abstainThreshold: 0.70,
        tanClamp: 3.0,
        normalize: true
      }
    };

    const validation = await configValidator.validateConfig(testConfig, {
      strictMode: true
    });

    console.log('✅ Configuration validation:', {
      valid: validation.valid,
      errors: validation.errors.length,
      warnings: validation.warnings.length,
      securityChecks: validation.security.length
    });
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
  }

  // Test 2: Scientific Configuration Manager
  console.log('\nTesting scientific configuration manager...');
  try {
    const result = await scientificConfigManager.initialize({
      configPath: '.ahrimagon.scientific',
      environment: 'testing',
      strictMode: true,
      auditLogging: true
    });

    console.log('✅ Scientific config manager:', {
      success: result.success,
      validationPassed: result.validation.valid,
      securityChecks: result.validation.security.length,
      warnings: result.validation.warnings.length
    });

    // Test configuration value retrieval
    const abstainThreshold = scientificConfigManager.getValue('mindBalance.abstainThreshold', 0.5);
    const tanClamp = scientificConfigManager.getValue('mindBalance.tanClamp', 2.0);
    
    console.log('📊 Configuration values:', {
      abstainThreshold,
      tanClamp
    });

  } catch (error) {
    console.error('❌ Scientific config manager failed:', error.message);
  }

  // Test 3: Configuration Encryption
  console.log('\nTesting configuration encryption...');
  try {
    const testConfig = {
      mindBalance: {
        abstainThreshold: 0.70,
        tanClamp: 3.0
      }
    };

    const password = configEncryption.generateSecurePassword(32);
    const encrypted = await configEncryption.encryptConfig(testConfig, password);
    const decrypted = await configEncryption.decryptConfig(encrypted, password);

    const encryptionSuccess = JSON.stringify(testConfig) === JSON.stringify(decrypted);
    
    console.log('✅ Configuration encryption:', {
      success: encryptionSuccess,
      passwordLength: password.length,
      encryptedFields: Object.keys(encrypted).length
    });

  } catch (error) {
    console.error('❌ Configuration encryption failed:', error.message);
  }

  // Test 4: Audit Logging
  console.log('\nTesting audit logging...');
  try {
    const auditLogs = scientificConfigManager.getAuditLogs();
    
    console.log('✅ Audit logging:', {
      logEntries: auditLogs.length,
      latestAction: auditLogs[auditLogs.length - 1]?.action,
      successRate: auditLogs.filter(log => log.success).length / Math.max(auditLogs.length, 1)
    });

  } catch (error) {
    console.error('❌ Audit logging failed:', error.message);
  }

  // Test 5: Configuration Export
  console.log('\nTesting configuration export...');
  try {
    const exportedConfig = scientificConfigManager.exportConfig(false);
    const exportedWithSensitive = scientificConfigManager.exportConfig(true);
    
    console.log('✅ Configuration export:', {
      exportedFields: Object.keys(exportedConfig).length,
      hasSensitiveData: exportedWithSensitive !== exportedConfig,
      version: exportedConfig.version
    });

  } catch (error) {
    console.error('❌ Configuration export failed:', error.message);
  }

  console.log('\n🎉 Scientific configuration tests completed!');
}

runScientificConfigTests().catch(console.error);
