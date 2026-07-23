# Contributing to StreamHub

Thank you for your interest in contributing to StreamHub! We welcome open-source contributions from developers of all skill levels.

---

## Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## How Can I Contribute?

### Reporting Bugs
Before opening a new issue, search existing issues to ensure it hasn't been reported. When creating a bug report, use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- Clear step-by-step reproduction instructions
- Expected vs. actual behavior
- Relevant error logs or console outputs

### Proposing Feature Enhancements
Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) to explain the problem your feature solves and proposed implementation approach.

---

## Development Workflow

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/StreamHub.git
   cd StreamHub
   ```

2. **Branching Convention**:
   Create a topic branch named according to convention:
   - `feat/feature-name`
   - `fix/bug-description`
   - `docs/documentation-update`

3. **Running Quality Checks**:
   Ensure all checks pass before submitting your PR:
   ```bash
   npm run lint     # Must pass with 0 errors
   npm run test     # Must pass all unit/integration tests
   npm run build    # Must compile cleanly without errors
   ```

4. **Submitting Pull Requests**:
   Open a PR against the `main` branch using the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
