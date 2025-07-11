# Code Upload System

This system allows users to upload code files with specific extensions to S3, view them with syntax highlighting, and format them using built-in formatters.

## Features

- **Code File Upload**: Upload JavaScript, TypeScript, Python, Go, and Rust files (up to 10MB)
- **Syntax Highlighting**: Code is displayed with proper syntax highlighting
- **Code Formatting**: Built-in formatters for each supported language
- **Slug-based Access**: Access files via unique slugs
- **Public/Private Access**: Control who can view your code
- **S3 Storage**: Secure cloud storage with presigned URLs
- **Database Tracking**: All file metadata stored in MongoDB
- **User Authentication**: Secure access control

## Supported File Types

### JavaScript

- `.js`, `.jsx`, `.mjs`
- Content Type: `text/javascript`, `application/javascript`

### TypeScript

- `.ts`, `.tsx`
- Content Type: `text/typescript`, `application/typescript`

### Python

- `.py`, `.pyw`, `.pyi`
- Content Type: `text/x-python`

### Go

- `.go`
- Content Type: `text/x-go`

### Rust

- `.rs`
- Content Type: `text/x-rust`

## Database Schema

### Code Model

```prisma
model Code {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  slug            String   @unique
  title           String
  description     String?
  s3Key           String
  language        Language @default(JAVASCRIPT)
  exploitLocation String
  access          Access   @default(public)
  userId          String   @db.ObjectId
  user            User?    @relation("UserCodes", fields: [userId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## API Endpoints

### Upload Code

- **POST** `/api/code`
- Requires authentication
- Returns presigned URL for S3 upload

### List Code Files

- **GET** `/api/code/list`
- Shows current user's code (authenticated)
- **GET** `/api/code/list?username=...`
- Shows public code for specific user

### Format Code

- **POST** `/api/code/format`
- Formats code based on language
- Supports JavaScript, TypeScript, Python, Go, Rust

### Upload Completion

- **POST** `/api/code/upload`
- Handles final upload step and generates download URLs

## Pages

### Code Upload Page

- **Route**: `/code`
- Upload form with file selection and metadata
- Real-time validation and progress tracking
- Code preview and formatting

### Code Viewer

- **Route**: `/code/[username]/[slug]/[filename]`
- Full-screen code viewer with syntax highlighting
- Format, copy, and download functionality
- Access control (public/private)

## Components

### CodeUpload

- File selection with validation
- Metadata input (title, description, slug, access, exploit location)
- Code preview and formatting
- Upload progress tracking
- Error handling

### CodeViewer

- Displays code with syntax highlighting
- Format code functionality
- Copy to clipboard
- Download functionality
- Language-specific formatting

### CodeGallery

- Grid layout for code files
- Quick actions (view, download)
- Language badges and metadata
- Empty state handling

## Usage

1. **Upload Code**:

   - Navigate to `/code`
   - Select a code file (JavaScript, TypeScript, Python, Go, Rust)
   - Fill in title, description, slug, and exploit location
   - Choose public or private access
   - Preview and format code if needed
   - Click upload

2. **View Code**:

   - Access via URL: `/code/[username]/[slug]/[filename]`
   - Or browse gallery at `/code`

3. **Format Code**:

   - Use the "Format" button in the code viewer
   - Code will be formatted according to language-specific rules

4. **Share Code**:

   - Public code can be shared via URL
   - Private code only accessible to owner

## Code Formatting

The system includes basic formatting for each supported language:

### JavaScript/TypeScript

- Proper spacing around operators
- Whitespace cleanup
- Basic indentation

### Python

- Consistent 4-space indentation
- Line-by-line formatting
- Whitespace cleanup

### Go/Rust

- Basic operator spacing
- Whitespace cleanup
- Simple formatting rules

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── code/
│   │       ├── route.ts              # Upload endpoint
│   │       ├── list/
│   │       │   └── route.ts          # List code endpoint
│   │       ├── upload/
│   │       │   └── route.ts          # Upload completion
│   │       └── format/
│   │           └── route.ts          # Code formatting
│   └── code/
│       ├── page.tsx                  # Main code page
│       └── [username]/[slug]/[filename]/
│           └── page.tsx              # Code viewer page
├── components/
│   └── code/
│       ├── code-upload.tsx           # Upload component
│       ├── code-viewer.tsx           # Viewer component
│       ├── code-gallery.tsx          # Gallery component
│       └── README.md                 # This file
└── s3/
    └── constants.ts                  # Updated with code file types
```

## Environment Variables

Ensure these are set in your `.env` file:

- `DATABASE_URL`: MongoDB connection string
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region
- `S3_BUCKET_NAME`: S3 bucket name

## Security Features

- **File Type Validation**: Only allowed extensions can be uploaded
- **File Size Limits**: 10MB maximum for code files
- **Access Control**: Public/private access control
- **Authentication**: All uploads require user authentication
- **S3 Security**: Files stored securely with presigned URLs
- **Input Validation**: All inputs validated with Zod schemas
