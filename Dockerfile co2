FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/db/package.json ./packages/db/
COPY packages/queue/package.json ./packages/queue/

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build packages - make sure all TypeScript is compiled to JavaScript
RUN npm run build

# Verify that all packages are built correctly
RUN npm run build --workspace=packages/db
RUN npm run build --workspace=packages/queue
RUN npm run build --workspace=apps/worker

# Set environment variables
ENV NODE_ENV=production
# Add this to prevent Node.js from trying to load .ts files
ENV NODE_OPTIONS="--no-warnings --loader=ts-node/esm"

# Start command - use node directly to ensure proper execution
CMD ["node", "apps/worker/dist/index.js"]