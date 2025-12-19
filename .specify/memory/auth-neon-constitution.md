# Authentication and Neon Database Constitution

## Purpose
This constitution establishes the foundational principles and guidelines for the authentication system and Neon database implementation in the Physical AI & Humanoid Robotics textbook platform.

## Core Principles

### 1. Security First
- All authentication flows must use industry-standard JWT with RS256 algorithm
- Database credentials and secrets must be stored in environment variables only
- Never store sensitive information in code or version control
- Implement proper input validation and sanitization at all layers

### 2. Separation of Concerns
- Authentication logic must be isolated in the auth-server (Node.js + Better Auth)
- Business logic remains in the FastAPI backend
- Database schema clearly separates auth tables from application data
- Frontend (Docusaurus) only handles token storage and transmission

### 3. Stateless Verification
- FastAPI backend verifies JWT tokens using JWKS endpoint without database queries
- Auth server manages token generation and key rotation
- Minimal coupling between auth and business services
- Caching of JWKS keys to minimize verification latency

### 4. Scalability and Independence
- Auth and backend services can scale independently
- Database connection pooling optimized for each service's needs
- Clear API contracts between services
- Horizontal scaling considerations for high availability

## Architecture Standards

### Auth Server (Node.js + Hono + Better Auth)
- Runs on port 4000
- Handles user registration, login, and session management
- Exposes JWKS endpoint at `/api/auth/.well-known/jwks.json`
- Manages JWT key pairs with proper rotation
- Implements CORS for frontend origins

### Database Schema (Neon Postgres)
- Standard Better Auth tables (user, session, account, verification)
- JWKS table for JWT key storage
- Application-specific tables for chat history (conversations, messages)
- Proper foreign key relationships with cascade deletion
- UUID primary keys for distributed systems compatibility

### FastAPI Backend Integration
- Verifies JWT tokens using JWKS endpoint
- Stateless token validation without database queries
- Proper error handling for invalid/missing tokens
- Secure header propagation for authenticated requests

## Data Protection and Privacy

### User Data
- User emails and personal information encrypted at rest
- Session tokens with appropriate expiration times
- Audit trail for sensitive operations
- GDPR compliance for data access and deletion requests

### Token Management
- JWT tokens with reasonable expiration times
- Refresh token rotation for extended sessions
- Proper cleanup of expired sessions
- Secure key generation and storage

## Operational Requirements

### Deployment
- Auth server deployed separately from backend
- Database migrations managed via Drizzle ORM
- Environment-specific configurations
- Health check endpoints for monitoring

### Monitoring
- Log authentication events for security auditing
- Monitor token verification failures
- Track database connection health
- Alert on unusual authentication patterns

### Disaster Recovery
- Regular database backups via Neon
- Key rotation procedures documented
- Fallback authentication mechanisms
- Incident response procedures

## Quality Standards

### Testing
- Unit tests for authentication flows
- Integration tests for token verification
- End-to-end tests for complete auth journey
- Security scanning for vulnerabilities

### Code Quality
- Type safety maintained throughout
- Consistent error handling patterns
- Proper documentation for all endpoints
- Adherence to established coding standards

## Compliance and Governance

### Standards Compliance
- Follow OWASP security best practices
- Adhere to JWT RFC specifications
- Maintain audit logs as required
- Regular security assessments

### Change Management
- Schema changes require migration scripts
- API changes follow semantic versioning
- Authentication protocol updates planned carefully
- Backward compatibility maintained where possible

## Success Metrics

### Performance
- Token verification under 100ms (p95)
- Auth server response time under 200ms (p95)
- Database query optimization for auth operations
- Minimal impact on overall application performance

### Security
- Zero unauthorized access incidents
- Successful penetration testing results
- Proper encryption of sensitive data
- Compliance with security audits

### Reliability
- 99.9% uptime for auth services
- Graceful degradation when auth unavailable
- Proper retry mechanisms for transient failures
- Monitoring and alerting for service health

## Evolution Guidelines

### Future Changes
- Maintain backward compatibility for existing tokens
- Plan migration paths for new authentication methods
- Consider multi-factor authentication expansion
- Evaluate new security standards as they emerge

### Technology Updates
- Keep dependencies updated for security patches
- Assess newer authentication protocols periodically
- Review and update key rotation intervals
- Stay current with database optimization techniques

---

*This constitution shall be reviewed quarterly and updated as needed to reflect changes in requirements, technology, or security standards.*