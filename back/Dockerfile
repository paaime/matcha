FROM node:latest

WORKDIR /back

# Copy the project into the container
COPY . .

RUN npm install

EXPOSE 3001

# Start Express.js
CMD ["npm", "run", "dev"]
# ! 'dev' pour le developpement, 'start' pour la production
