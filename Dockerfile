FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/db/package.json ./packages/db/
COPY packages/queue/package.json ./packages/queue/

# Install dependencies
RUN pnpm install

# Copy source files
COPY . .

# Build packages
RUN pnpm build

# Set environment variables
ENV NODE_ENV=production

# Run the worker
CMD ["node", "apps/worker/dist/index.js"]