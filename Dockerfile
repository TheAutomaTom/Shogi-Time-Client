# STAGE 1- BUILD
# Use a Node.js image to build the app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application source code
COPY . .
COPY .env .env

# Build the app for production, ignoring errors
RUN pnpm run build-without-typecheck


# STAGE 2 - DEPLOY
# Use a lightweight Nginx image to serve the app
FROM nginx:alpine

# Copy the built files from the first stage to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
