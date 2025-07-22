# File Ignore Patterns

The file upload system automatically filters out unwanted files using ignore patterns similar to `.gitignore`. This helps keep your uploads clean and focused on the important code files.

## How It Works

1. **Default Ignore Patterns**: Always applied to filter out common unwanted files
2. **Custom Ignore Patterns**: Optionally specified using a `.snipkitignore` file
3. **Smart Filtering**: Files are automatically filtered during selection

## Default Ignore Patterns

The following patterns are always applied:

```
node_modules/**       # Dependencies
.git/**              # Git repository files
.next/**             # Next.js build files
.turbo/**            # Turborepo cache
.vercel/**           # Vercel deployment files
dist/**              # Distribution/build folders
build/**             # Build output folders
coverage/**          # Code coverage reports
.cache/**            # Cache directories
*.log                # Log files
.DS_Store            # macOS system files
.idea/**             # IntelliJ IDEA files
.vscode/**           # VS Code settings
__pycache__/**       # Python cache
*.pyc                # Python compiled files
.venv/**             # Python virtual environments
venv/**              # Python virtual environments
env/**               # Environment folders
*.svg                # SVG images
*.png                # PNG images
*.jpg                # JPEG images
*.jpeg               # JPEG images
*.m4a                # Audio files
*.mps                # Audio files
.pytest_cache/**     # Python test cache
.terraform/**        # Terraform files
target/**            # Rust/Java build targets
vendor/**            # Vendor dependencies
.cargo/**            # Rust package manager
.gradle/**           # Gradle build system
.mvn/**              # Maven build system
*.class              # Java compiled files
*.swp                # Vim swap files
*.iml                # IntelliJ module files
```

## Custom Ignore Patterns

You can specify additional patterns by including a `.snipkitignore` file in your folder selection. This file works similar to `.gitignore`:

### Example `.snipkitignore` file:

```
# Custom ignore patterns
*.tmp
temp/
secrets.json
config/local.json

# Project-specific patterns
docs/drafts/**
experimental/**
*.backup
```

### Pattern Syntax

- **Exact matches**: `filename.txt`
- **Wildcards**: `*.log` (all .log files)
- **Directories**: `temp/` or `temp/**` (entire directories)
- **Nested paths**: `src/temp/**` (specific nested directories)
- **Comments**: Lines starting with `#` are ignored
- **Empty lines**: Automatically ignored

## Usage Examples

### Uploading a Project Folder

1. Select your project folder
2. The system automatically reads `.snipkitignore` if present
3. Files are filtered using both default and custom patterns
4. You'll see a toast notification showing what was ignored

### Custom Ignore File Example

Create a `.snipkitignore` file in your project root:

```
# Ignore test data
test-data/**
*.test.json

# Ignore temporary files
*.tmp
*.temp
temp/**

# Ignore sensitive files
.env.local
secrets/**
```

### What Gets Filtered

When you upload a folder containing:

```
my-project/
├── src/
│   ├── index.js
│   └── utils.js
├── node_modules/
│   └── (thousands of files)
├── .git/
│   └── (git files)
├── dist/
│   └── bundle.js
├── .snipkitignore
├── temp/
│   └── debug.log
└── README.md
```

Only these files would be uploaded:

```
src/index.js
src/utils.js
README.md
```

## Benefits

1. **Cleaner Uploads**: Automatically excludes build artifacts and dependencies
2. **Faster Processing**: Fewer files to process and upload
3. **Better Organization**: Focuses on source code rather than generated files
4. **Customizable**: Project-specific ignore patterns via `.snipkitignore`
5. **Familiar**: Uses standard glob pattern syntax

## Notes

- The `.snipkitignore` file itself is never uploaded
- Patterns are case-sensitive by default
- Use forward slashes (`/`) for path separators on all platforms
- Patterns support standard glob syntax with `*`, `**`, `?`, etc.
- If file filtering fails, uploads continue with all files (fail-safe behavior)
