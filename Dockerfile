# ===============================
# Stage 1: Build the application
# ===============================

ARG NODE_VERSION=24.7.0-alpine
ARG NGINX_VERSION=alpine3.22

# Use a lightweight Node.js image for building the application
FROM node:${NODE_VERSION} AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies using npm ci (clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the application source code to the working directory
COPY . .

# Build the application (assuming a build script is defined in package.json)
RUN npm run build

# ===============================
# Stage 2: Serve the application with Nginx
# ===============================

# Use a lightweight Nginx image to serve the built application
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# Copy the built application from the builder stage to Nginx's default HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Use a built-in non-root user for better security
USER nginx

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy public assets with appropriate ownership
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 5173

# Start Nginx when the container launches
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]

CMD ["-g", "daemon off;"]