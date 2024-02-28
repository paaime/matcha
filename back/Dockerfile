FROM node:latest

WORKDIR /back

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 3001

CMD ["pnpm", "dev"]

# # Copy the project into the container
# COPY . .

# RUN npm install

# EXPOSE 3001

# # Start Express.js
# CMD ["npm", "run", "dev"]
# # ! 'dev' pour le developpement, 'start' pour la production
