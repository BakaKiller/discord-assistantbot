FROM node:buster-slim

RUN apt-get update && apt-get install git curl -y && mkdir -p /var/lib/discord-assistantbot

WORKDIR /var/lib/discord-assistantbot
COPY ./startscript /usr/local/bin/startscript

ENTRYPOINT ["/usr/local/bin/startscript"]
CMD /var/lib/discord-assistantbot/bot.js