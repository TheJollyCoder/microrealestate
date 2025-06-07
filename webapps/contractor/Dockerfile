FROM node:18-alpine AS base

FROM base AS deps
RUN apk --no-cache add libc6-compat
RUN corepack enable && \
    corepack prepare yarn@3.3.0 --activate
WORKDIR /usr/app
COPY package.json .
COPY .yarnrc.yml .
COPY yarn.lock .
COPY .yarn/plugins .yarn/plugins
COPY .yarn/releases .yarn/releases
COPY webapps/contractor/package.json webapps/contractor/package.json
RUN --mount=type=cache,id=node_modules,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn \
    yarn workspaces focus @microrealestate/contractor

FROM base AS build
WORKDIR /usr/app
ARG CONTRACTOR_BASE_PATH
ENV BASE_PATH=$CONTRACTOR_BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=$CONTRACTOR_BASE_PATH
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /usr/app ./
COPY webapps/contractor/.eslintrc.json webapps/contractor
COPY webapps/contractor/components.json webapps/contractor
COPY webapps/contractor/next.config.js webapps/contractor
COPY webapps/contractor/package.json webapps/contractor
COPY webapps/contractor/postcss.config.js webapps/contractor
COPY webapps/contractor/tailwind.config.ts webapps/contractor
COPY webapps/contractor/tsconfig.json webapps/contractor
COPY webapps/contractor/locales webapps/contractor/locales
COPY webapps/contractor/public webapps/contractor/public
COPY webapps/contractor/src webapps/contractor/src
RUN  yarn workspace @microrealestate/contractor run build

FROM base
WORKDIR /usr/app
ARG CONTRACTOR_BASE_PATH
ENV BASE_PATH=$CONTRACTOR_BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=$CONTRACTOR_BASE_PATH
ENV DOCKER_GATEWAY_URL=$DOCKER_GATEWAY_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_DEMO_MODE=$NEXT_PUBLIC_DEMO_MODE
ENV NEXT_PUBLIC_GATEWAY_URL=$NEXT_PUBLIC_GATEWAY_URL
ENV NEXT_PUBLIC_NODE_ENV=$NEXT_PUBLIC_NODE_ENV
ENV PORT=$PORT
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build /usr/app/webapps/contractor/public ./public
COPY --from=build /usr/app/webapps/contractor/.next/standalone/node_modules ./node_modules
COPY --from=build /usr/app/webapps/contractor/.next/standalone/webapps/contractor ./
COPY --from=build /usr/app/webapps/contractor/.next/static ./.next/static
CMD ["node", "server.js"]
