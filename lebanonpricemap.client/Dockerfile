# Frontend Dockerfile (React + Vite)

# ---- build stage -----------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# copy package manifests first for caching
COPY package*.json ./
RUN npm ci --silent

# copy source
COPY . .

# inject API URL at build-time via environment variable
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ---- runtime stage ---------------------------------------------------------
FROM nginx:alpine AS runtime
# non-root user already defined in nginx image (nginx)

# remove default config and add our own
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/spa.conf

WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
