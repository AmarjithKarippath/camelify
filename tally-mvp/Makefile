COMPOSE_FILE := docker/docker-compose.yml
ENV_FILE := docker/.env
SITE_NAME := frontend

.PHONY: up down logs setup migrate seed shell status

up:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d
	@echo "ERPNext starting at http://localhost:8080 (first boot may take 5-10 min)"

down:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down

logs:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs -f

setup:
	./docker/setup.sh

migrate:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) exec -T backend \
		bench --site $(SITE_NAME) execute tally_mvp.scripts.migrate_masters.run
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) exec -T backend \
		bench --site $(SITE_NAME) execute tally_mvp.scripts.migrate_opening_balances.run

seed:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) exec -T backend \
		bench --site $(SITE_NAME) execute tally_mvp.scripts.seed_demo_data.run

shell:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) exec backend bash

status:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) ps
