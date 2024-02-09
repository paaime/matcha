FROM node:latest

WORKDIR /app

# Copy the project into the container
COPY . .

# Install pnpm
RUN npm install -g pnpm

RUN pnpm install
RUN pnpm build

EXPOSE 3000

# Start Next.js
CMD ["pnpm", "dev"]
# ! 'dev' pour le développement, 'start' pour la production