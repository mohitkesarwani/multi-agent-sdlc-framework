# Security Checklist

## Table of Contents
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Infrastructure Security](#infrastructure-security)
- [Compliance Requirements](#compliance-requirements)
- [Security Testing](#security-testing)
- [Incident Response](#incident-response)

---

## Authentication & Authorization

### User Authentication

#### Password Security
- [ ] Passwords are hashed using bcrypt with at least 12 salt rounds
- [ ] Password minimum length is 8 characters
- [ ] Password complexity requirements enforced (uppercase, lowercase, numbers, special chars)
- [ ] Password history prevents reuse of last 5 passwords
- [ ] Account lockout after 5 failed login attempts
- [ ] Lockout duration is at least 15 minutes
- [ ] Passwords are never stored in plain text
- [ ] Passwords are never logged or exposed in error messages
- [ ] Password reset tokens expire after 1 hour
- [ ] Password reset tokens are single-use only

#### Session Management
- [ ] JWT tokens are used for session management
- [ ] JWT secret is strong (min 256 bits) and stored securely
- [ ] JWT tokens expire after a reasonable time (7 days max)
- [ ] Refresh token mechanism is implemented
- [ ] Tokens are invalidated on logout
- [ ] No sensitive data is stored in JWT payload
- [ ] Tokens are transmitted over HTTPS only
- [ ] Session timeout after 30 minutes of inactivity
- [ ] "Remember Me" tokens expire after 30 days
- [ ] Concurrent session limits are enforced (if required)

#### Multi-Factor Authentication (MFA)
- [ ] MFA is available as an option
- [ ] MFA supports TOTP (Time-based One-Time Password)
- [ ] MFA backup codes are provided
- [ ] MFA can be disabled only after identity verification
- [ ] Account recovery process when MFA device is lost

### Authorization

#### Role-Based Access Control (RBAC)
- [ ] User roles are clearly defined (user, admin, etc.)
- [ ] Role assignments are stored securely
- [ ] Principle of least privilege is followed
- [ ] Admin access requires additional authentication
- [ ] Critical operations require admin approval
- [ ] Role changes are logged and auditable
- [ ] Unauthorized access attempts are logged
- [ ] Default role is most restrictive (e.g., "user")

#### Access Control
- [ ] All API endpoints have proper authorization checks
- [ ] Users can only access their own data
- [ ] Admins have audit trail for all actions
- [ ] Object-level authorization is implemented
- [ ] Horizontal privilege escalation is prevented
- [ ] Vertical privilege escalation is prevented
- [ ] Direct object references are validated
- [ ] API endpoints return 403 Forbidden for unauthorized access

---

## Data Protection

### Encryption

#### Data in Transit
- [ ] All traffic uses HTTPS/TLS 1.2+
- [ ] SSL/TLS certificates are valid and up-to-date
- [ ] HTTP is redirected to HTTPS
- [ ] Strong cipher suites are configured
- [ ] Certificate pinning is implemented (mobile apps)
- [ ] Secure cookies have `Secure` flag set
- [ ] Cookies have `HttpOnly` flag set
- [ ] Cookies use `SameSite` attribute
- [ ] Internal services communicate over TLS

#### Data at Rest
- [ ] Sensitive data is encrypted in database
- [ ] Encryption keys are stored securely (not in code)
- [ ] Key rotation policy is in place
- [ ] Backups are encrypted
- [ ] Log files containing sensitive data are encrypted
- [ ] File uploads are scanned for malware
- [ ] Temporary files are securely deleted

### Sensitive Data Handling

#### Personal Identifiable Information (PII)
- [ ] PII is collected only when necessary
- [ ] PII is encrypted at rest
- [ ] PII access is logged and monitored
- [ ] PII is not exposed in URLs
- [ ] PII is not logged
- [ ] PII is not included in error messages
- [ ] PII is masked in UI when appropriate
- [ ] Users can request data deletion (GDPR)
- [ ] Data retention policy is documented
- [ ] Expired data is automatically purged

#### Payment Card Information
- [ ] PCI DSS compliance is maintained
- [ ] Card data is never stored (use tokenization)
- [ ] Payment processing uses certified gateway (e.g., Stripe)
- [ ] CVV/CVC is never stored
- [ ] Full card numbers are never logged
- [ ] Card numbers are masked in UI
- [ ] Payment forms use HTTPS
- [ ] 3D Secure is implemented for card payments

---

## API Security

### Input Validation

#### Request Validation
- [ ] All input is validated on the server side
- [ ] Client-side validation is never trusted
- [ ] Input validation library is used (e.g., Zod, Joi)
- [ ] Maximum request size is enforced (10KB recommended)
- [ ] File upload size limits are set
- [ ] File upload types are whitelisted
- [ ] File upload content is validated (not just extension)
- [ ] JSON payloads are validated against schema
- [ ] XML parsing is disabled or secured against XXE
- [ ] Special characters are properly escaped

#### SQL/NoSQL Injection Prevention
- [ ] Parameterized queries are used (SQL)
- [ ] ORM/ODM is used (Sequelize, Mongoose)
- [ ] User input is never concatenated into queries
- [ ] Database user has minimum required permissions
- [ ] NoSQL injection is prevented (MongoDB operators)
- [ ] Query results are limited (pagination)
- [ ] Database errors don't expose schema information

#### Cross-Site Scripting (XSS) Prevention
- [ ] Output encoding is applied to all user-generated content
- [ ] Content Security Policy (CSP) headers are set
- [ ] `X-Content-Type-Options: nosniff` header is set
- [ ] DOM-based XSS vulnerabilities are addressed
- [ ] `dangerouslySetInnerHTML` is avoided (React)
- [ ] HTML sanitization library is used when needed
- [ ] User input in JavaScript is properly escaped

### API Endpoints

#### Request Security
- [ ] CORS is properly configured
- [ ] CORS allows only trusted origins
- [ ] Preflight requests are handled correctly
- [ ] API versioning is implemented
- [ ] Deprecated endpoints have sunset dates
- [ ] Request methods are restricted (GET, POST, etc.)
- [ ] OPTIONS method is properly handled
- [ ] HEAD method is properly handled

#### Response Security
- [ ] Security headers are set (Helmet.js)
- [ ] `X-Frame-Options: DENY` is set
- [ ] `X-XSS-Protection: 1; mode=block` is set
- [ ] Sensitive data is not cached by browsers
- [ ] Cache-Control headers are set appropriately
- [ ] Error responses don't leak sensitive information
- [ ] Stack traces are not exposed in production
- [ ] Generic error messages for authentication failures

### Rate Limiting

#### API Rate Limits
- [ ] Rate limiting is enabled on all endpoints
- [ ] Anonymous users: 100 requests/15 minutes
- [ ] Authenticated users: 1000 requests/15 minutes
- [ ] Login endpoint has stricter rate limit (10/minute)
- [ ] Registration endpoint has rate limit (3/hour per IP)
- [ ] Password reset has rate limit (3/hour per email)
- [ ] Rate limit headers are returned (X-RateLimit-*)
- [ ] Rate limit is per user, not per session
- [ ] Distributed rate limiting is implemented (Redis)
- [ ] Rate limit bypass for trusted services

#### DDoS Protection
- [ ] CDN with DDoS protection is used (Cloudflare)
- [ ] IP-based rate limiting is implemented
- [ ] Suspicious traffic is automatically blocked
- [ ] Load balancer with DDoS protection
- [ ] Geo-blocking for suspicious regions (if applicable)

---

## Infrastructure Security

### Server Security

#### Operating System
- [ ] OS is up-to-date with security patches
- [ ] Unnecessary services are disabled
- [ ] Firewall is configured and enabled
- [ ] SSH key-based authentication is used
- [ ] SSH password authentication is disabled
- [ ] SSH root login is disabled
- [ ] Non-standard SSH port is used (optional)
- [ ] Fail2ban or similar is configured
- [ ] Automatic security updates are enabled

#### Application Server
- [ ] Node.js version is up-to-date
- [ ] Dependencies are regularly updated
- [ ] Vulnerable dependencies are identified (npm audit)
- [ ] Process runs as non-root user
- [ ] Process manager is used (PM2, systemd)
- [ ] Process limits are configured
- [ ] Environment variables are used for secrets
- [ ] `.env` file is not committed to Git
- [ ] Application logs are rotated
- [ ] Crash dumps don't contain sensitive data

### Network Security

#### Firewall Rules
- [ ] Only necessary ports are open (80, 443)
- [ ] Database port is not publicly accessible
- [ ] Redis port is not publicly accessible
- [ ] Admin interfaces are IP-restricted
- [ ] Internal services are on private network
- [ ] VPC/VPN is configured for internal communication

#### Load Balancer
- [ ] Load balancer terminates SSL
- [ ] Health checks are configured
- [ ] Sticky sessions if needed
- [ ] Request timeout is configured
- [ ] Maximum connections limit is set
- [ ] DDoS protection is enabled

### Database Security

#### MongoDB Security
- [ ] Authentication is enabled
- [ ] Strong passwords for database users
- [ ] Database users have minimum required permissions
- [ ] Database is not publicly accessible
- [ ] Encryption at rest is enabled
- [ ] Encryption in transit is enabled (TLS)
- [ ] Regular backups are automated
- [ ] Backups are stored securely offsite
- [ ] Backup restoration is tested regularly
- [ ] Audit logging is enabled
- [ ] IP whitelist is configured

#### Redis Security
- [ ] Authentication is enabled (requirepass)
- [ ] Redis is not publicly accessible
- [ ] TLS is enabled for connections
- [ ] Dangerous commands are disabled (FLUSHALL, KEYS)
- [ ] Maxmemory policy is configured
- [ ] Persistence is configured (if needed)

### File Storage Security

#### AWS S3 / Cloud Storage
- [ ] Bucket permissions are properly configured
- [ ] Public read/write is disabled
- [ ] Signed URLs are used for uploads/downloads
- [ ] CORS is properly configured
- [ ] Versioning is enabled
- [ ] Encryption at rest is enabled
- [ ] Access logging is enabled
- [ ] Lifecycle policies are configured
- [ ] IAM roles are used (not access keys)
- [ ] Access keys are rotated regularly

---

## Compliance Requirements

### GDPR (General Data Protection Regulation)

#### Data Rights
- [ ] Users can view their data (data export)
- [ ] Users can delete their data (right to erasure)
- [ ] Users can update their data
- [ ] Users can object to processing
- [ ] Data portability is implemented
- [ ] Privacy policy is clear and accessible
- [ ] Cookie consent is obtained
- [ ] Data processing is documented
- [ ] Data breach notification process is defined
- [ ] DPO (Data Protection Officer) is appointed if required

#### Data Processing
- [ ] Lawful basis for processing is documented
- [ ] Data minimization principle is followed
- [ ] Purpose limitation is enforced
- [ ] Data retention periods are defined
- [ ] Third-party processors have DPAs
- [ ] International data transfers are compliant
- [ ] Privacy by design is implemented
- [ ] Data protection impact assessment (DPIA) completed

### CCPA (California Consumer Privacy Act)

- [ ] Privacy notice is provided
- [ ] "Do Not Sell My Data" option is available
- [ ] Users can opt-out of data sales
- [ ] Data disclosure requirements are met
- [ ] Consumer rights are honored
- [ ] Non-discrimination policy is in place

### PCI DSS (Payment Card Industry)

- [ ] Cardholder data is not stored
- [ ] Tokenization is used for payments
- [ ] Network is segmented
- [ ] Encryption is used for transmission
- [ ] Access to cardholder data is restricted
- [ ] Security policies are documented
- [ ] Regular security testing is performed
- [ ] Vulnerability management program exists

### ADA (Americans with Disabilities Act)

- [ ] WCAG 2.1 Level AA compliance
- [ ] Screen reader compatibility
- [ ] Keyboard navigation support
- [ ] Color contrast requirements met
- [ ] Alt text for images
- [ ] ARIA labels where appropriate
- [ ] Accessibility statement is provided

---

## Security Testing

### Automated Testing

#### Static Application Security Testing (SAST)
- [ ] ESLint security rules are enabled
- [ ] npm audit is run regularly
- [ ] Dependency scanning is automated (Snyk, Dependabot)
- [ ] Code quality tools are integrated (SonarQube)
- [ ] Security linting in CI/CD pipeline
- [ ] Pre-commit hooks check for secrets

#### Dynamic Application Security Testing (DAST)
- [ ] OWASP ZAP scans are performed
- [ ] API security testing is automated
- [ ] Penetration testing is scheduled quarterly
- [ ] Vulnerability scanning is automated

### Manual Testing

#### Security Code Review
- [ ] Code reviews include security checks
- [ ] Authentication logic is reviewed
- [ ] Authorization logic is reviewed
- [ ] Input validation is reviewed
- [ ] Cryptography usage is reviewed
- [ ] Third-party library usage is reviewed
- [ ] SQL/NoSQL queries are reviewed

#### Penetration Testing
- [ ] Annual penetration test by third party
- [ ] OWASP Top 10 vulnerabilities tested
- [ ] Authentication testing
- [ ] Authorization testing
- [ ] Session management testing
- [ ] Input validation testing
- [ ] Business logic testing
- [ ] API security testing
- [ ] Infrastructure testing

### OWASP Top 10 (2021)

#### A01:2021 – Broken Access Control
- [ ] All endpoints have authorization checks
- [ ] Object-level authorization is verified
- [ ] IDOR vulnerabilities are prevented
- [ ] Direct object references are validated

#### A02:2021 – Cryptographic Failures
- [ ] Strong encryption algorithms are used
- [ ] Weak algorithms are not used (MD5, SHA1)
- [ ] Encryption keys are managed securely
- [ ] TLS is properly configured

#### A03:2021 – Injection
- [ ] SQL injection is prevented
- [ ] NoSQL injection is prevented
- [ ] Command injection is prevented
- [ ] LDAP injection is prevented
- [ ] XPath injection is prevented

#### A04:2021 – Insecure Design
- [ ] Threat modeling is performed
- [ ] Security requirements are defined
- [ ] Security architecture is documented
- [ ] Defense in depth is implemented

#### A05:2021 – Security Misconfiguration
- [ ] Default credentials are changed
- [ ] Unnecessary features are disabled
- [ ] Error messages don't leak information
- [ ] Security headers are configured
- [ ] Latest security patches are applied

#### A06:2021 – Vulnerable Components
- [ ] All dependencies are up-to-date
- [ ] Vulnerable dependencies are tracked
- [ ] Unmaintained dependencies are replaced
- [ ] Dependency sources are verified

#### A07:2021 – Authentication Failures
- [ ] Credential stuffing is prevented
- [ ] Brute force attacks are prevented
- [ ] Weak passwords are rejected
- [ ] Session management is secure
- [ ] MFA is available

#### A08:2021 – Software and Data Integrity Failures
- [ ] CI/CD pipeline is secured
- [ ] Dependencies are verified
- [ ] Digital signatures are verified
- [ ] Unsigned code is not trusted
- [ ] Auto-updates are secured

#### A09:2021 – Logging and Monitoring Failures
- [ ] Security events are logged
- [ ] Logs are centralized
- [ ] Logs are monitored
- [ ] Alerts are configured
- [ ] Log retention policy exists

#### A10:2021 – Server-Side Request Forgery (SSRF)
- [ ] URL validation is implemented
- [ ] Internal URLs are blocked
- [ ] IP whitelist/blacklist is used
- [ ] DNS rebinding is prevented

---

## Security Testing

### Test Cases

#### Authentication Tests
```javascript
describe('Authentication Security', () => {
  test('should reject weak passwords', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: '12345' });
    expect(response.status).toBe(400);
  });

  test('should hash passwords', async () => {
    const user = await User.create({ 
      email: 'test@example.com', 
      password: 'StrongPassword123!' 
    });
    expect(user.password).not.toBe('StrongPassword123!');
    expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash
  });

  test('should lock account after 5 failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });
    }
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'correct' });
    expect(response.status).toBe(423); // Locked
  });
});
```

#### Authorization Tests
```javascript
describe('Authorization Security', () => {
  test('should prevent unauthorized access', async () => {
    const response = await request(app)
      .get('/api/admin/users');
    expect(response.status).toBe(401);
  });

  test('should prevent privilege escalation', async () => {
    const userToken = generateToken({ id: 'user1', role: 'user' });
    const response = await request(app)
      .delete('/api/users/user2')
      .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(403);
  });
});
```

#### Input Validation Tests
```javascript
describe('Input Validation Security', () => {
  test('should prevent SQL injection', async () => {
    const response = await request(app)
      .get('/api/products?id=1 OR 1=1');
    expect(response.status).toBe(400);
  });

  test('should prevent NoSQL injection', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: { $ne: null }, password: { $ne: null } });
    expect(response.status).toBe(400);
  });

  test('should prevent XSS attacks', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({ name: '<script>alert("XSS")</script>' });
    expect(response.body.data.name).not.toContain('<script>');
  });
});
```

---

## Incident Response

### Incident Response Plan

#### 1. Preparation
- [ ] Incident response team is identified
- [ ] Contact information is up-to-date
- [ ] Incident response procedures are documented
- [ ] Tools for investigation are available
- [ ] Backups are regularly tested
- [ ] Disaster recovery plan exists

#### 2. Detection and Analysis
- [ ] Monitoring tools are in place
- [ ] Alerts are configured
- [ ] Log aggregation is set up
- [ ] Anomaly detection is configured
- [ ] Incident classification system exists

#### 3. Containment
- [ ] Containment strategies are defined
- [ ] Isolation procedures are documented
- [ ] Backup systems are available
- [ ] Communication plan exists

#### 4. Eradication
- [ ] Root cause analysis process
- [ ] Malware removal procedures
- [ ] Vulnerability patching process
- [ ] System hardening procedures

#### 5. Recovery
- [ ] Recovery procedures are documented
- [ ] System restoration process
- [ ] Validation procedures
- [ ] Monitoring post-recovery

#### 6. Lessons Learned
- [ ] Post-incident review process
- [ ] Documentation of lessons learned
- [ ] Process improvement plan
- [ ] Training based on incidents

### Security Contacts

#### Internal Contacts
- **Security Lead:** [Name] - [Email] - [Phone]
- **DevOps Lead:** [Name] - [Email] - [Phone]
- **Legal/Compliance:** [Name] - [Email] - [Phone]
- **PR/Communications:** [Name] - [Email] - [Phone]

#### External Contacts
- **Hosting Provider:** [Support Contact]
- **Security Vendor:** [Contact Info]
- **Legal Counsel:** [Contact Info]
- **Law Enforcement:** [Contact Info if needed]

### Breach Notification

#### GDPR Breach Notification
- [ ] Breach detected within 72 hours
- [ ] Supervisory authority notified
- [ ] Affected individuals notified
- [ ] Breach details documented
- [ ] Measures taken documented

#### Data Breach Response Checklist
- [ ] Contain the breach
- [ ] Assess scope of breach
- [ ] Secure systems
- [ ] Notify stakeholders
- [ ] Notify affected users
- [ ] Notify authorities (if required)
- [ ] Document incident
- [ ] Review and improve security

---

## Security Audit Log

### What to Log

#### Authentication Events
- [ ] Successful logins
- [ ] Failed login attempts
- [ ] Password changes
- [ ] Password reset requests
- [ ] Account lockouts
- [ ] MFA events
- [ ] Logout events

#### Authorization Events
- [ ] Unauthorized access attempts
- [ ] Permission changes
- [ ] Role changes
- [ ] Privilege escalation attempts

#### Data Access
- [ ] PII access
- [ ] Payment data access
- [ ] Admin actions
- [ ] Bulk data exports
- [ ] Data deletions

#### System Events
- [ ] Configuration changes
- [ ] Database schema changes
- [ ] Deployment events
- [ ] Service restarts
- [ ] Security patches applied

### Log Format
```json
{
  "timestamp": "2024-02-08T12:00:00.000Z",
  "level": "info",
  "event": "login_success",
  "userId": "user123",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "metadata": {
    "loginMethod": "password",
    "mfaUsed": true
  }
}
```

---

## Security Checklist Summary

### Pre-Launch Checklist
- [ ] All items in this checklist are reviewed
- [ ] Security audit completed
- [ ] Penetration testing performed
- [ ] Vulnerability scan passed
- [ ] Code review completed
- [ ] Security headers verified
- [ ] SSL/TLS certificate installed
- [ ] Firewall rules configured
- [ ] Backup and recovery tested
- [ ] Monitoring and alerting configured
- [ ] Incident response plan documented
- [ ] Security training completed

### Monthly Security Review
- [ ] Review security logs
- [ ] Check for security updates
- [ ] Run vulnerability scan
- [ ] Review access permissions
- [ ] Review user accounts
- [ ] Test backup restoration
- [ ] Review incident response plan

### Quarterly Security Tasks
- [ ] Security audit
- [ ] Penetration testing
- [ ] Review and update policies
- [ ] Security awareness training
- [ ] Disaster recovery drill
- [ ] Compliance audit

---

**Document Version:** 1.0  
**Last Updated:** [YYYY-MM-DD]  
**Next Review:** [YYYY-MM-DD]  
**Reviewed By:** [Security Lead Name]
