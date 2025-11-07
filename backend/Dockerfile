# Backend Dockerfile for Koyeb
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install deps (include devDependencies for babel-node)
COPY package*.json ./
RUN npm install --include=dev

# Copy source
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
