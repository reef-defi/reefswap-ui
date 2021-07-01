FROM ubuntu:18.04 as builder

# Install any needed packages
RUN apt-get update && apt-get install -y curl git gnupg

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

WORKDIR /apps
COPY . .

RUN npm install yarn -g
RUN yarn && NODE_ENV=production yarn build
CMD ["ls", "-al", "build"]

# ===========================================================
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /apps/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
