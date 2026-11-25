# Desenvolvimento local: site (Next.js, porta 3000) + backend (PocketBase, porta 8090).
#
#   make dev        sobe os dois juntos (Ctrl+C encerra os dois)
#   make web        só o site
#   make backend    só o backend
#   make check      TypeScript + go vet
#   make build      build do site e do backend
#
# Primeiro acesso ao painel /admin (opcional; cria o admin se não existir):
#   make dev ATC_ADMIN_EMAIL=voce@exemplo.com ATC_ADMIN_PASSWORD=uma-senha
# Ou crie um superusuário: make superuser EMAIL=voce@exemplo.com SENHA=uma-senha

SHELL := /bin/bash
.DEFAULT_GOAL := dev
.PHONY: dev web backend check build superuser reset-data

export POCKETBASE_URL ?= http://127.0.0.1:8090
export ATC_ADMIN_EMAIL
export ATC_ADMIN_PASSWORD

dev:
	@echo "Site:    http://localhost:3000   (painel em /admin)"
	@echo "Backend: http://127.0.0.1:8090   (PocketBase em /_/)"
	@cd backend && go build -o atc-backend .
	@trap 'trap - INT TERM EXIT; kill 0 2>/dev/null' INT TERM EXIT; \
	(cd backend && ./atc-backend serve --http=127.0.0.1:8090 --dev=false 2>&1 | sed -u 's/^/[backend] /') & \
	(pnpm dev 2>&1 | sed -u 's/^/[web] /') & \
	wait

web:
	pnpm dev

backend:
	cd backend && go run . serve --http=127.0.0.1:8090

check:
	pnpm exec tsc --noEmit
	cd backend && go vet ./...

build:
	pnpm build
	cd backend && go build -o atc-backend .

superuser:
	@test -n "$(EMAIL)" -a -n "$(SENHA)" || { echo "Use: make superuser EMAIL=... SENHA=..."; exit 1; }
	cd backend && go run . superuser upsert "$(EMAIL)" "$(SENHA)"

# Apaga visitas e leads locais (backend/pb_data). Não afeta produção.
reset-data:
	rm -rf backend/pb_data
