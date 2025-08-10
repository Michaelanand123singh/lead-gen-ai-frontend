# Frontend Dockerfile (Vite + React → Nginx)

## Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies separately for better layer caching
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .

# Allow passing API base URL at build time
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

## Runtime stage
FROM nginx:alpine

# Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]


