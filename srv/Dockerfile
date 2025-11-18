FROM node:20-alpine AS builder

WORKDIR /src

COPY package*.json ./
RUN npm ci

COPY . .


FROM node:20-alpine

WORKDIR /src


COPY --from=builder /src/package*.json ./
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src ./


ENV PORT=5679
EXPOSE 5679


CMD ["node", "server.js"]