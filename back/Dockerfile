FROM node:latest

WORKDIR /back

# Copy the project into the container
COPY . .

RUN rm -rf node_modules

RUN npm install -g nodemon ts-node
RUN npm install
RUN npm run build

EXPOSE 3001

# Start Express.js
CMD ["npm", "run", "dev"]
# # ! 'dev' pour le developpement, 'start' pour la production
