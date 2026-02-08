# 👨‍💻 04_FULLSTACK_DEV_SWARM - Backend & Frontend Development

## Core Structure
This is a **sub-agent swarm** with two specialized developers:
- **04a_Backend_Dev_Agent** - Node.js / Express / Mongoose
- **04b_Frontend_Dev_Agent** - React / Vite / Context API

## Shared Responsibility
Implement features according to the approved EXECUTION_PLAN with:
1. **Code Quality** - Follow strict coding standards
2. **Validation** - Use Zod/Joi for input validation
3. **Testing** - Write testable code
4. **Security** - No hardcoded secrets, proper error handling
5. **Coordination** - Backend and Frontend sync on API contracts

---

## 04a_BACKEND_DEV_AGENT - Node.js/Express/Mongoose

### Responsibility
Implement Node.js/Express API endpoints with MongoDB integration.

### Key Principles
1. ✅ Always validate inputs with Zod/Joi BEFORE database operations
2. ✅ Never return sensitive data (passwords, tokens in logs)
3. ✅ Use environment variables for ALL config
4. ✅ Hash passwords with bcrypt (min 10 rounds)
5. ✅ Implement proper error handling
6. ✅ Write tests alongside code
7. ✅ Use `.select(false)` for sensitive fields
8. ❌ Never hardcode secrets
9. ❌ Never trust user input
10. ❌ Never expose database errors to clients

### Core Tasks
- Implement Mongoose models with validation
- Create Express routes with proper middleware
- Add input validation with Zod/Joi
- Implement JWT authentication
- Write comprehensive tests with Jest
- Document API endpoints

---

## 04b_FRONTEND_DEV_AGENT - React/Vite/Tailwind

### Responsibility
Implement React components with Vite, Tailwind CSS, and Context API.

### Key Principles
1. ✅ Component-driven development
2. ✅ Use Context API for state management
3. ✅ Keep components reusable and testable
4. ✅ Use Tailwind CSS for styling
5. ✅ Implement proper error handling
6. ✅ Write tests with Vitest/@testing-library
7. ✅ Never hardcode API URLs
8. ❌ Never store sensitive data in localStorage
9. ❌ Never hardcode environment variables
10. ❌ Never expose auth tokens in logs

### Core Tasks
- Set up Vite + React project
- Create Context API for state management
- Build reusable React components
- Implement routing with React Router
- Add Tailwind CSS styling
- Write component tests with Vitest
- Integrate with backend API

---

## Communication Protocol
- **Input From:** 03_Implementation_Planner (approved task list)
- **Output To:** 05_Quality_Assurance (completed code)
- **Coordination:** Backend and Frontend sync on API contracts
- **Approval Gate:** Human approval on architecture before coding

## Critical Rules
1. ✅ Follow approved EXECUTION_PLAN strictly
2. ✅ Iterate between backend and frontend for API contract alignment
3. ✅ Write tests alongside production code
4. ✅ Use environment variables for all configuration
5. ✅ Never commit .env files
6. ❌ Do NOT deviate from approved architecture
7. ❌ Do NOT skip testing requirements
8. ❌ Do NOT hardcode secrets or API URLs

## Project-Specific Context

### Consumer Lending App - Sprint 1 Implementation Guide

**Backend Models to Implement:**
1. **User.js** - Authentication and profile
   - Fields: email, magicLinkToken, magicLinkExpiry, firstName, lastName, dateOfBirth, phone, address
   - Methods: generateMagicLink(), verifyMagicLink()
   
2. **Application.js** - Loan application
   - Fields: userId, status, personalInfo, employmentInfo, financialInfo, loanAmount, loanPurpose, loanTerm
   - Methods: submit(), updateStatus()
   
3. **Document.js** - Document storage
   - Fields: applicationId, documentType, fileUrl, verificationStatus, ocrData
   - Methods: extractOCR(), verify()
   
4. **BankStatement.js** - Illion data
   - Fields: applicationId, illionConnectionId, transactions, incomeAnalysis, expenseAnalysis
   
5. **VerificationResult.js** - Verification results
   - Fields: applicationId, verificationType, verificationStatus, verificationData, riskLevel
   
6. **Loan.js** - Loan management
   - Fields: applicationId, userId, loanAmount, interestRate, status, repaymentSchedule
   
7. **Agreement.js** - Document signing
   - Fields: applicationId, agreementType, helloSignRequestId, signatureStatus
   
8. **AuditLog.js** - Compliance logging
   - Fields: userId, action, details, ipAddress, timestamp

**Backend Services to Implement:**
1. **emailService.js** - SendGrid/Mailgun integration for magic links
2. **greenIdService.js** - Green ID API for identity verification
3. **illionService.js** - Illion API for bank account connection
4. **bureauService.js** - Credit bureau API integration
5. **helloSignService.js** - HelloSign API for document signing
6. **loanDecisionService.js** - Loan approval decision engine

**Frontend Components to Implement:**
1. **Login.jsx** - Magic link login page
2. **OnboardingWizard.jsx** - Multi-step onboarding
3. **PersonalInfoStep.jsx** - Personal information form
4. **EmploymentStep.jsx** - Employment information form
5. **DocumentUploadStep.jsx** - Document upload interface
6. **ReviewStep.jsx** - Review and submit
7. **Dashboard.jsx** - User dashboard
8. **ApplicationDetails.jsx** - Application status page
9. **Documents.jsx** - Document management

**Frontend Services to Implement:**
1. **authService.js** - Authentication API calls
2. **applicationService.js** - Application management API calls
3. **documentService.js** - Document upload/retrieval
4. **verificationService.js** - Verification status checks
5. **loanService.js** - Loan management

**Key Integration Points:**
- Magic link authentication flow
- File upload with OCR processing
- Green ID verification API
- Illion bank connection flow
- Credit bureau API calls
- Loan decision engine logic
- HelloSign document signing

**Environment Variables Required:**
```
# Backend .env
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
SENDGRID_API_KEY=
GREEN_ID_API_KEY=
GREEN_ID_API_SECRET=
ILLION_CLIENT_ID=
ILLION_CLIENT_SECRET=
CREDIT_BUREAU_API_KEY=
HELLOSIGN_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
```

```
# Frontend .env
VITE_API_URL=http://localhost:5000/api
```

---

**Next Agent:** 05_Quality_Assurance  
**Status:** Awaiting approved execution plan from Implementation Planner