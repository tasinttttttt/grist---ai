FROM node:alpine AS base

WORKDIR /app
RUN apk add --no-cache \
	curl \
    unzip \
    ca-certificates
COPY . .
RUN corepack enable pnpm
RUN pnpm install
RUN pnpm run build
COPY /app/build /var/html/app
COPY entrypoint.sh /entrypoint.sh

EXPOSE 3000 8090
CMD ["/entrypoint.sh"]
