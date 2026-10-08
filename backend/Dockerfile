FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma schema & generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY src ./src/

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
