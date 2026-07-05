FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Set default port
ENV PORT=8000
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
