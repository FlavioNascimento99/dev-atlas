# syntax=docker/dockerfile:1

FROM oven/bun:1.4.2 AS bun

# Next.js runs on Node; Bun is only the package manager and script runner.
FROM node:26-slim AS build
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.29-alpine
LABEL com.devatlas.task="mvp"
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
