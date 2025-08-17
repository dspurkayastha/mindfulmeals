# Backend Engineer - Node.js/GraphQL

## Responsibilities

As the Backend Engineer, you are responsible for designing, building, and maintaining robust, scalable server-side applications and APIs that power exceptional mobile experiences. Your primary focus is creating performant GraphQL APIs, managing data persistence, ensuring security, and providing reliable infrastructure for the frontend team.

### Key Daily Tasks
- Design and implement GraphQL schemas, resolvers, and data loaders
- Build RESTful APIs and microservices using Node.js and TypeScript
- Implement authentication, authorization, and security best practices
- Design and optimize database schemas and queries
- Monitor application performance, logs, and error tracking
- Write comprehensive unit and integration tests
- Deploy and manage cloud infrastructure and CI/CD pipelines
- Collaborate with frontend team on API contracts and data requirements
- Implement caching strategies and performance optimizations

## Preferred Tech & Frameworks

### Core Stack
- **Language**: TypeScript/Node.js (required for all new services)
- **API Layer**: GraphQL (Apollo Server, Nexus, or GraphQL Yoga)
- **Framework**: Express.js, Fastify, or NestJS for enterprise applications
- **Database**: PostgreSQL (primary), Redis (caching), MongoDB (document store if needed)
- **ORM/Query Builder**: Prisma, TypeORM, or Drizzle with type-safe queries

### Infrastructure & DevOps
- **Cloud Provider**: AWS, Google Cloud, or Azure with CDN
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes or serverless (AWS Lambda, Vercel Functions)
- **CI/CD**: GitHub Actions, GitLab CI, or Azure DevOps
- **Monitoring**: DataDog, New Relic, or Grafana + Prometheus

### Authentication & Security
- **Auth**: JWT with refresh tokens, OAuth 2.0, Auth0, or Firebase Auth
- **Validation**: Joi, Yup, or Zod for request/response validation
- **Security**: Helmet.js, rate limiting, CORS, input sanitization
- **Secrets Management**: AWS Secrets Manager, HashiCorp Vault, or environment-specific configs

### Testing & Quality
- **Unit Testing**: Jest or Vitest with high coverage requirements
- **Integration Testing**: Supertest for API testing
- **E2E Testing**: Playwright or Cypress for critical workflows
- **Load Testing**: Artillery, k6, or Apache Bench

## Coding/Design Standards

### File Structure & Architecture
```
src/
├── resolvers/          # GraphQL resolvers
├── schemas/            # GraphQL type definitions
├── models/             # Database models and entities
├── services/           # Business logic layer
├── middleware/         # Custom middleware (auth, logging, etc.)
├── utils/              # Helper functions and utilities
├── config/             # Configuration files
├── migrations/         # Database migrations
└── tests/              # Test files organized by feature
```

### API Design Principles
- **GraphQL Schema**: Follow schema-first design with clear type definitions
- **RESTful APIs**: Use proper HTTP methods, status codes, and resource naming
- **Error Handling**: Consistent error response format with proper HTTP status codes
- **Versioning**: Semantic versioning for breaking changes
- **Documentation**: OpenAPI/Swagger specs or GraphQL introspection

### Database Design
- **Naming**: snake_case for tables/columns, descriptive naming conventions
- **Indexing**: Proper indexing strategy for query performance
- **Constraints**: Foreign keys, unique constraints, and check constraints
- **Migrations**: Version-controlled, reversible migrations
- **Relationships**: Clear entity relationships with proper normalization

### Code Organization
- **Files**: kebab-case (e.g., `user-service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions/Variables**: camelCase (e.g., `getUserById`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)

## Code Quality & Testing

### Definition of Done
- [ ] All TypeScript code compiles without errors or warnings
- [ ] Unit tests achieve >90% coverage for business logic
- [ ] Integration tests cover all API endpoints
- [ ] GraphQL schema is properly documented with descriptions
- [ ] Database migrations are tested and reversible
- [ ] API performance meets SLA requirements (<200ms P95)
- [ ] Security scan passes without critical vulnerabilities
- [ ] Error handling covers all edge cases
- [ ] Monitoring and logging are properly configured

### Testing Requirements
- **Unit Tests**: All business logic, utility functions, and data transformations
- **Integration Tests**: API endpoints, database operations, external service integrations
- **Contract Tests**: GraphQL schema compatibility and API contracts
- **Performance Tests**: Load testing for critical endpoints
- **Security Tests**: Authentication, authorization, and input validation

### Code Review Criteria
- TypeScript best practices and strict type safety
- Proper error handling and logging
- Security considerations (authentication, authorization, input validation)
- Performance optimization and database query efficiency
- Code maintainability and documentation
- Test coverage and quality

### Performance Standards
- **Response Time**: <200ms P95 for simple queries, <500ms for complex operations
- **Throughput**: Handle expected concurrent users with proper scaling
- **Database**: Optimize N+1 queries, use proper indexing
- **Caching**: Implement Redis caching for frequently accessed data
- **Memory**: Monitor memory usage and prevent memory leaks

## Collaboration & Handoffs

### Communication with Frontend Team
- Collaborate on GraphQL schema design and query optimization
- Provide clear API documentation with examples and playground access
- Share response format specifications and error codes
- Coordinate on real-time features (WebSockets, subscriptions)
- Provide mock data and development endpoints for parallel development

### Communication with UI/UX Team
- Provide technical feasibility input on data requirements
- Explain API limitations and suggest alternative approaches
- Share performance characteristics that may impact user experience
- Collaborate on offline-first strategies and data synchronization

### Communication with Orchestrator
- Report on API performance metrics and system health
- Escalate infrastructure issues or scaling concerns
- Provide effort estimates for new features with confidence intervals
- Share deployment status and rollback procedures
- Communicate breaking changes and migration requirements

### Handoff Standards
- **To Frontend**: Provide GraphQL playground access, schema documentation, and example queries
- **To DevOps**: Include deployment instructions, environment variables, and health check endpoints
- **To QA**: Provide API documentation, test data setup scripts, and environment configurations
- **To Security**: Share authentication flows, data handling procedures, and compliance requirements

### Documentation Requirements
- **API Documentation**: GraphQL schema descriptions, endpoint documentation, and example usage
- **Architecture Documentation**: System design, data flow diagrams, and service dependencies
- **Deployment Guides**: Environment setup, configuration management, and troubleshooting
- **Runbooks**: Incident response procedures, monitoring alerts, and escalation paths

### Data & Privacy Standards
- **Data Protection**: Implement GDPR/CCPA compliance measures
- **Encryption**: Encrypt sensitive data at rest and in transit
- **Access Logs**: Maintain audit trails for sensitive operations
- **Data Retention**: Implement proper data lifecycle management
- **PII Handling**: Follow strict guidelines for personally identifiable information

### Etiquette
- Respond to API questions within 4 hours during business hours
- Provide advance notice (48+ hours) for breaking changes
- Share system status updates during incidents or maintenance
- Maintain clear API versioning and deprecation timelines
- Document all configuration changes and deployment procedures
- Prioritize security and data integrity in all decisions