.DEFAULT_GOAL := help
SHELL := /bin/bash

COMPOSE      := docker compose
COMPOSE_DEV  := docker compose -f docker-compose.dev.yml

.PHONY: help
help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nCamelify — Make targets\n\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# ----- Local: web (no docker) -----
.PHONY: install dev build start lint clean
install: ## npm install for the landing page
	npm install

dev: ## Run Next.js dev locally
	npm run dev

build: ## Build Next.js bundle locally
	npm run build

start: ## Start built Next.js locally
	npm run start

lint: ## Lint locally
	npm run lint

clean: ## Remove local build artifacts
	rm -rf .next node_modules

# ----- Local: api (no docker) -----
.PHONY: api-install api-dev api-test
api-install: ## Install API deps in a local venv
	cd api && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt

api-dev: ## Run uvicorn locally (requires local Postgres on :5432)
	cd api && . .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

api-test: ## Hit /healthz on running API
	curl -fsS http://localhost:8000/healthz | jq . || true

# ----- Docker: production -----
.PHONY: up down restart logs ps shell rebuild
up: ## Start prod stack (web + api + postgres)
	$(COMPOSE) up -d --build

down: ## Stop prod stack
	$(COMPOSE) down

restart: ## Restart all services
	$(COMPOSE) restart

logs: ## Tail prod logs
	$(COMPOSE) logs -f --tail=200

ps: ## Show running containers
	$(COMPOSE) ps

shell: ## Open shell in the api container
	$(COMPOSE) exec api sh

rebuild: ## Rebuild all images without cache
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

# ----- Docker: dev -----
.PHONY: dev-up dev-down dev-logs dev-shell-web dev-shell-dashboard dev-shell-api dev-rebuild
dev-up: ## Start dev stack (web + dashboard + api + postgres)
	$(COMPOSE_DEV) up --build

dev-down: ## Stop dev stack
	$(COMPOSE_DEV) down

dev-logs: ## Tail dev logs
	$(COMPOSE_DEV) logs -f --tail=200

dev-shell-web: ## Shell into web (Next.js dev)
	$(COMPOSE_DEV) exec web sh

dev-shell-dashboard: ## Shell into dashboard (Vite dev)
	$(COMPOSE_DEV) exec dashboard sh

dev-shell-api: ## Shell into api (FastAPI dev)
	$(COMPOSE_DEV) exec api sh

dev-rebuild: ## Rebuild dev images without cache
	$(COMPOSE_DEV) build --no-cache

# ----- Database -----
.PHONY: db-shell db-revision db-upgrade db-downgrade db-reset
db-shell: ## psql into the dev postgres
	$(COMPOSE_DEV) exec postgres psql -U camelify -d camelify

db-revision: ## Create a new Alembic migration (usage: make db-revision m="add users")
	$(COMPOSE_DEV) exec api alembic revision --autogenerate -m "$(m)"

db-upgrade: ## Apply all pending migrations
	$(COMPOSE_DEV) exec api alembic upgrade head

db-downgrade: ## Downgrade one revision
	$(COMPOSE_DEV) exec api alembic downgrade -1

db-reset: ## Drop + recreate the dev DB (DESTRUCTIVE)
	$(COMPOSE_DEV) down -v
	$(COMPOSE_DEV) up -d postgres

# ----- Production (run on the VPS) -----
.PHONY: prod-deploy prod-pull prod-rebuild prod-up prod-down prod-restart prod-logs prod-ps prod-shell-api prod-backup prod-migrate
prod-deploy: ## Full deploy: pull, rebuild, migrate, restart
	git pull
	$(COMPOSE) build
	$(COMPOSE) up -d
	$(COMPOSE) exec -T api alembic upgrade head
	$(COMPOSE) ps

prod-pull: ## Pull latest code (no rebuild)
	git pull

prod-rebuild: ## Rebuild images
	$(COMPOSE) build

prod-up: ## Start the prod stack
	$(COMPOSE) up -d

prod-down: ## Stop the prod stack
	$(COMPOSE) down

prod-restart: ## Restart all services
	$(COMPOSE) restart

prod-logs: ## Tail prod logs
	$(COMPOSE) logs -f --tail=200

prod-ps: ## Show running prod containers
	$(COMPOSE) ps

prod-shell-api: ## Shell into the api container
	$(COMPOSE) exec api sh

prod-migrate: ## Run pending Alembic migrations
	$(COMPOSE) exec -T api alembic upgrade head

prod-backup: ## Run a one-off backup (postgres + media)
	./scripts/backup.sh

# ----- Housekeeping -----
.PHONY: prune nuke
prune: ## Remove dangling images/volumes
	docker system prune -f

nuke: ## Destroy everything (DESTRUCTIVE)
	-$(COMPOSE) down -v --rmi all --remove-orphans
	-$(COMPOSE_DEV) down -v --rmi all --remove-orphans
