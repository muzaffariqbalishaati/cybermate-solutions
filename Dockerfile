FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application files
COPY whatsapp-bot.cjs ./

# Expose port
EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production

CMD ["node", "whatsapp-bot.cjs"]
