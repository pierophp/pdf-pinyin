FROM node:10

ENV TERM xterm

RUN apt-get update && apt-get install -y \
    poppler-utils && \
    rm -rf /var/lib/apt/lists/*
