<div align="center">
  <h1>
    <img src="https://img.icons8.com/color/48/000000/book.png" alt="Book" width="30"/>
    <img src="https://img.icons8.com/color/48/000000/graduation-cap.png" alt="Learning" width="30"/>
    Benkyoshi
    <img src="https://img.icons8.com/color/48/000000/code.png" alt="Code" width="30"/>
    <img src="https://img.icons8.com/color/48/000000/brain.png" alt="Intelligence" width="30"/>
  </h1>
  
  <p>A modern monorepo using Turborepo with Next.js web application, Python model service, and BullsMQ worker.</p>
  
  <div>
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
    <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img alt="Python" src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img alt="TurboRepo" src="https://img.shields.io/badge/TurboRepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" />
    <img alt="Redis" src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  </div>
</div>

## Overview

This project is structured as a monorepo using Turborepo for efficient builds and development workflows. It consists of multiple interconnected applications and shared packages to create a seamless development experience.

## Project Structure

```
├── apps/                 # Application services
│   ├── model/            # Python ML model service
│   ├── web/              # Next.js frontend application
│   └── worker/           # Background processing worker
├── packages/             # Shared libraries
│   ├── db/               # Database utilities and schema
│   ├── eslint-config/    # ESLint configurations
│   ├── queue/            # Queue management system
│   ├── typescript-config/# TypeScript configurations
│   └── ui/               # Shared UI components
└── .turbo/               # Turborepo cache and configuration
```

## Applications

### Web Application (Next.js)

The `web` application is built with Next.js 15 using React 19 and includes:

- UI components with Radix UI and Tailwind CSS
- Form handling with react-hook-form and zod validation
- Authentication services
- State management with Zustand
- Chart visualization with Recharts

### Python Model Service

The `model` application handles machine learning processing. It's written in Python and provides API endpoints for ML functionalities.

### Worker Service

The `worker` service manages background tasks and asynchronous processing, built with TypeScript.

## Shared Packages

- **db**: Database access layer with Drizzle ORM
- **ui**: Shared React component library
- **queue**: Task queue management
- **eslint-config**: Standardized ESLint configurations
- **typescript-config**: Shared TypeScript configurations

## Getting Started

### Prerequisites

- Node.js 18 or later
- Yarn package manager
- Docker and Docker Compose (for local development)
- Python (for the model service)

### Installation

1. Clone the repository
2. Install dependencies:

```sh
yarn install
```

3. Start the development environment:

```sh
# Start Docker services (PostgreSQL, Redis, etc.)
yarn docker:up

# Start development servers
yarn dev
```

## Development Workflow

### Running in Development Mode

To develop all apps and packages:

```sh
yarn dev
```

### Building for Production

To build all apps and packages:

```sh
yarn build
```

### Type Checking

Run TypeScript type checks across the entire project:

```sh
yarn check-types
```

### Linting

Run ESLint across the project:

```sh
yarn lint
```

## Docker Commands

The project includes several Docker-related commands for managing services:

```sh
# Start all Docker services
yarn docker:up

# Stop all Docker services
yarn docker:down

# View Docker container logs
yarn docker:logs

# List running Docker containers
yarn docker:ps

# Restart Docker services
yarn docker:restart
```

## Turborepo Features

This project leverages Turborepo for optimized builds:

- **Task Pipeline**: Efficiently runs tasks with proper dependencies
- **Caching**: Speeds up builds by caching previous runs
- **Parallel Execution**: Runs tasks in parallel when possible

### Remote Caching

Turborepo can use [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines:

```sh
# Authenticate with Vercel
yarn turbo login

# Link to your Remote Cache
yarn turbo link
```

## Useful Links

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
