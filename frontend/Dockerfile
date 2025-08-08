# Etapa 1: build de Vite (React)
FROM --platform=linux/amd64 node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: servidor estático con Nginx
FROM --platform=linux/amd64 nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
