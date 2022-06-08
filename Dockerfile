FROM node:18 AS build-env
WORKDIR /app
COPY index.js ./
COPY package*.json ./

RUN npm ci --omit=dev

FROM gcr.io/distroless/nodejs:18
COPY --from=build-env /app /app
WORKDIR /app
CMD ["index.js"]