ARG NODE_PATH="./frontend/dist"

FROM node:16-alpine as frontend-build
ENV NODE_ENV=production
WORKDIR /app
COPY frontend/package.json ./
RUN npm i && npm cache clean --force
COPY frontend/ .
ARG SERVER_HOST
ARG SUPABASE_ANON_KEY
ARG SUPABASE_URL
ENV VITE_SERVER_HOST=${SERVER_HOST}
ENV VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
ENV VITE_SUPABASE_URL=${SUPABASE_URL}
RUN npm run build

FROM node:16-alpine as prod
ENV NODE_ENV=production
ARG DATABASE_URL
ARG NODE_PATH
WORKDIR /app
COPY backend/package.json ./
RUN npm i && npm cache clean --force && apk add --no-cache tini
COPY backend/ .
COPY --from=frontend-build /app/dist ./frontend/dist/
ENV NODE_PATH=${NODE_PATH}
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate && npm run build
ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 4000
CMD ["node", "dist/server.js"];

FROM frontend-build as frontend-dev
ENV NODE_ENV=development
WORKDIR /app
RUN apk add --no-cache tini && npm i
ENV VITE_SERVER_HOST="http://localhost:4000"
ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM prod as backend-dev
ENV NODE_ENV=development
ARG DATABASE_URL
ARG NODE_PATH
WORKDIR /app
RUN npm i
ENV NODE_PATH=${NODE_PATH}
ENV DATABASE_URL=${DATABASE_URL}
ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 4000
CMD ["npm", "run", "start:dev"]