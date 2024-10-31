# Description: Dockerfile for the front-end of the HackADay project

# Use the official Node.js 18 image
FROM node:20-alpine

#use the /app directory as the working directory
WORKDIR /app
COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/

# Install dependencies
RUN npm install

EXPOSE 3000

# Expose the port the app runs on
CMD ["npm", "start"]