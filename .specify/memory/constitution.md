<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial adoption)
Modified principles: N/A (initial)
Added sections:
  - Core Principles (4 principles)
  - Quality Gates
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
  - .specify/templates/spec-template.md ✅ (Success Criteria aligns with performance requirements)
  - .specify/templates/tasks-template.md ✅ (Test structure aligns with Testing Standards)
Follow-up TODOs: None
-->

# Speckit Project Constitution

## Core Principles

### I. Code Quality

All code MUST adhere to consistent, maintainable standards:

- **Linting & Formatting**: Code MUST pass configured linter and formatter checks before merge. No exceptions.
- **Readability**: Functions MUST be focused (single responsibility), well-named, and documented where intent is non-obvious.
- **Type Safety**: Strongly-typed languages MUST use explicit types; dynamically-typed languages MUST use type hints/annotations where supported.
- **No Dead Code**: Unused imports, variables, and functions MUST be removed. Commented-out code is forbidden.
- **Complexity Limits**: Cyclomatic complexity SHOULD remain below 10 per function; exceptions require documented justification.

**Rationale**: Consistent code quality reduces cognitive load, accelerates onboarding, and prevents technical debt accumulation.

### II. Testing Standards

Testing is mandatory, not optional:

- **Coverage Threshold**: Minimum 80% line coverage for new code; critical paths MUST have 95%+ coverage.
- **Test Types Required**: Unit tests for all business logic; integration tests for API contracts and data flows; end-to-end tests for primary user journeys.
- **Test-First Encouraged**: Tests SHOULD be written before implementation when feasible; tests MUST exist before code is merged.
- **Test Independence**: Each test MUST be isolated and repeatable—no shared mutable state between tests.
- **Failure Clarity**: Test failures MUST produce clear, actionable error messages indicating what failed and why.

**Rationale**: Comprehensive testing catches regressions early, enables confident refactoring, and serves as living documentation.

### III. User Experience Consistency

User-facing interfaces MUST provide a coherent, predictable experience:

- **Design System Adherence**: UI components MUST follow the established design system (colors, typography, spacing, components).
- **Error Handling**: User-facing errors MUST be actionable and human-readable—no stack traces, cryptic codes, or empty states without guidance.
- **Loading States**: All async operations MUST display appropriate loading indicators; users MUST never wonder if the system is responding.
- **Accessibility**: Interfaces MUST meet WCAG 2.1 AA standards minimum; semantic HTML, keyboard navigation, and screen reader support are required.
- **Responsive Behavior**: Layouts MUST function across supported viewport sizes without broken layouts or hidden content.

**Rationale**: Consistent UX builds user trust, reduces support burden, and ensures the product is usable by all intended audiences.

### IV. Performance Requirements

Performance targets are constraints, not aspirations:

- **Response Time**: API endpoints MUST respond within 200ms at p95 under normal load; user-facing pages MUST achieve First Contentful Paint under 1.5s.
- **Resource Limits**: Services MUST operate within defined memory and CPU budgets; exceeding limits requires architecture review.
- **No N+1 Queries**: Database access MUST be optimized to avoid N+1 patterns; batch operations SHOULD be used where applicable.
- **Caching Strategy**: Frequently accessed, rarely changing data MUST be cached with explicit invalidation policies.
- **Measurement**: Performance MUST be measured in CI; regressions exceeding 10% MUST block merge until addressed.

**Rationale**: Performance directly impacts user satisfaction and operational costs; treating it as a first-class constraint prevents degradation over time.

## Quality Gates

All code changes MUST pass these gates before merge:

1. **Automated Checks**: Linting, formatting, type checking, and all test suites pass.
2. **Code Review**: At least one approving review from a qualified reviewer.
3. **Coverage Verification**: Test coverage meets or exceeds thresholds.
4. **Performance Check**: No measured performance regressions beyond tolerance.
5. **Accessibility Audit**: UI changes pass automated accessibility checks.

## Development Workflow

1. **Branch Strategy**: Feature branches from main; short-lived branches preferred (< 1 week).
2. **Commit Hygiene**: Atomic commits with descriptive messages following conventional commit format.
3. **Review Process**: PRs MUST include description of changes, testing performed, and any relevant screenshots/recordings for UI changes.
4. **Merge Requirements**: All quality gates passed; conflicts resolved; branch up-to-date with target.

## Governance

This constitution supersedes conflicting guidance in other documents. Amendments require:

1. **Proposal**: Document the proposed change with rationale.
2. **Review**: Stakeholder review period (minimum 3 business days).
3. **Approval**: Consensus among maintainers; documented in amendment history.
4. **Migration**: If change affects existing code, include migration plan and timeline.

**Compliance**: All PRs and code reviews MUST verify adherence to these principles. Violations MUST be addressed before merge or explicitly documented as technical debt with remediation timeline.

**Versioning**: Constitution follows semantic versioning—MAJOR for breaking governance changes, MINOR for new principles/sections, PATCH for clarifications.

**Version**: 1.0.0 | **Ratified**: 2026-01-27 | **Last Amended**: 2026-01-27
