FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv curl software-properties-common && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install
RUN python3 -m venv venv

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]