NAME				= matcha
YML_FILE		= docker-compose.yml
ENV_FILE		= ./.env

all: build

install:
	cd ./app && pnpm install

build:
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) up --build --remove-orphans

stop:
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) stop

down:
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) down

up:
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) up

# TODO remove
upBack: 
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) up back

# TODO remove
upApp:
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) up app

clean: stop
	docker system prune -af
	docker volume prune -f

.PHONY: all install build stop down up clean
