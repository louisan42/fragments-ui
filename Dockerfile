# Docker file for containerize fragment microservice

#Stage 0: Install dependencies
# Use node version 16.15.
FROM node:16.16.0 AS dependencies


LABEL maintainer="Louis Amoah-Nuamah <lamoah-nuamah@myseneca.ca>" \
    description="Fragment-UI node.js microservice"

# We default to use port 8080 in our service.
#ENV PORT=3000

# Reduce npm span when installing with Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

ENV NODE_ENV=production

# Use /app as the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to /app
COPY --chown=node:node package.json package-lock.json .env ./

  
# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

######################################################################################

#Stage 1: Use dependencies to build the application
FROM node:16.16-alpine@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS builder

WORKDIR /app

#Copy cached dependencies to /app
COPY --chown=node:node --from=dependencies /app /app

# Copy src code into image
COPY --chown=node:node ./src ./src


# Copy public folder into image
COPY --chown=node:node ./public ./public 

# Build app
RUN npm run build

######################################################################################

#Stage 2: Run the application on nginx web server
FROM nginx:stable-alpine@sha256:0a88a14a264f46562e2d1f318fbf0606bc87e72727528b51613a5e96f483a0f6 AS deploy

COPY --chown=nginx:nginx --from=builder /app/build /usr/share/nginx/html/

# Install curl
RUN apk --no-cache add curl=7.83.1-r2

#ENV PORT=80
# We run our service on port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=15s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:80 || exit 1
