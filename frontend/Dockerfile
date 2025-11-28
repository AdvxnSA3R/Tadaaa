# Dependencies stage using Node.js
FROM node:24 AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Build stage using Node.js
FROM node:24 AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY ./ ./
RUN npm run build

# Production image using Nginx to serve the exported static site
FROM nginx:1-alpine-slim

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
