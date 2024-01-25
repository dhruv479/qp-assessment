# BASE =========================
FROM node:16-alpine AS base-env
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
USER node
WORKDIR /usr/src/app
EXPOSE 4000

# COMMON PACKAGES =====================
FROM base-env AS server-env
COPY --chown=node:node package.json package.json
RUN npm install
COPY --chown=node:node . .

# BUILD STAGE =======================
# Server
FROM server-env AS server-build-env
ENV NODE_ENV=production
ENV PORT=4000
RUN npm run build

# DEPLOYMENT STAGE =====================
# Server
FROM server-build-env AS server-deploy-env
ENV NODE_ENV=production
COPY --chown=node:node --from=server-build-env /usr/src/app/dist dist
ENTRYPOINT [ "npm", "run", "start:debug" ]
