# Use the official Node.js 16 Alpine image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN ls
RUN npm run build

# Expose a port (if your application listens on a specific port)
EXPOSE 4040

# Start the application
CMD ["npm", "start"]
