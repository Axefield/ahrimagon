# Ahrimagon Configuration

This is a Markdown-based configuration file for the Ahrimagon MCP service.

## Server

name: "mcp-mind-argumentation"
version: "1.0.0"
description: "MCP Mind Balance & Argumentation Service"

## Mind Balance

### Configuration
abstainThreshold: 0.70
tanClamp: 3.0
normalize: true

### Scoring
rules: ["brier", "log"]
abstentionScore: 0.0

## Argumentation

### Confidence
premiseWeight: 0.5
objectionWeight: 0.3
riskPenalty: 0.3

### Responses
detailedRationale: true
includeEvidence: true

## Tools

timeout: 30000
debug: false
maxRetries: 3

## Environments

### Development
tools.debug: true
mindBalance.abstainThreshold: 0.60

### Production
tools.debug: false

### Testing
mindBalance.abstainThreshold: 0.50
tools.timeout: 5000
