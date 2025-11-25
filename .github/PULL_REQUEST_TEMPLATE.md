## 🔄 Pull Request

### 📝 Description

<!-- Briefly describe the changes in this PR -->

### 🎯 Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🎨 UI/UX changes
- [ ] 🔒 Security update
- [ ] 🧪 Test changes
- [ ] 🔄 CI/CD changes

### 🧪 Testing Checklist

<!-- Verify all testing requirements are met -->

### 🤖 CI / Artifacts (auto-generated)

- [ ] **CI Status**: All checks passed (link to Actions)
- [ ] **E2E Report**: Playwright HTML report artifact attached (`playwright-report.zip`)
- [ ] **LHCI Summary**: Lighthouse CI scores attached or in PR comment (Perf/A11y)
- [ ] **Coverage Report**: Test coverage report available in artifacts
- [ ] **Build Artifacts**: Production build completed successfully

### 🗄️ DB / Migration (required if schema changed)

- [ ] **Schema Changes**: Did you modify IndexedDB schema or stores? If yes:
  - Provide migration notes and `clearDB()` / migration script
  - Confirm backward compatibility with existing exported JSON (or include migration path)
  - Test migration with existing user data
- [ ] **Data Migration**: Migration tested with sample data
- [ ] **Version Compatibility**: Old app versions can handle new data format

### 📊 Test Evidence

- [ ] **Unit Test Coverage**: Coverage for changed modules (attach coverage percent for modified files)
- [ ] **E2E Test Results**: Screenshots/recordings of E2E test execution
- [ ] **Manual Testing**: Screenshots / short GIFs for UI changes (if applicable)
- [ ] **Performance Metrics**: Before/after performance comparison (if applicable)

### 🧪 Core Testing Requirements

- [ ] **Unit Tests**: All tests pass locally (`npm test`)
- [ ] **E2E Tests**: Playwright tests pass locally (`npm run test:e2e`)
- [ ] **Type Checking**: TypeScript compiles without errors (`npm run type-check`)
- [ ] **Linting**: ESLint passes (`npm run lint`)
- [ ] **Build**: Project builds successfully (`npm run build`)

### ♿ Accessibility Checklist

<!-- Ensure accessibility standards are maintained -->

- [ ] **Keyboard Navigation**: All interactive elements are keyboard accessible
- [ ] **Screen Reader**: Content is properly structured with semantic HTML
- [ ] **ARIA Labels**: Appropriate ARIA attributes are used where needed
- [ ] **Color Contrast**: Text meets WCAG AA contrast requirements
- [ ] **Focus Management**: Focus indicators are visible and logical
- [ ] **Alt Text**: Images have descriptive alt text
- [ ] **Heading Hierarchy**: Proper heading structure (h1→h2→h3)

### 📱 PWA & Performance

<!-- Progressive Web App requirements -->

- [ ] **Service Worker**: SW functionality tested (if modified)
- [ ] **Offline Support**: App works offline where expected
- [ ] **Cache Strategy**: Caching behaves as intended
- [ ] **Performance**: No significant performance regression
- [ ] **Lighthouse Scores**: Performance, Accessibility, Best Practices, SEO scores maintained

### 🗄️ Database & Storage

<!-- Data persistence and migration requirements -->

- [ ] **IndexedDB Migration**: Migration scripts tested (if schema changed)
- [ ] **Data Integrity**: Existing data compatibility verified
- [ ] **Storage Quota**: Storage usage impact considered
- [ ] **Backward Compatibility**: Previous versions can handle new data format
- [ ] **Error Handling**: Database errors are properly handled

### 🔒 Security Checklist

<!-- Security considerations -->

- [ ] **Input Validation**: User inputs are properly sanitized
- [ ] **XSS Prevention**: No potential XSS vulnerabilities introduced
- [ ] **CSRF Protection**: CSRF protections maintained
- [ ] **Environment Variables**: No secrets exposed in client-side code
- [ ] **Dependencies**: No new security vulnerabilities in dependencies

### 📱 Device & Browser Testing

<!-- Cross-platform compatibility -->

- [ ] **Desktop Chrome**: Tested and working
- [ ] **Desktop Firefox**: Tested and working
- [ ] **Desktop Safari**: Tested and working
- [ ] **Mobile Chrome**: Tested and working
- [ ] **Mobile Safari**: Tested and working
- [ ] **Responsive Design**: Works across different screen sizes

### 📋 Pre-merge Checklist

<!-- Final verification before merge -->

- [ ] **Code Review**: Code has been reviewed by at least one team member
- [ ] **Documentation**: Documentation updated (if needed)
- [ ] **Changelog**: Changes documented in appropriate changelog
- [ ] **Breaking Changes**: Breaking changes documented and communicated
- [ ] **Environment Vars**: New environment variables documented
- [ ] **Migration Guide**: Migration steps provided (if needed)

### 🚀 Deployment Checklist

<!-- Production readiness -->

- [ ] **Environment Variables**: All required env vars set in production
- [ ] **Feature Flags**: Feature flags configured appropriately
- [ ] **Monitoring**: Sentry/monitoring setup for new features
- [ ] **Rollback Plan**: Rollback strategy considered
- [ ] **Database Migrations**: Production migration strategy planned

### 📸 Screenshots/Videos

<!-- Visual changes demonstration -->
<!-- Add screenshots or videos if this PR includes UI changes -->

### 🔗 Related Issues

<!-- Link related issues -->

Closes #<!-- issue number -->
Related to #<!-- issue number -->

### 🧑‍💻 Reviewer Notes

<!-- Additional context for reviewers -->

- **Focus Areas**: <!-- What should reviewers pay special attention to? -->
- **Testing Strategy**: <!-- How should reviewers test this? -->
- **Risk Assessment**: <!-- What are the potential risks? -->

### 📋 Post-Merge Tasks

<!-- Tasks to complete after merging -->

- [ ] Update staging environment
- [ ] Notify stakeholders
- [ ] Update documentation site
- [ ] Create follow-up issues
- [ ] Monitor error rates

---

### ✅ Definition of Done

This PR meets the definition of done when:

- All automated tests pass (CI, Lighthouse, Playwright)
- Code review completed and approved
- All checklist items completed
- Documentation updated
- Ready for production deployment

**Reviewer**: Please verify that all applicable checklist items are completed before approving.

**Author**: Please complete all relevant checklist items and provide additional context in the description above.
