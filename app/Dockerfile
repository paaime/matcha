FROM node:latest

WORKDIR /app

# Copy the project into the container
COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

# Start Next.js
CMD ["npm", "run", "start"]
# ! 'dev' pour le développement, 'start' pour la production