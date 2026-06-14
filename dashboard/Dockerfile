# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app
ENV CI=1

# ---------- Dev (hot reload) ----------
FROM base AS dev
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ---------- Builder ----------
FROM base AS builder
ARG VITE_API_URL
ARG VITE_LANDING_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_LANDING_URL=${VITE_LANDING_URL}
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

# ---------- Runner (nginx) ----------
FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
