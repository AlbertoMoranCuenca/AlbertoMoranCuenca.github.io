FROM node:lts AS build

RUN npm install -g pnpm

WORKDIR /app
COPY . .

RUN pnpm install
RUN pnpm run build

FROM httpd:2.4 AS runtime
COPY --from=build /app/dist /usr/local/apache2/htdocs/

EXPOSE 80
