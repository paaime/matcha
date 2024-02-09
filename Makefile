NAME				= matcha
YML_FILE		= docker-compose.yml
ENV_FILE		= ./.env

all: build

build:
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) up --build --remove-orphans

stop:
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) stop

down:
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) down

up:
	docker-compose -p $(NAME) -f $(YML_FILE) --env-file $(ENV_FILE) up

clean: stop
	docker system prune -af
	docker volume prune -f

.PHONY: all build stop down up clean
