FROM node:20-alpine AS builder

WORKDIR /src

COPY package*.json ./
RUN npm install


COPY . .

RUN npm run build


FROM node:20-alpine

WORKDIR /


COPY --from=builder /src/package*.json ./
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src ./


ENV PORT=5679
EXPOSE 5679


CMD ["node", "dist/server.js"]