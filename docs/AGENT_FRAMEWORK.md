# Agent Framework Technical Documentation

## Table of Contents
- [Framework Architecture](#framework-architecture)
- [Agent Orchestration System](#agent-orchestration-system)
- [Communication Protocols](#communication-protocols)
- [Data Flow and State Management](#data-flow-and-state-management)
- [Error Handling and Recovery](#error-handling-and-recovery)
- [Performance Considerations](#performance-considerations)
- [Extension Points](#extension-points)

---

## Framework Architecture

### System Overview

The Multi-Agent SDLC Framework is built on a modular, event-driven architecture where specialized agents collaborate to deliver software projects. The framework implements a strict state machine workflow with human approval gates at critical decision points.

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR LAYER                        │
│  - Agent Registry Management                                 │
│  - Workflow State Machine                                    │
│  - Approval Gate Controller                                  │
│  - PROJECT_KNOWLEDGE.md (SSOT) Manager                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
┌────────▼────────┐  ┌──────▼─────────┐
│  AGENT LAYER    │  │  HUMAN LAYER   │
│                 │  │                │
│ • BA Agent      │  │ • Approval     │
│ • Architect     │  │   Gates        │
│ • Planner       │  │ • Requirement  │
│ • Dev Swarm     │  │   Input        │
│ • QA Agent      │  │ • Reviews      │
│ • Security      │  │                │
└────────┬────────┘  └──────┬─────────┘
         │                   │
         └─────────┬─────────┘
                   │
         ┌─────────▼─────────┐
         │  PERSISTENCE       │
         │                    │
         │ • MongoDB          │
         │ • File System      │
         │ • Git Repository   │
         └────────────────────┘
```

### Core Components

#### 1. Orchestrator (`orchestrator.js`)

The central controller that manages the entire SDLC workflow.

**Responsibilities**:
- Agent lifecycle management
- State transition control
- Approval gate enforcement
- Error handling and recovery
- Execution history tracking

**Key Data Structures**:
```javascript
const AGENT_REGISTRY = {
  [agentId]: {
    id: string,
    role: string,
    responsibilities: string[],
    canTransitionTo: string[],
    instructionFile: string
  }
};

const WORKFLOW_STATES = {
  [stateName]: {
    agent: string,
    description: string,
    nextState: string,
    requiresApproval: boolean,
    approvalType?: string,
    loopCondition?: string
  }
};
```

#### 2. Agent Layer

Six specialized agents, each with distinct responsibilities:

| Agent ID | Role | Input | Output |
|----------|------|-------|--------|
| `01_Requirement_Agent` | Business Analyst | Human requirements | User stories, acceptance criteria |
| `02_System_Architect` | System Designer | User stories | ERD, API contracts, tech stack |
| `03_Implementation_Planner` | Sprint Planner | Architecture | Task breakdown, estimates |
| `04_FullStack_Dev_Swarm` | Developers | Task list | Source code, components |
| `05_Quality_Assurance` | QA Engineer | Source code | Test results, coverage reports |
| `06_Security_Sentinel` | Security Auditor | Source code | Vulnerability report |

#### 3. Single Source of Truth (SSOT)

`PROJECT_KNOWLEDGE.md` serves as the authoritative source for all project information.

**Structure**:
```markdown
# Project Knowledge Base

## PROJECT_METADATA
- Project Name
- Version
- Last Updated
- Current Phase

## BUSINESS_REQUIREMENTS
- User Stories
- Acceptance Criteria
- Non-Functional Requirements

## TECHNICAL_ARCHITECTURE
- Database Schema
- API Contracts
- Technology Stack

## IMPLEMENTATION_PLAN
- Sprint Breakdown
- Task List
- Dependencies

## TEST_COVERAGE
- Unit Test Results
- Integration Test Results
- Coverage Metrics

## SECURITY_AUDIT
- Vulnerability Scan Results
- Security Recommendations
```

---

## Agent Orchestration System

### Workflow State Machine

The orchestrator implements a finite state machine (FSM) to manage workflow transitions.

```
┌─────────────┐
│  DISCOVERY  │ (BA Agent)
└──────┬──────┘
       │
       ▼
┌──────────────┐
│ ARCHITECTURE │ (Architect Agent)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   PLANNING   │ (Planner Agent)
└──────┬───────┘
       │
       ▼  [APPROVAL GATE #1]
       │
┌──────────────┐
│  EXECUTION   │ (Dev Swarm)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  VALIDATION  │◄──┐ (QA Agent)
└──────┬───────┘   │
       │           │
       ├───────────┘ (Loop if tests fail)
       │
       ▼
┌────────────────┐
│ SECURITY_AUDIT │ (Security Sentinel)
└──────┬─────────┘
       │
       ▼  [APPROVAL GATE #2]
       │
┌──────────────┐
│   COMPLETE   │
└──────────────┘
```

### State Transition Logic

```javascript
class Orchestrator {
  /**
   * Validate state transition
   * @param {string} fromState - Current state
   * @param {string} toState - Target state
   * @returns {boolean} Whether transition is allowed
   */
  canTransition(fromState, toState) {
    const currentState = WORKFLOW_STATES[fromState];
    
    // Check if next state is valid
    if (currentState.nextState !== toState) {
      // Allow loop back for VALIDATION state
      if (fromState === 'VALIDATION' && toState === 'EXECUTION') {
        return true; // Loop back if tests fail
      }
      return false;
    }
    
    // Check if approval is required
    if (currentState.requiresApproval) {
      return this.checkApprovalStatus(currentState.approvalType);
    }
    
    return true;
  }
  
  /**
   * Execute state transition
   * @param {string} nextState - Target state
   */
  async transition(nextState) {
    const currentState = this.currentState;
    
    if (!this.canTransition(currentState, nextState)) {
      throw new Error(`Invalid transition from ${currentState} to ${nextState}`);
    }
    
    // Log transition
    this.executionHistory.push({
      from: currentState,
      to: nextState,
      timestamp: new Date().toISOString(),
      agent: WORKFLOW_STATES[nextState].agent
    });
    
    // Update current state
    this.currentState = nextState;
    this.currentAgent = AGENT_REGISTRY[WORKFLOW_STATES[nextState].agent];
    
    // Emit state change event
    this.emit('stateChange', { from: currentState, to: nextState });
  }
}
```

### Agent Activation

```javascript
/**
 * Activate an agent for execution
 * @param {string} agentId - Agent identifier
 * @returns {Promise<Agent>} Activated agent instance
 */
async activateAgent(agentId) {
  const agentConfig = AGENT_REGISTRY[agentId];
  
  if (!agentConfig) {
    throw new Error(`Unknown agent: ${agentId}`);
  }
  
  console.log(`\n✓ Activating: ${agentConfig.role}`);
  console.log(`📋 Responsibilities:`);
  agentConfig.responsibilities.forEach(r => console.log(`   - ${r}`));
  
  // Load agent instructions
  const instructions = await this.loadAgentInstructions(agentConfig.instructionFile);
  
  // Initialize agent context
  const agentContext = {
    config: agentConfig,
    instructions: instructions,
    projectKnowledge: await this.loadProjectKnowledge(),
    workingDirectory: process.cwd(),
    previousAgent: this.currentAgent
  };
  
  return agentContext;
}

/**
 * Deactivate current agent and prepare handover
 * @param {Object} handoverData - Data to pass to next agent
 */
async deactivateAgent(handoverData) {
  if (!this.currentAgent) {
    return;
  }
  
  // Update PROJECT_KNOWLEDGE.md with agent's work
  await this.updateProjectKnowledge(handoverData);
  
  // Log handover
  console.log(`\n✓ ${this.currentAgent.role} completed`);
  console.log(`📝 Updated PROJECT_KNOWLEDGE.md`);
  
  // Commit changes
  await this.commitChanges(
    `[${this.currentAgent.id}] ${handoverData.commitMessage}`
  );
}
```

---

## Communication Protocols

### Inter-Agent Communication

Agents communicate through a structured message format stored in `PROJECT_KNOWLEDGE.md`.

#### Message Structure

```typescript
interface AgentMessage {
  from: AgentId;
  to: AgentId;
  timestamp: ISO8601String;
  phase: WorkflowState;
  messageType: 'HANDOVER' | 'QUERY' | 'NOTIFICATION' | 'ERROR';
  payload: {
    summary: string;
    details: object;
    filesModified: string[];
    decisions: Decision[];
    blockers: Blocker[];
  };
  acknowledgment?: {
    acknowledged: boolean;
    acknowledgedBy: AgentId;
    acknowledgedAt: ISO8601String;
  };
}
```

#### Handover Protocol

```javascript
/**
 * Agent handover protocol
 */
class HandoverProtocol {
  /**
   * Prepare handover package
   * @param {string} nextAgentId - Target agent
   * @param {Object} data - Handover data
   */
  async prepareHandover(nextAgentId, data) {
    const handoverPackage = {
      from: this.currentAgent.id,
      to: nextAgentId,
      timestamp: new Date().toISOString(),
      phase: this.currentState,
      messageType: 'HANDOVER',
      payload: {
        summary: data.summary,
        details: data.details,
        filesModified: await this.getModifiedFiles(),
        decisions: data.decisions || [],
        blockers: data.blockers || [],
        metadata: {
          executionTime: data.executionTime,
          resourcesUsed: data.resourcesUsed
        }
      }
    };
    
    // Validate handover package
    this.validateHandover(handoverPackage);
    
    // Write to PROJECT_KNOWLEDGE.md
    await this.writeHandoverMessage(handoverPackage);
    
    return handoverPackage;
  }
  
  /**
   * Validate handover package
   */
  validateHandover(handover) {
    const required = ['from', 'to', 'payload'];
    
    for (const field of required) {
      if (!handover[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Check if target agent exists
    if (!AGENT_REGISTRY[handover.to]) {
      throw new Error(`Unknown target agent: ${handover.to}`);
    }
    
    // Check if transition is allowed
    const currentAgent = AGENT_REGISTRY[handover.from];
    if (!currentAgent.canTransitionTo.includes(handover.to)) {
      throw new Error(
        `Agent ${handover.from} cannot transition to ${handover.to}`
      );
    }
  }
}
```

### Human-Agent Communication

#### Approval Gate Protocol

```javascript
/**
 * Approval gate implementation
 */
class ApprovalGate {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.approvalQueue = [];
  }
  
  /**
   * Request human approval
   * @param {string} approvalType - Type of approval needed
   * @param {Object} context - Context for approval decision
   * @returns {Promise<ApprovalResult>}
   */
  async requestApproval(approvalType, context) {
    const approvalRequest = {
      id: `APPROVAL_${Date.now()}`,
      type: approvalType,
      context: context,
      requestedAt: new Date().toISOString(),
      requestedBy: this.orchestrator.currentAgent.id,
      status: 'PENDING',
      priority: this.determineApprovalPriority(approvalType)
    };
    
    // Add to queue
    this.approvalQueue.push(approvalRequest);
    
    // Display approval request
    this.displayApprovalRequest(approvalRequest);
    
    // Wait for human response
    const response = await this.waitForHumanResponse(approvalRequest.id);
    
    // Update approval request
    approvalRequest.status = response.approved ? 'APPROVED' : 'REJECTED';
    approvalRequest.approvedBy = response.approver;
    approvalRequest.approvedAt = new Date().toISOString();
    approvalRequest.feedback = response.feedback;
    
    // Log approval decision
    await this.logApprovalDecision(approvalRequest);
    
    if (!response.approved) {
      throw new ApprovalRejectedError(
        `Approval rejected: ${response.reason}`
      );
    }
    
    return approvalRequest;
  }
  
  /**
   * Determine approval priority
   */
  determineApprovalPriority(approvalType) {
    const priorities = {
      'SECURITY': 1,  // Highest priority
      'PLAN': 2,
      'ARCHITECTURE': 3
    };
    return priorities[approvalType] || 10;
  }
}
```

---

## Data Flow and State Management

### Data Flow Architecture

```
┌─────────────┐
│   Human     │
│   Input     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│  BA Agent                │
│  - Captures requirements │
│  - Creates user stories  │
└──────┬───────────────────┘
       │
       ▼ (Writes to)
┌──────────────────────────┐
│  PROJECT_KNOWLEDGE.md    │◄─────────────┐
│  (SSOT)                  │              │
└──────┬───────────────────┘              │
       │ (Reads from)                     │
       ▼                                  │
┌──────────────────────────┐              │
│  Architect Agent         │              │
│  - Designs schema        │              │
│  - Defines APIs          │──────────────┘
└──────┬───────────────────┘       (Writes to)
       │
       ▼
┌──────────────────────────┐
│  [Subsequent Agents...]  │
└──────────────────────────┘
```

### State Persistence

```javascript
/**
 * State persistence manager
 */
class StatePersistence {
  constructor() {
    this.stateFile = path.join(__dirname, '.orchestrator-state.json');
  }
  
  /**
   * Save current orchestrator state
   */
  async saveState(orchestrator) {
    const state = {
      currentState: orchestrator.currentState,
      currentAgent: orchestrator.currentAgent?.id,
      executionHistory: orchestrator.executionHistory,
      approvalQueue: orchestrator.approvalQueue,
      timestamp: new Date().toISOString(),
      checksum: this.calculateChecksum(orchestrator)
    };
    
    await fs.promises.writeFile(
      this.stateFile,
      JSON.stringify(state, null, 2)
    );
  }
  
  /**
   * Restore orchestrator state
   */
  async restoreState(orchestrator) {
    try {
      const stateData = await fs.promises.readFile(this.stateFile, 'utf-8');
      const state = JSON.parse(stateData);
      
      // Validate checksum
      if (!this.validateChecksum(state)) {
        throw new Error('State file corrupted');
      }
      
      // Restore state
      orchestrator.currentState = state.currentState;
      orchestrator.currentAgent = AGENT_REGISTRY[state.currentAgent];
      orchestrator.executionHistory = state.executionHistory;
      orchestrator.approvalQueue = state.approvalQueue;
      
      console.log('✓ State restored from checkpoint');
      return true;
    } catch (error) {
      console.log('⚠️  No previous state found, starting fresh');
      return false;
    }
  }
  
  /**
   * Calculate state checksum for integrity verification
   */
  calculateChecksum(orchestrator) {
    const crypto = require('crypto');
    const data = JSON.stringify({
      state: orchestrator.currentState,
      agent: orchestrator.currentAgent?.id,
      historyLength: orchestrator.executionHistory.length
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
```

### PROJECT_KNOWLEDGE.md Management

```javascript
/**
 * PROJECT_KNOWLEDGE.md manager
 */
class ProjectKnowledgeManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.lockFile = `${filePath}.lock`;
  }
  
  /**
   * Update section in PROJECT_KNOWLEDGE.md
   * @param {string} section - Section name
   * @param {string} content - New content
   */
  async updateSection(section, content) {
    // Acquire lock
    await this.acquireLock();
    
    try {
      // Read current content
      let knowledge = await fs.promises.readFile(this.filePath, 'utf-8');
      
      // Find section
      const sectionRegex = new RegExp(`## ${section}[\\s\\S]*?(?=## |$)`, 'g');
      
      const newSection = `## ${section}\n${content}\n\n`;
      
      if (sectionRegex.test(knowledge)) {
        // Replace existing section
        knowledge = knowledge.replace(sectionRegex, newSection);
      } else {
        // Append new section
        knowledge += `\n${newSection}`;
      }
      
      // Write back
      await fs.promises.writeFile(this.filePath, knowledge);
      
      // Update version history
      await this.recordChange(section, content);
      
    } finally {
      // Release lock
      await this.releaseLock();
    }
  }
  
  /**
   * Read section from PROJECT_KNOWLEDGE.md
   */
  async readSection(section) {
    const knowledge = await fs.promises.readFile(this.filePath, 'utf-8');
    const sectionRegex = new RegExp(`## ${section}([\\s\\S]*?)(?=## |$)`, 'g');
    const match = sectionRegex.exec(knowledge);
    return match ? match[1].trim() : null;
  }
  
  /**
   * Lock file to prevent concurrent writes
   */
  async acquireLock() {
    while (await this.isLocked()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await fs.promises.writeFile(this.lockFile, process.pid.toString());
  }
  
  /**
   * Release lock
   */
  async releaseLock() {
    try {
      await fs.promises.unlink(this.lockFile);
    } catch (error) {
      // Lock file doesn't exist, ignore
    }
  }
  
  /**
   * Check if file is locked
   */
  async isLocked() {
    try {
      await fs.promises.access(this.lockFile);
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## Error Handling and Recovery

### Error Classification

```javascript
/**
 * Error hierarchy for the framework
 */
class FrameworkError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

class AgentError extends FrameworkError {
  constructor(message, agentId) {
    super(message, 'AGENT_ERROR');
    this.agentId = agentId;
  }
}

class StateTransitionError extends FrameworkError {
  constructor(from, to, reason) {
    super(`Invalid transition from ${from} to ${to}: ${reason}`, 'STATE_ERROR');
    this.fromState = from;
    this.toState = to;
  }
}

class ApprovalRejectedError extends FrameworkError {
  constructor(message) {
    super(message, 'APPROVAL_REJECTED');
    this.recoverable = true;
  }
}

class ValidationError extends FrameworkError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }
}
```

### Recovery Strategies

```javascript
/**
 * Error recovery manager
 */
class RecoveryManager {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.maxRetries = 3;
    this.retryDelay = 1000; // ms
  }
  
  /**
   * Handle error with recovery strategy
   */
  async handleError(error, context) {
    console.error(`\n❌ Error: ${error.message}`);
    
    // Classify error
    const strategy = this.selectRecoveryStrategy(error);
    
    // Execute recovery
    try {
      await strategy.recover(error, context);
    } catch (recoveryError) {
      console.error(`\n❌ Recovery failed: ${recoveryError.message}`);
      throw recoveryError;
    }
  }
  
  /**
   * Select appropriate recovery strategy
   */
  selectRecoveryStrategy(error) {
    if (error instanceof ApprovalRejectedError) {
      return new ApprovalRejectedRecovery(this.orchestrator);
    } else if (error instanceof StateTransitionError) {
      return new StateRollbackRecovery(this.orchestrator);
    } else if (error instanceof AgentError) {
      return new AgentRestartRecovery(this.orchestrator);
    } else {
      return new DefaultRecovery(this.orchestrator);
    }
  }
}

/**
 * Recovery strategy for approval rejection
 */
class ApprovalRejectedRecovery {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
  }
  
  async recover(error, context) {
    console.log('\n🔄 Initiating approval rejection recovery...');
    
    // Roll back to previous state
    const previousState = this.orchestrator.executionHistory[
      this.orchestrator.executionHistory.length - 2
    ];
    
    if (previousState) {
      console.log(`↩️  Rolling back to ${previousState.to} state`);
      await this.orchestrator.transition(previousState.to);
      
      // Request feedback
      console.log('📝 Please provide feedback for the agent to address:');
      // ... handle feedback collection
    } else {
      throw new Error('Cannot recover: no previous state available');
    }
  }
}

/**
 * Recovery strategy for state transition errors
 */
class StateRollbackRecovery {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
  }
  
  async recover(error, context) {
    console.log('\n🔄 Rolling back to last valid state...');
    
    // Restore from last checkpoint
    const persistence = new StatePersistence();
    const restored = await persistence.restoreState(this.orchestrator);
    
    if (restored) {
      console.log('✓ State restored successfully');
    } else {
      throw new Error('Cannot restore state: no checkpoint available');
    }
  }
}

/**
 * Agent restart recovery
 */
class AgentRestartRecovery {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.maxRetries = 3;
    this.currentRetry = 0;
  }
  
  async recover(error, context) {
    if (this.currentRetry >= this.maxRetries) {
      throw new Error(`Agent ${error.agentId} failed after ${this.maxRetries} retries`);
    }
    
    this.currentRetry++;
    console.log(`\n🔄 Restarting agent (attempt ${this.currentRetry}/${this.maxRetries})...`);
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000 * this.currentRetry));
    
    // Reactivate agent
    await this.orchestrator.activateAgent(error.agentId);
  }
}
```

---

## Performance Considerations

### Optimization Strategies

#### 1. Lazy Loading Agent Instructions

```javascript
/**
 * Lazy load agent instructions
 */
class AgentInstructionLoader {
  constructor() {
    this.cache = new Map();
  }
  
  async load(instructionFile) {
    // Check cache first
    if (this.cache.has(instructionFile)) {
      return this.cache.get(instructionFile);
    }
    
    // Load from disk
    const instructions = await fs.promises.readFile(instructionFile, 'utf-8');
    
    // Cache for future use
    this.cache.set(instructionFile, instructions);
    
    return instructions;
  }
  
  clearCache() {
    this.cache.clear();
  }
}
```

#### 2. Parallel Agent Execution (Future Enhancement)

```javascript
/**
 * Parallel execution for independent tasks
 */
class ParallelExecutionManager {
  /**
   * Execute multiple agents in parallel when possible
   */
  async executeParallel(agents, context) {
    const independentAgents = this.identifyIndependentAgents(agents);
    
    const results = await Promise.allSettled(
      independentAgents.map(agent => this.executeAgent(agent, context))
    );
    
    // Handle results
    const succeeded = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');
    
    if (failed.length > 0) {
      console.warn(`⚠️  ${failed.length} agents failed`);
      // ... handle failures
    }
    
    return succeeded.map(r => r.value);
  }
  
  /**
   * Identify agents that can run in parallel
   */
  identifyIndependentAgents(agents) {
    // Example: Backend and Frontend dev agents can work in parallel
    // if they have clear API contracts
    return agents.filter(agent => !agent.hasBlockingDependencies);
  }
}
```

#### 3. Incremental Updates

```javascript
/**
 * Incremental PROJECT_KNOWLEDGE.md updates
 */
class IncrementalUpdateManager {
  /**
   * Update only changed sections
   */
  async updateIncremental(section, newContent) {
    const currentContent = await this.readSection(section);
    
    // Calculate diff
    const diff = this.calculateDiff(currentContent, newContent);
    
    // Apply only changes
    if (diff.length < newContent.length / 2) {
      // If diff is smaller, apply patch
      await this.applyPatch(section, diff);
    } else {
      // Otherwise, replace entire section
      await this.replaceSection(section, newContent);
    }
  }
}
```

### Performance Monitoring

```javascript
/**
 * Performance metrics collector
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
  }
  
  /**
   * Record agent execution time
   */
  recordAgentExecution(agentId, duration, memoryUsed) {
    this.metrics.push({
      agentId,
      duration,
      memoryUsed,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Generate performance report
   */
  generateReport() {
    const report = {
      totalExecutionTime: this.metrics.reduce((sum, m) => sum + m.duration, 0),
      averageMemoryUsage: this.metrics.reduce((sum, m) => sum + m.memoryUsed, 0) / this.metrics.length,
      agentPerformance: {}
    };
    
    // Group by agent
    for (const metric of this.metrics) {
      if (!report.agentPerformance[metric.agentId]) {
        report.agentPerformance[metric.agentId] = {
          executions: 0,
          totalTime: 0,
          avgTime: 0
        };
      }
      
      const agentMetric = report.agentPerformance[metric.agentId];
      agentMetric.executions++;
      agentMetric.totalTime += metric.duration;
      agentMetric.avgTime = agentMetric.totalTime / agentMetric.executions;
    }
    
    return report;
  }
}
```

---

## Extension Points

### Adding Custom Agents

```javascript
/**
 * Register a custom agent
 */
function registerCustomAgent(config) {
  // Validate agent configuration
  validateAgentConfig(config);
  
  // Add to registry
  AGENT_REGISTRY[config.id] = {
    id: config.id,
    role: config.role,
    responsibilities: config.responsibilities,
    canTransitionTo: config.canTransitionTo || [],
    instructionFile: config.instructionFile,
    customHooks: config.hooks || {}
  };
  
  console.log(`✓ Registered custom agent: ${config.id}`);
}

/**
 * Example: Register a deployment agent
 */
registerCustomAgent({
  id: '07_Deployment_Agent',
  role: 'DevOps Engineer',
  responsibilities: [
    'Deploy backend to cloud platform',
    'Deploy frontend to CDN',
    'Configure CI/CD pipeline',
    'Monitor application health'
  ],
  canTransitionTo: [],
  instructionFile: '.agent-config/07_Deployment_Agent.md',
  hooks: {
    beforeExecution: async (context) => {
      // Pre-deployment checks
      console.log('Running pre-deployment checks...');
    },
    afterExecution: async (context) => {
      // Post-deployment verification
      console.log('Verifying deployment...');
    }
  }
});
```

### Custom Workflow States

```javascript
/**
 * Add custom workflow state
 */
function addWorkflowState(stateName, config) {
  WORKFLOW_STATES[stateName] = {
    agent: config.agent,
    description: config.description,
    nextState: config.nextState,
    requiresApproval: config.requiresApproval || false,
    approvalType: config.approvalType,
    customValidation: config.validation
  };
  
  console.log(`✓ Added workflow state: ${stateName}`);
}

/**
 * Example: Add performance optimization state
 */
addWorkflowState('OPTIMIZATION', {
  agent: 'PERFORMANCE_AGENT',
  description: 'Performance optimization and benchmarking',
  nextState: 'COMPLETE',
  requiresApproval: false,
  validation: async (context) => {
    // Custom validation logic
    return context.performanceScore > 80;
  }
});
```

### Hooks and Middleware

```javascript
/**
 * Middleware system for orchestrator
 */
class OrchestatorMiddleware {
  constructor() {
    this.middleware = [];
  }
  
  /**
   * Register middleware
   */
  use(fn) {
    this.middleware.push(fn);
  }
  
  /**
   * Execute middleware chain
   */
  async execute(context, next) {
    let index = 0;
    
    const dispatch = async (i) => {
      if (i >= this.middleware.length) {
        return next();
      }
      
      const fn = this.middleware[i];
      await fn(context, () => dispatch(i + 1));
    };
    
    await dispatch(0);
  }
}

/**
 * Example middleware: Logging
 */
orchestrator.use(async (context, next) => {
  console.log(`[${context.agent.id}] Starting execution`);
  const start = Date.now();
  
  await next();
  
  const duration = Date.now() - start;
  console.log(`[${context.agent.id}] Completed in ${duration}ms`);
});

/**
 * Example middleware: Error tracking
 */
orchestrator.use(async (context, next) => {
  try {
    await next();
  } catch (error) {
    // Log error to monitoring service
    await errorTracker.log({
      agent: context.agent.id,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
});
```

---

## Conclusion

This technical documentation provides a comprehensive overview of the Multi-Agent SDLC Framework's architecture, orchestration system, communication protocols, and extension points. The framework is designed for:

- **Modularity**: Easy to add/remove agents
- **Reliability**: Built-in error handling and recovery
- **Traceability**: Complete audit trail via PROJECT_KNOWLEDGE.md
- **Scalability**: Can handle complex projects with multiple agents
- **Extensibility**: Custom agents, states, and middleware support

For implementation details of specific agents, refer to individual agent configuration files in `.agent-config/`.
