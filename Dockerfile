# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

RUN npm install

# Copy the entire frontend code
COPY . .

# Expose port 4200 for Angular
EXPOSE 4200

# Start the Angular application
CMD ["npm", "start"]