FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY . .
RUN npm install

# Expose dev server port
EXPOSE 3000

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "dev"]
