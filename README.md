# Snipkit

## Overview

Snipkit is a modern web application designed for developers to effortlessly store, manage, and share their code snippets. Whether you're uploading a file or writing code directly in our feature-rich editor, Snipkit provides a centralized and secure platform for all your coding needs. Browse public snippets for inspiration or keep your work private in your personal dashboard.

## Key Features

- **Secure Authentication**: Sign up and log in to manage your personal code snippets securely.
- **Dual Code Input**: Either upload your code files directly or write/paste code into the in-app editor.
- **Rich Code Editor**: Enjoy syntax highlighting for a wide range of languages including JavaScript, TypeScript, Python, Go, Rust, and more.
- **Snippet Management**: Organize your code with custom titles, descriptions, and searchable slugs.
- **Access Control**: Choose whether to keep your snippets private or make them public for the community to see and use.
- **Personal Dashboard**: View and manage all your saved code snippets in a clean, gallery-style dashboard.
- **Public Gallery**: Explore code snippets shared by other users.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: PostgreSQL (managed with [Prisma ORM](https://www.prisma.io/))
- **File Storage**: [AWS S3](https://aws.amazon.com/s3/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- A running PostgreSQL instance
- AWS S3 bucket and credentials

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Bharat1056/Snipkit.git
    cd Snipkit
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary environment variables. You'll need to configure your database connection, NextAuth secret, and AWS credentials.

    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # AWS S3 Credentials
    S3_ACCESS_KEY_ID="your-s3-access-key"
    S3_SECRET_ACCESS_KEY="your-s3-secret-key"
    S3_REGION="your-s3-region"
    S3_BUCKET_NAME="your-s3-bucket-name"
    ```

4.  **Sync the database schema:**
    Push the Prisma schema to your database to create the necessary tables.
    ```bash
    npx prisma db push
    ```

## Usage

To run the application in development mode, execute the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Test

# Another test

# Test invalid message
