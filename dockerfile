FROM ubuntu:22.04

RUN apt-get update

RUN apt-get install python3 python3-pip python3-venv curl software-properties-common -y

RUN apt-get upgrade -y

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install nodejs -y

WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm audit fix --legacy-peer-deps
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --upgrade pip setuptools wheel

EXPOSE 3000

CMD ["bash", "-c", "source /app/venv/bin/activate && npm run dev"]
