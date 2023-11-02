# Use an official Node.js runtime as a base image
FROM node:14

# Create app directory
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set the working directory in the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your Node.js application will run on
EXPOSE 3333

# Define the command to start your Node.js application
CMD ["npm", "run", "dev:prod"]
