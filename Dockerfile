# Stage 1: Build the project
FROM node:alpine AS build

WORKDIR /app

# Copy project files into the docker image
COPY . .

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies and build the project
RUN pnpm install
RUN pnpm run build

# Stage 2: Setup Nginx to serve the `dist` folder
FROM nginx:alpine AS serve

# Copy built assets from the build stage to the Nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the container
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
