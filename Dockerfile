FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./

RUN apk add --no-cache zlib-dev make g++ python3

RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
