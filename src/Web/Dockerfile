FROM nginx:1.21.6-alpine AS base
WORKDIR /app
EXPOSE 80
COPY ["Web/nginx.conf", "/etc/nginx/nginx.conf"]

FROM node:16.15.0-alpine as build
WORKDIR /src
COPY ["Web/", "."]
WORKDIR /src
RUN yarn
RUN yarn build

FROM base AS final
WORKDIR /app
COPY --from=build /src/build /app/wwwroot
