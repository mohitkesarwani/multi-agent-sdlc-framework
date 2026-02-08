# 📚 PROJECT KNOWLEDGE - Single Source of Truth (SSOT)

**Last Updated:** 2026-02-08 07:21:03  
**Framework Version:** 1.0.0  
**Status:** Initialized

---

## 1️⃣ BUSINESS REQUIREMENTS

### Vision
Build a robust, enterprise-grade Multi-Agent SDLC framework that orchestrates AI agents through a Human-in-the-Loop workflow.

### Key Features (Placeholder - Update via BA Agent)
- [ ] Agent orchestration with handover protocols
- [ ] Human approval gates at critical decision points
- [ ] Automated security scanning and validation
- [ ] MongoDB schema design and management
- [ ] Full-stack development automation (Node.js + React)
- [ ] Comprehensive testing pipeline (Jest/Vitest)

### User Stories (Managed by 01_Requirement_Agent)
```
As a [user], I want to [capability] so that [benefit]

[Stories will be populated after BA Agent discovery phase]
```

---

## 2️⃣ SCHEMA DESIGN (MongoDB ERD)

### Database: `sdlc_db`

```mermaid
erDiagram
    USER ||--o{ PROJECT : creates
    USER ||--o{ APPROVAL : submits
    PROJECT ||--o{ ITERATION : contains
    PROJECT ||--o{ DECISION_LOG : has
    ITERATION ||--o{ TASK : includes
    TASK ||--o{ EXECUTION_RECORD : tracks
    APPROVAL ||--o{ SECURITY_AUDIT : triggers

    USER {
        string _id PK "ObjectId"
        string email UK "Unique email"
        string name "Full name"
        string role "admin|architect|developer|qa|human_approver"
        datetime created_at "Timestamp"
        datetime updated_at "Timestamp"
    }

    PROJECT {
        string _id PK "ObjectId"
        string name "Project name"
        string description "Project description"
        string status "planned|approved|in_progress|testing|failed|ready"
        string owner_id FK "Reference to USER"
        array agents_involved "Array of agent names"
        datetime created_at "Timestamp"
        datetime updated_at "Timestamp"
    }

    ITERATION {
        string _id PK "ObjectId"
        string project_id FK "Reference to PROJECT"
        integer iteration_number "Sprint/Iteration number"
        string status "planned|in_progress|completed|failed"
        string business_requirement "Detailed requirement"
        datetime start_date "Start timestamp"
        datetime end_date "End timestamp"
    }

    TASK {
        string _id PK "ObjectId"
        string iteration_id FK "Reference to ITERATION"
        string agent_id "Assigned agent"
        string title "Task title"
        string description "Task description"
        string status "pending|in_progress|completed|blocked"
        integer priority "1-5 (5=highest)"
        datetime created_at "Timestamp"
        datetime completed_at "Timestamp"
    }

    DECISION_LOG {
        string _id PK "ObjectId"
        string project_id FK "Reference to PROJECT"
        string decision_title "What was decided"
        string rationale "Why this decision"
        string alternatives_considered "Other options"
        string made_by "Agent/Human name"
        datetime made_at "Timestamp"
    }

    APPROVAL {
        string _id PK "ObjectId"
        string iteration_id FK "Reference to ITERATION"
        string requested_by "Agent name"
        string approval_type "plan|code|security"
        string status "pending|approved|rejected"
        string human_reviewer_id FK "Reference to USER"
        string comments "Approval comments"
        datetime created_at "Timestamp"
        datetime resolved_at "Timestamp"
    }

    EXECUTION_RECORD {
        string _id PK "ObjectId"
        string task_id FK "Reference to TASK"
        string agent_name "Executing agent"
        string output "Generated code/schema/plan"
        integer success_flag "1=success|0=failed"
        string error_message "Error details if failed"
        datetime executed_at "Timestamp"
    }

    SECURITY_AUDIT {
        string _id PK "ObjectId"
        string approval_id FK "Reference to APPROVAL"
        string vulnerabilities "Array of found issues"
        string severity_level "low|medium|high|critical"
        string status "pending|reviewed|cleared"
        datetime audit_at "Timestamp"
    }
}
```

### Mongoose Models Location
- **Backend Path:** `src/backend/models/`
- **Models:**
  - `User.js` - User authentication and roles
  - `Project.js` - Project management
  - `Iteration.js` - Sprint/Iteration tracking
  - `Task.js` - Task management
  - `DecisionLog.js` - Decision tracking
  - `Approval.js` - Human approval gates
  - `ExecutionRecord.js` - Agent execution history
  - `SecurityAudit.js` - Security findings

---

## 3️⃣ CURRENT ITERATION STATUS

| Phase | Status | Assigned Agent | Notes |
|-------|--------|-----------------|-------|
| **Discovery** | Initialized | 01_Requirement_Agent | Awaiting human input |
| **Architecture** | Initialized | 02_System_Architect | Schema design template created |
| **Planning** | Initialized | 03_Implementation_Planner | Awaiting architecture approval |
| **Development** | Pending | 04_FullStack_Dev_Swarm | Blocked until plan approved |
| **Testing** | Pending | 05_Quality_Assurance | Blocked until dev complete |
| **Security Review** | Pending | 06_Security_Sentinel | Blocked until testing passes |

---

## 4️⃣ DECISION LOG

### Decision #1: Technology Stack Selection
- **Date:** 2026-02-08
- **Decision:** Use Node.js/Express + React + MongoDB
- **Rationale:** 
  - JavaScript full-stack allows seamless code generation
  - MongoDB provides flexible schema for rapid iteration
  - React ecosystem mature for agent-driven UI generation
- **Alternatives Considered:**
  - Python/FastAPI + Vue.js (Learning curve higher for orchestration)
  - Go + Next.js (Limited MongoDB ODM options)
- **Owner:** Chief Enterprise Architect

### Decision #2: Security Protocol
- **Date:** 2026-02-08
- **Decision:** Enforce .env file with NO hardcoded secrets
- **Rationale:** 
  - Prevents accidental exposure in Git commits
  - Allows different configs per environment
  - Aligns with 12-factor app methodology
- **Owner:** 06_Security_Sentinel

### Decision #3: Human-in-the-Loop Gates
- **Date:** 2026-02-08
- **Decision:** Mandatory approval at 3 points: Planning, Security Audit
- **Rationale:**
  - Prevents rouge agent execution
  - Maintains business alignment
  - Catches security issues early
- **Owner:** 03_Implementation_Planner

---

## 5️⃣ AGENT COMMUNICATION LOG

```
[2026-02-08 - Framework Initialized]
✓ Chief Architect initialized framework
✓ All agents registered and idle
✓ PROJECT_KNOWLEDGE.md created as SSOT
→ Awaiting human business requirements...
```

---

## 📝 NOTES FOR HUMAN REVIEWERS

1. **Discovery Phase Next:** Share your business requirements with 01_Requirement_Agent
2. **Schema Validation:** Review the ERD above; request changes before coding
3. **Approval Gates:** You'll be prompted at critical decision points
4. **Security:** All .env files WILL be excluded from Git automatically

---

**Status Indicator:** 🟡 WAITING_FOR_HUMAN_INPUT