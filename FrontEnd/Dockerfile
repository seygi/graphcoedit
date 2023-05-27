# Use a base Node.js image for building the frontend
FROM node:16-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the frontend
RUN npm run build

# Use a lightweight Nginx image to serve the built frontend
FROM nginx:alpine

# Copy the built frontend from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 for the frontend
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
