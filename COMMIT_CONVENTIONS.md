# Commit Message Conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

## Format

```
<type>(<scope>): <description>
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation
- **perf**: A code change that improves performance
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

## Scope

The scope is optional and should be lowercase with hyphens. Examples:

- `auth` - Authentication related changes
- `ui` - User interface changes
- `api` - API related changes
- `db` - Database related changes

## Description

- Use lowercase
- No period at the end
- Keep it concise but descriptive

## Examples

✅ Good commit messages:

```
feat(auth): add user authentication
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
chore: update dependencies
refactor(api): simplify user endpoint
test(auth): add login validation tests
```

❌ Bad commit messages:

```
Added user auth
FIX: button bug
Update docs
feat: Add new feature
feat(Auth): Add authentication
```

## Pre-commit Hooks

This project uses Husky to enforce:

1. **Code Formatting**: Prettier automatically formats your code
2. **Linting**: ESLint checks for code quality issues
3. **Type Checking**: TypeScript validates types
4. **Commit Message Validation**: Ensures proper commit message format

## Setup

To set up the pre-commit hooks:

```bash
npm install
npm run prepare
```

The hooks will run automatically on every commit.

## Regex Pattern

The commit message validation uses this regex pattern:

```
^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\([a-z0-9-]+\))?: [a-z][^:]*$
```

This ensures:

- Valid commit types
- Optional scope in parentheses
- Proper colon and space format
- Lowercase description without trailing period
