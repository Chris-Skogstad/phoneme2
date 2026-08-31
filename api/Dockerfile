# Use Node LTS as the base image
FROM node:lts

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy local wait-for-it script and make it executable
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# Copy Prisma schema and app code
COPY prisma ./prisma
COPY . .

# Copy and set permissions for entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Generate Prisma client during build
RUN npx prisma generate

# Optional: Fix permissions
RUN chown -R node:node /app/node_modules && chmod -R 775 /app/node_modules

# Expose API port
EXPOSE 3000

# Use entrypoint script to start the app
CMD ["/bin/sh", "/app/entrypoint.sh"]