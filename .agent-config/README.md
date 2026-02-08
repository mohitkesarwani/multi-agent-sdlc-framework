# Agent Configuration Files

This directory contains comprehensive JSON configuration files for the Multi-Agent SDLC Framework. These files define agent roles, prompts, workflows, and quality checklists used throughout the software development lifecycle.

## Configuration Files

### 1. agent-roles.json
**Purpose:** Defines the roles, responsibilities, and specifications for all agents in the framework.

**Contents:**
- **6 Agent Definitions:**
  - Requirement Agent - Requirements analysis and specification
  - System Architect - System design and architecture
  - Implementation Planner - Task planning and resource allocation
  - FullStack Dev Swarm - Full-stack implementation
  - Quality Assurance - Testing and quality validation
  - Security Sentinel - Security auditing and compliance

**Each agent includes:**
- Unique agent ID and descriptive name
- Detailed responsibilities list
- Required capabilities
- Input/output specifications with formats and fields
- Dependencies on other agents (upstream/downstream)
- Performance metrics and thresholds
- Communication protocol specifications

### 2. prompts.json
**Purpose:** Contains prompt templates for agent interactions and task execution.

**Contents:**
- **System Prompts:** Base instructions and personality traits for each agent type
- **Task Prompts:** Specific templates for common tasks:
  - Requirements analysis
  - Architecture design
  - Implementation planning
  - Feature implementation
  - Test planning
  - Security audits
- **Context Building Prompts:** Templates for gathering project context
- **Error Handling Prompts:** Responses to common error scenarios
- **Review Prompts:** Templates for code, architecture, and security reviews
- **Validation Prompts:** Quality validation templates
- **Collaboration Prompts:** Inter-agent communication templates

**Features:**
- Variable placeholders ({{variable_name}}) for dynamic content
- Validation rules for output quality
- Structured output format specifications
- Automated vs. manual execution indicators

### 3. workflows.json
**Purpose:** Defines complete workflows for common SDLC scenarios.

**Contents:**
- **5 Complete Workflows:**
  1. **New Feature Development** - Full feature lifecycle from requirements to deployment
  2. **Bug Fix** - Efficient bug resolution workflow
  3. **Refactoring** - Safe code refactoring process
  4. **Security Audit** - Comprehensive security assessment
  5. **Performance Optimization** - Systematic performance improvement

**Each workflow includes:**
- Trigger conditions and required inputs
- Sequential steps with agent assignments
- Input/output specifications for each step
- Dependencies between steps
- Parallel execution paths where applicable
- Decision points and conditional branching
- Error handling and retry policies
- Success criteria and validation rules
- Estimated durations and timeouts
- Notification rules for stakeholders

**Workflow Features:**
- Support for sequential, parallel, and conditional execution
- Loop-back mechanisms for iterative refinement
- Quality gates and approval checkpoints
- Resource management and load balancing
- Progress monitoring and alerting

### 4. checklist.json
**Purpose:** Defines quality and compliance checklists for all phases of development.

**Contents:**
- **5 Checklist Categories:**
  1. **Code Quality** (10 items) - Coding standards, complexity, maintainability
  2. **Security** (12 items) - Vulnerability prevention, compliance, secure coding
  3. **Testing** (12 items) - Test coverage, types of testing, quality metrics
  4. **Documentation** (10 items) - Technical docs, user guides, API documentation
  5. **Deployment** (12 items) - CI/CD, infrastructure, monitoring, rollback

**Each checklist item includes:**
- Unique ID and category assignment
- Clear description of requirement
- Priority level (critical, high, medium, low)
- Validation criteria and methods
- Applicable SDLC phases
- Automation capability indicator
- Blocking status for critical items
- Required tools and thresholds

**Checklist Features:**
- Automated validation where possible
- Integration with workflow steps
- Blocking items prevent progression if failed
- Customizable per project needs
- Compliance tracking and reporting

## Usage

### Loading Configuration Files

```javascript
// Node.js example
const agentRoles = require('./.agent-config/agent-roles.json');
const prompts = require('./.agent-config/prompts.json');
const workflows = require('./.agent-config/workflows.json');
const checklists = require('./.agent-config/checklist.json');
```

```python
# Python example
import json

with open('.agent-config/agent-roles.json') as f:
    agent_roles = json.load(f)

with open('.agent-config/prompts.json') as f:
    prompts = json.load(f)

with open('.agent-config/workflows.json') as f:
    workflows = json.load(f)

with open('.agent-config/checklist.json') as f:
    checklists = json.load(f)
```

### Accessing Agent Configuration

```javascript
// Get specific agent configuration
const requirementAgent = agentRoles.agents.find(
  agent => agent.agentId === 'requirement-agent'
);

// Get agent responsibilities
console.log(requirementAgent.responsibilities);

// Get agent input specifications
console.log(requirementAgent.inputSpecifications);
```

### Using Prompt Templates

```javascript
// Get a specific prompt template
const analyzeRequirementsPrompt = prompts.task_prompts.analyze_requirements;

// Replace variables in template
function populatePrompt(template, variables) {
  let prompt = template.template;
  for (const [key, value] of Object.entries(variables)) {
    prompt = prompt.replace(`{{${key}}}`, value);
  }
  return prompt;
}

const filledPrompt = populatePrompt(analyzeRequirementsPrompt, {
  requirement_description: "Add user authentication",
  stakeholder_name: "Product Manager",
  priority_level: "High"
});
```

### Executing Workflows

```javascript
// Get workflow definition
const newFeatureWorkflow = workflows.workflows.find(
  wf => wf.workflowId === 'new-feature'
);

// Access workflow steps
newFeatureWorkflow.steps.forEach(step => {
  console.log(`Step: ${step.name}, Agent: ${step.agent}`);
  console.log(`Dependencies: ${step.dependencies || 'None'}`);
});

// Check for parallel execution groups
const parallelGroups = newFeatureWorkflow.parallel_execution;
```

### Validating Against Checklists

```javascript
// Get security checklist items
const securityChecklist = checklists.checklist_categories.find(
  cat => cat.categoryId === 'security'
);

// Filter critical items
const criticalItems = securityChecklist.items.filter(
  item => item.priority === 'critical'
);

// Check blocking items
const blockingItems = criticalItems.filter(item => item.blocking);

console.log(`Critical security checks: ${criticalItems.length}`);
console.log(`Blocking checks: ${blockingItems.length}`);
```

## Integration with Orchestrator

The orchestrator (orchestrator.js) uses these configuration files to:

1. **Initialize agents** with their roles and capabilities
2. **Route tasks** to appropriate agents based on responsibilities
3. **Execute workflows** following defined steps and dependencies
4. **Generate prompts** using templates with context-specific variables
5. **Validate outputs** against checklist criteria
6. **Enforce quality gates** using blocking checklist items
7. **Coordinate communication** between agents using dependencies
8. **Monitor progress** and report on workflow status

## Customization

### Adding a New Agent

1. Add agent definition to `agent-roles.json`
2. Add system and task prompts to `prompts.json`
3. Update workflows to include the new agent
4. Add any agent-specific checklist items

### Creating a Custom Workflow

1. Define workflow structure in `workflows.json`
2. Specify steps with agent assignments
3. Define dependencies and execution order
4. Set validation criteria and success conditions
5. Configure error handling and notifications

### Extending Checklists

1. Add new items to appropriate category in `checklist.json`
2. Define validation criteria and methods
3. Set priority and blocking status
4. Specify applicable phases and automation capability

## Best Practices

1. **Maintain JSON Schema Compatibility:** All files follow JSON schema standards
2. **Version Control:** Track changes to configuration files
3. **Validate Changes:** Use JSON validators before committing
4. **Document Customizations:** Add description fields for custom items
5. **Test Workflows:** Validate workflow logic before deployment
6. **Review Checklists:** Regularly review and update checklist items
7. **Update Prompts:** Refine prompts based on agent performance

## Schema Validation

All configuration files include `$schema` references and follow structured formats:

```bash
# Validate JSON syntax
python3 -m json.tool .agent-config/agent-roles.json > /dev/null
python3 -m json.tool .agent-config/prompts.json > /dev/null
python3 -m json.tool .agent-config/workflows.json > /dev/null
python3 -m json.tool .agent-config/checklist.json > /dev/null
```

## File Statistics

- **agent-roles.json:** ~14 KB, 6 agents, detailed specifications
- **prompts.json:** ~18 KB, 30+ prompt templates, multiple categories
- **workflows.json:** ~30 KB, 5 workflows, 30+ workflow steps
- **checklist.json:** ~33 KB, 5 categories, 56 checklist items

## Related Documentation

- See `docs/` directory for additional framework documentation
- See `README.md` for overall project information
- See `SETUP_GUIDE.md` for framework setup instructions

## Version

Configuration Version: 1.0.0
Framework Version: Compatible with Multi-Agent SDLC Framework v1.x

---

**Note:** These configuration files are designed to be production-ready and follow industry best practices for multi-agent systems, SDLC processes, and software quality assurance.
