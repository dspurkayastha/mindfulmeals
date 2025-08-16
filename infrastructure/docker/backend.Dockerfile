FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/ ./backend/

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
